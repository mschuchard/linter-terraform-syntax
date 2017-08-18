'use babel';

import * as path from 'path';

describe('The Terraform Validate provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

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
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 13], [8, 14]]);
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
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 13], [8, 14]]);
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
