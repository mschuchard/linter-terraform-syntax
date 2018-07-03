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
        const file = process.platform === 'win32' ? activeEditor.getPath().replace(/\\/g, '/') : activeEditor.getPath();
        const dir = require('path').dirname(file);
        // regexps for matching on output
        const regex_syntax = /Error.*\/(.*\.tf):\sAt\s(\d+):(\d+):\s(.*)/;
        const new_regex_syntax = /Error:.*\/(.*\.tf): (.*:).* at (\d+):(\d+):(.*)/;
        const alt_regex_syntax = /Error:.*\/(.*\.tf): (.*) at (\d+):(\d+):.* at \d+:\d+(: .*)/;
        const dir_error = /\* (.*)/;
        const new_dir_error = /Error: (.*)/;
        // ensure useless block info is not captured and displayed
        const regex_block = /occurred/;

        // establish args
        var args = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? ['plan'] : ['validate'];
        args.push('-no-color')

        // execute terraform fmt if selected
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat'))
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['fmt', '-list=false', dir])

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), args, {cwd: dir, stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            if (process.platform === 'win32')
              line = line.replace(/\\/g, '/')

            // matchers for output parsing and capturing
            const matches_syntax = regex_syntax.exec(line);
            const matches_new_syntax = new_regex_syntax.exec(line);
            const matches_alt_syntax = alt_regex_syntax.exec(line);
            const matches_dir = dir_error.exec(line);
            const new_matches_dir = new_dir_error.exec(line);
            const matches_block = regex_block.exec(line);

            // check for syntax errors in directory
            if (matches_syntax != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_syntax[4],
                location: {
                  file: dir + '/' + matches_syntax[1],
                  position: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]],
                },
              });
            }
            // check for new or alternate format syntax errors in directory (alt first since new also captures alt but botches formatting)
            else if ((matches_alt_syntax != null) || (matches_new_syntax != null)) {
              matches = matches_alt_syntax == null ? matches_new_syntax : matches_alt_syntax;

              toReturn.push({
                severity: 'error',
                excerpt: matches[2] + matches[5],
                location: {
                  file: dir + '/' + matches[1],
                  position: [[Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4]) - 1], [Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4])]],
                },
              });
            }
            // check for non-syntax errors in directory and account for changes in newer format
            else if ((matches_dir != null || new_matches_dir != null) && matches_block == null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_dir == null ? 'Non-syntax error in directory: ' + new_matches_dir[1] + '.' : 'Non-syntax error in directory: ' + matches_dir[1] + '.',
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
