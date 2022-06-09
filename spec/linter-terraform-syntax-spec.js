'use babel';

import * as path from 'path';

describe('The Terraform provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-terraform-syntax');
      return atom.packages.activatePackage('language-terraform').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures/clean', 'test.tf'))
      );
    });
  });

  describe('checks a file with a syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('An argument or block definition is required here. To set an argument, use the equals sign "=" to introduce the argument value.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+syntax\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[3, 2], [3, 9]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test_two.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('An argument or block definition is required here. To set an argument, use the equals sign "=" to introduce the argument value.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+syntax\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[3, 2], [3, 9]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with the new format', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/unexpected_paran', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('An argument definition must end with a newline.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+unexpected_paran\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 38], [1, 40]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('The argument "source" is required, but no definition was found.');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+unexpected_paran\/test\.tf$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 13], [0, 15]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with an alternate format', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/bad_var_interpolate', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('A comma is required to separate each function argument from the next.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+bad_var_interpolate\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[5, 6], [5, 8]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with an alternate format in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/bad_var_interpolate', 'test_two.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('A comma is required to separate each function argument from the next.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+bad_var_interpolate\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[5, 6], [5, 8]]);
        });
      });
    });
  });

  describe('checks a file with an unknown resource in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/unknown_resource', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Non-syntax error in directory: resource 'digitalocean_domain.domain' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.ipv4_address.");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+unknown_resource$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a syntax error with no detail diganostic value', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/detail_empty', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('"name" may only contain alphanumeric characters, dash, underscores, parentheses and periods');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+detail_empty\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 9], [1, 10]]);
        });
      });
    });
  });

  describe('checks a file with a required field missing in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/required_field', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Non-syntax error in directory: digitalocean_floating_ip.float: "region": required field is not set.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+required_field$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('Non-syntax error in directory: digitalocean_floating_ip.float: droplet_id: cannot parse \'\' as int: strconv.ParseInt: parsing "droplet": invalid syntax.');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+required_field$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a missing file in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/missing_file', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Invalid value for "path" parameter: no file exists at "/foo/bar/baz"; this function works only with files that are distributed as part of the configuration source code, so if this file will be created by a resource in this configuration you must instead obtain this result from an attribute of that resource.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+missing_file\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[1, 21], [1, 34]]);
        });
      });
    });
  });

  describe('checks a file with warnings in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/warnings', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(3);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toMatch(/Terraform 0\.11 and earlier/);
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+warnings\/test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures/clean', 'test.tf');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
