'use babel';

export default {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/terraform/bin/terraform) if not in shell env path.',
      default: 'terraform',
    },
    useTerraformPlan: {
      title: 'Use Terraform Plan',
      description: 'Use \'terraform plan\' instead of \'validate\' for linting (will also display plan errors for directory of current file)',
      type: 'boolean',
      default: false,
    },
    useTerraformFormat: {
      title: 'Use Terraform Fmt',
      description: 'Use \'terraform fmt\' to rewrite all Terraform files in the directory of the current file to a canonical format (occurs before linting).',
      type: 'boolean',
      default: false,
    }
  },

  provideLinter() {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'file',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const path = require('path');
        var activeFilePath = activeEditor.getPath();
        const file = process.platform === 'win32' ? activeFilePath.replace(/\\/g, '/') : activeFilePath;
        const dir = path.dirname(file);
        // regexps for matching on output
        const regex_syntax = /Error.*\/(.*):\sAt\s(\d+):(\d+):\s(.*)/;
        const correct_file = new RegExp(file);
        const dir_error = /\* (.*)/;
        const regex_warning = /Deprecation warning: (.*)/;
        // ensure useless block info is not captured and displayed
        const regex_block = /^(?!.*occurred)/;

        // establish args
        var args = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? ['plan'] : ['validate'];
        args = args.concat(['-no-color', dir]);

        // execute terraform fmt if selected
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat'))
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['fmt', '-list=false', dir])

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), args, {stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            // matchers for output parsing and capturing
            if (process.platform === 'win32' ) {
              line = line.replace(/\\/g, '/');
            }
            const matches_syntax = regex_syntax.exec(line);
            const matches_file = correct_file.exec(line);
            const matches_dir = dir_error.exec(line);
            const matches_warning = regex_warning.exec(line);
            const matches_block = regex_block.exec(line);

            // check for deprecation warnings
            if (matches_warning != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: matches_warning[1],
                location: {
                  file: dir,
                  position: [[0, 0], [0, 1]],
                },
              });
            }

            // check for syntax errors in current file
            if (matches_syntax != null && matches_file != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_syntax[4],
                location: {
                  file: file,
                  position: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]],
                },
              });
            }
            // check for syntax errors in directory
            else if (matches_syntax != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_syntax[4],
                location: {
                  file: dir + '/' + matches_syntax[1],
                  position: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]],
                },
              });
            }
            // check for non-syntax errors in directory
            else if (matches_dir != null && matches_block != null) {
              toReturn.push({
                severity: 'error',
                excerpt: 'Non-syntax error in directory: ' + matches_dir[1] + '.',
                location: {
                  file: dir,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
