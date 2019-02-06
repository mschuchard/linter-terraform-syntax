'use babel';

export default {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/terraform/bin/terraform) if not in shell env path.',
      default: 'terraform',
      order: 1,
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
    },
    blacklist: {
      title: 'Exclude Regexp for .tf',
      type: 'string',
      description: 'Regular expression for .tf filenames to ignore (e.g. foo|[bB]ar would ignore afoo.tf and theBar.tf).',
      default: '',
    },
    globalVarFiles: {
      title: 'Global Var Files',
      type: 'array',
      description: 'Var files specified by absolute paths that should be applied to all projects.',
      default: [''],
      items: {
        type: 'string'
      }
    },
    localVarFiles: {
      title: 'Local Var Files',
      type: 'array',
      description: 'Var files specified by relative paths to each project that should be applied. If these files are not in the same relative path within each project this will fail.',
      default: [''],
      items: {
        type: 'string'
      }
    },
    ignoreUnsetVar: {
      title: 'Ignore Unset Variable Error',
      type: 'boolean',
      description: 'Ignore the "required variable not set" error (useful for module development).',
      default: false
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

        // bail out if this is on the blacklist
        if (atom.config.get('linter-terraform-syntax.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-terraform-syntax.blacklist'))
          if (blacklist.exec(file))
            return [];
        }

        //atom.workspace.getTextEditors().forEach(function(textEditor) is not iterating over an array for some reason (either empty array from getTextEditors or forEach lambda is wrong probably)
        // bail out if another file is already open from the current directory
        // this prevents displaying the same issues for the same directory multiple times
        //atom.workspace.getTextEditors().forEach(function(textEditor) {
          //const other_file = process.platform === 'win32' ? textEditor.getPath().replace(/\\/g, '/') : textEditor.getPath();
          //const other_dir = require('path').dirname(other_file);
          //return [{
            //severity: 'info',
            //excerpt: other_dir,
            //location: {
              //file: dir,
              //position: [[0, 0], [0, 1]],
            //},
          //}]
          //if (dir == other_dir)
            //return [];
          // of course, this also prevents displaying new errors if another file from the same directory is open, so block off for now
        //});

        // regexps for matching syntax errors on output
        const regex_syntax = /Error.*\/(.*\.tf):\sAt\s(\d+):(\d+):\s(.*)/;
        const new_regex_syntax = /Error:.*\/(.*\.tf): (.*:).* at (\d+):(\d+):(.*)/;
        const alt_regex_syntax = /Error:.*\/(.*\.tf): (.*) at (\d+):(\d+):.* at \d+:\d+(: .*)/;
        // regexps for matching non-syntax errors on output
        const dir_error = /\* (.*)/;
        const new_dir_error = /Error: (.*)/;

        // establish args
        var args = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? ['plan'] : ['validate'];
        args.push('-no-color')

        // add global var files
        if (atom.config.get('linter-terraform-syntax.globalVarFiles')[0] != '')
          for (i = 0; i < atom.config.get('linter-terraform-syntax.globalVarFiles').length; i++)
            args = args.concat(['-var-file', atom.config.get('linter-terraform-syntax.globalVarFiles')[i]]);

        // add local var files
        if (atom.config.get('linter-terraform-syntax.localVarFiles')[0] != '')
          for (i = 0; i < atom.config.get('linter-terraform-syntax.localVarFiles').length; i++)
            args = args.concat(['-var-file', atom.config.get('linter-terraform-syntax.localVarFiles')[i]]);

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
            const matches_new_dir = new_dir_error.exec(line);
            // ensure useless block info is not captured and displayed
            const matches_block = /occurred/.exec(line);
            // recognize and display when terraform init would be more helpful
            const matches_init = /error satisfying plugin requirements/.exec(line)

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
            // check if terraform init should be executed
            else if (matches_init != null) {
              toReturn.push({
                severity: 'error',
                excerpt: 'An error is resulting from an issue that can be identified/remedied by executing terraform init in this directory.',
                location: {
                  file: dir,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
            // check for non-syntax errors in directory and account for changes in newer format
            else if ((matches_dir != null || matches_new_dir != null) && matches_block == null) {
              matches = matches_dir == null ? matches_new_dir[1] : matches_dir[1]

              // ignore required variable not set error if requested
              if (!((atom.config.get('linter-terraform-syntax.ignoreUnsetVar')) && (matches =~ /required variable not set/))) {
                toReturn.push({
                  severity: 'error',
                  excerpt: 'Non-syntax error in directory: ' + matches + '.',
                  location: {
                    file: dir,
                    position: [[0, 0], [0, 1]],
                  },
                });
              }
            }
          });
          return toReturn;
        })
        .catch(error => {
          // check for stdin lint attempt
          if (/\.dirname/.exec(error.message) != null) {
            toReturn.push({
              severity: 'info',
              excerpt: 'Terraform cannot lint on stdin due to nonexistent pathing on directories. Please save this config to your filesystem.',
              location: {
                file: 'Save this config.',
                position: [[0, 0], [0, 1]],
              },
            });
          }
          return toReturn;
        });
      }
    };
  }
};
