"use babel";

export default {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/terraform/bin/terraform) if not in shell env path.',
      default: 'terraform'
    },
  },

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
        const helpers = require('atom-linter');
        const path = require('path');
        const file = activeEditor.getPath();
        //const filename = /.*\/([a-zA-Z]+)\.tf/.exec(file);
        const regex = /^.*Error.*:\sAt\s(\d+):(\d+):\s(.*)$/;
        //const regex = new RegExp("^.*Error.*" + filename + ":\sAt\s(\d+):(\d+):\s(.*)$");

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', path.dirname(file)], {stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches != null) {
              toReturn.push({
                type: 'Error',
                text: matches[3],
                range: [[Number.parseInt(matches[1]) - 1, Number.parseInt(matches[2]) - 1], [Number.parseInt(matches[1]) - 1, Number.parseInt(matches[2])]],
                filePath: file
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
