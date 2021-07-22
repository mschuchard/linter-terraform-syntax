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
    useTerraformFormat: {
      title: 'Use Terraform Fmt',
      description: 'Use \'terraform fmt\' to rewrite all Terraform files in the directory of the current file to a canonical format (occurs before linting).',
      type: 'boolean',
      default: false,
    },
    formatCurrentFile: {
      title: 'Format Current File',
      description: 'Only format the currently opened file instead of all files in the directory. Functional only if auto-formatting is also enabled.',
      type: 'boolean',
      default: false,
    },
    recursiveFormat: {
      title: 'Recursive Format',
      description: 'Recursively format all Terraform files from the directory of the current file. Functional only if auto-formatting is also enabled.',
      type: 'boolean',
      default: false,
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
    }
  },

  // activate linter
  activate() {
    const helpers = require("atom-linter");

    // auto-detect terraform >= 0.12
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

  provideLinter() {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'project',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const editor_file = process.platform === 'win32' ? activeEditor.getPath().replace(/\\/g, '/') : activeEditor.getPath();
        // try to get file path and handle errors appropriately
        try {
          // const is block scoped in js for some reason
          var dir = require('path').dirname(editor_file);
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
          if (blacklist.exec(editor_file))
            return [];
        }

        // auto-formatting
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat')) {
          var fmt_args = ['fmt', '-list=false']
          // recursive format if selected
          if (atom.config.get('linter-terraform-syntax.recursiveFormat'))
            fmt_args.push('-recursive');
          // select the target for the auto-formatting
          if (atom.config.get('linter-terraform-syntax.formatCurrentFile'))
            fmt_args.push(editor_file);
          // auto-format the target
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), fmt_args, { cwd: dir })
        }

        // execute the linting
        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '-no-color', '-json'], { cwd: dir, ignoreExitCode: true, timeout: atom.config.get('linter-terraform-syntax.timeout') * 1000 }).then(output => {
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
              var line_start = 0;
              var line_end = 0;
              var col_start = 0;
              var col_end = 1;

              // we have range information so use it
              if (issue.range != null) {
                file = dir + '/' + issue.range.filename;
                line_start = issue.range.start.line - 1;
                line_end = issue.range.start.column - 1;
                col_start = issue.range.end.line - 1;
                col_end = issue.range.end.column;
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
                  position: [[line_start, line_end], [col_start, col_end]],
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
