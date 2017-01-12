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
      title: 'Use \'terraform plan\' instead of \'validate\' (will also display plan errors for directory of current file)',
      type: 'boolean',
      default: false,
    }
  },

  // activate linter
  activate: () => {
    require('atom-package-deps').install('linter-terraform-syntax');
  },

  provideLinter: () => {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const path = require('path');
        const arg = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? 'plan' : 'validate'
        const file = activeEditor.getPath();
        // regexps for matching on output
        const regex_syntax = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? /Error.*\/(.*):\sAt\s(\d+):(\d+):\s(.*)\[0m\[0m/ : /Error.*\/(.*):\sAt\s(\d+):(\d+):\s(.*)/;
        const correct_file = new RegExp(file);
        const dir_error = /\* (.*)/;

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), [arg, path.dirname(file)], {stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            // matchers for output parsing and capturing
            const matches_syntax = regex_syntax.exec(line);
            const matches_file = correct_file.exec(line);
            const matches_dir = dir_error.exec(line);

            // check for syntax errors in current file
            if (matches_syntax != null && matches_file != null) {
              toReturn.push({
                type: 'Error',
                severity: 'error',
                text: matches_syntax[4],
                range: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]],
                filePath: file,
              });
            }
            // check for syntax errors in directory
            else if (matches_syntax != null) {
              toReturn.push({
                type: 'Error',
                severity: 'error',
                text: 'Syntax error in ' + matches_syntax[1] + ': ' + matches_syntax[4] + '.',
                filePath: file,
              });
            }
            // check for non-syntax errors in directory
            else if (matches_dir != null) {
              toReturn.push({
                type: 'Error',
                severity: 'error',
                text: 'Non-syntax error in directory: ' + matches_dir[1] + '.',
                filePath: file,
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
