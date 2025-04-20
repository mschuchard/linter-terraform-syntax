'use babel';

export default {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/bin/terraform) if not in shell env path.',
      default: 'terraform',
      order: 1,
    },
    blacklist: {
      title: 'Exclude Regexp for .tf',
      type: 'string',
      description: 'Regular expression for Terraform filenames to ignore (e.g. foo|[bB]ar would ignore afoo.tf and theBar.tf).',
      default: '',
    },
    timeout: {
      title: 'Linting Timeout',
      type: 'number',
      description: 'Number of seconds to wait on lint attempt before timing out.',
      default: 10,
    },
    format: {
      title: 'Auto Formatting',
      type: 'object',
      properties: {
        enabled: {
          title: 'Use Terraform Fmt',
          description: 'Use \'terraform fmt\' to rewrite all Terraform files in the directory of the current file to a canonical format (occurs before linting).',
          type: 'boolean',
          default: false,
        },
        currentFile: {
          title: 'Format Current File',
          description: 'Only format the currently opened file instead of all files in the directory. Functional only if auto-formatting is also enabled.',
          type: 'boolean',
          default: false,
        },
        recursive: {
          title: 'Recursive Format',
          description: 'Recursively format all Terraform files from the directory of the current file. Functional only if auto-formatting is also enabled.',
          type: 'boolean',
          default: false,
        },
      },
    },
  },

  // activate linter
  activate() {
    const helpers = require('atom-linter');

    // error on terraform < 0.12
    helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '--help']).then(output => {
      if (!(/-json/.exec(output))) {
        atom.notifications.addError(
          'The terraform executable installed in your path is unsupported.',
          {
            detail: 'Please upgrade your version of Terraform to >= 0.12 (>= 1.0 preferred), or downgrade this package to 1.4.1.'
          }
        );
      }
    });
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'project',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const editorFile = process.platform === 'win32' ? textEditor.getPath().replace(/\\/g, '/') : textEditor.getPath();

        // try to get file path and handle errors appropriately
        let dir = '';
        try {
          // const is block scoped in js for some reason
          dir = require('path').dirname(editorFile);
        } catch (error) {
          // notify on stdin error
          if (/\.dirname/.exec(error.message) != null) {
            atom.notifications.addError(
              'Terraform cannot lint on stdin due to nonexistent pathing on directories. Please save this config to your filesystem.',
              { detail: 'Save this config.' }
            );
          } else {
            // notify on other errors
            atom.notifications.addError(
              'An error occurred with linter-terraform-syntax.',
              { detail: error.message }
            );
          }
        }

        // bail out if this is on the blacklist
        if (atom.config.get('linter-terraform-syntax.blacklist') !== '') {
          const blacklist = new RegExp(atom.config.get('linter-terraform-syntax.blacklist'));

          if (blacklist.exec(editorFile)) return [];
        }

        // auto-formatting
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat') || atom.config.get('linter-terraform-syntax.format.enabled')) {
          const fmtArgs = ['fmt', '-list=false', '-no-color'];

          // recursive format if selected
          if (atom.config.get('linter-terraform-syntax.recursiveFormat') || atom.config.get('linter-terraform-syntax.format.recursive'))
            fmtArgs.push('-recursive');

          // select the target for the auto-formatting
          if (atom.config.get('linter-terraform-syntax.formatCurrentFile') || atom.config.get('linter-terraform-syntax.format.currentFile'))
            fmtArgs.push(editorFile);

          // auto-format the target
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), fmtArgs, { cwd: dir }).catch(error => {
            // verify this is not a config file since validate returns for those files
            if (!(/\.tf$/.exec(editorFile))) {
              // catch format errors and display as pulsar warning
              atom.notifications.addWarning(
                'An error occurred during automatic formatting of a non-config file.',
                {
                  detail: error.message,
                  dismissable: true,
                }
              );
            }
          });
        }

        // execute the linting
        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '-no-color', '-json'], { cwd: dir, ignoreExitCode: true, timeout: atom.config.get('linter-terraform-syntax.timeout') * 1000 }).then(output => {
          const toReturn = [];

          // parse json output
          const info = JSON.parse(output);
          // assign formatVersion for future use
          // const formatVersion = info.format_version;

          // command is reporting an issue
          if (info.valid === false) {
            info.diagnostics.forEach((issue) => {
              // if no range information given then we have to improvise
              let file = dir;
              let lineStart = 0;
              let lineEnd = 0;
              let colStart = 0;
              let colEnd = 1;

              // we have range information so use it
              if (issue.range != null) {
                file = dir + require('path').sep + issue.range.filename;
                lineStart = issue.range.start.line - 1;
                lineEnd = issue.range.end.line - 1;
                colStart = issue.range.start.column - 1;
                colEnd = issue.range.end.column;
                // otherwise check if we need to fix dir display
                // add empty char to file path to circumvent unwanted relativization causing empty path display
              } else if (atom.project.relativizePath(file)[0] === dir) file += ' ';

              toReturn.push({
                severity: issue.severity,
                excerpt: issue.detail === '' ? issue.summary : issue.detail,
                location: {
                  file,
                  position: [[lineStart, colStart], [lineEnd, colEnd]],
                },
              });
            });
          }
          return toReturn;
        });
      }
    };
  }
};
