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
      }
    }
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
            detail: "Please upgrade your version of Terraform to >= 0.12, or downgrade this package to 1.4.1.\n"
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
        try {
          // const is block scoped in js for some reason
          var dir = require('path').dirname(editorFile);
        }
        catch(error) {
          // notify on stdin error
          if (/\.dirname/.exec(error.message) != null) {
            atom.notifications.addError(
              'Terraform cannot lint on stdin due to nonexistent pathing on directories. Please save this config to your filesystem.',
              { detail: 'Save this config.' }
            );
          }
          // notify on other errors
          else {
            atom.notifications.addError(
              'An error occurred with linter-terraform-syntax.',
              { detail: error.message }
            );
          };
        }

        // bail out if this is on the blacklist
        if (atom.config.get('linter-terraform-syntax.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-terraform-syntax.blacklist'))
          if (blacklist.exec(editorFile))
            return [];
        }

        // auto-formatting
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat') || atom.config.get('linter-terraform-syntax.format.enabled')) {
          var fmtArgs = ['fmt', '-list=false']
          // recursive format if selected
          if (atom.config.get('linter-terraform-syntax.recursiveFormat') || atom.config.get('linter-terraform-syntax.format.recursive'))
            fmtArgs.push('-recursive');
          // select the target for the auto-formatting
          if (atom.config.get('linter-terraform-syntax.formatCurrentFile') || atom.config.get('linter-terraform-syntax.format.currentFile'))
            fmtArgs.push(editorFile);
          // auto-format the target
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), fmtArgs, {cwd: dir})
        }

        // execute the linting
        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '-no-color', '-json'], {cwd: dir, ignoreExitCode: true, timeout: atom.config.get('linter-terraform-syntax.timeout') * 1000}).then(output => {
          var toReturn = [];

          // parse json output
          const info = JSON.parse(output)
          // assign formatVersion for future use
          const formatVersion = info.format_version

          // command is reporting an issue
          if (info.valid == false) {
            info.diagnostics.forEach((issue) => {
              // if no range information given then we have to improvise
              var file = dir;
              var lineStart = 0;
              var lineEnd = 0;
              var colStart = 0;
              var colEnd = 1;

              // we have range information so use it
              if (issue.range != null) {
                file = dir + require('path').sep + issue.range.filename;
                lineStart = issue.range.start.line - 1;
                lineEnd = issue.range.end.line - 1;
                colStart = issue.range.start.column - 1;
                colEnd = issue.range.end.column;
              }
              // otherwise check if we need to fix dir display
              else if (atom.project.relativizePath(file)[0] == dir)
                // add empty char to circumvent unwanted relativization causing the empty path display
                file += ' '

              toReturn.push({
                severity: issue.severity,
                excerpt: issue.detail == null ? issue.summary : issue.detail,
                location: {
                  file: file,
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
