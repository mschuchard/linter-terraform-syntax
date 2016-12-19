'use babel';

import * as path from 'path';

describe('The Terraform Validate provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-terraform-validate');
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

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.tf$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Syntax error in test.tf: expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.tf$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Syntax error in test.tf: expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.tf$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  describe('checks a file with a validate issue in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/unknown_resource', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Non-syntax error in directory: resource 'digitalocean_domain.domain' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.ipv4_address");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.tf$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
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
