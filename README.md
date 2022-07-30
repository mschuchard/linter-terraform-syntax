![Preview](https://raw.githubusercontent.com/mschuchard/linter-terraform-syntax/master/linter_terraform_syntax.png)

### Linter-Terraform-Syntax
[![Build Status](https://travis-ci.com/mschuchard/linter-terraform-syntax.svg?branch=master)](https://travis-ci.com/mschuchard/linter-terraform-syntax)

Linter-Terraform-Syntax aims to provide functional and robust `terraform validate` linting and `fmt` formatting functionality within Atom.

### Atom Editor Sunset Updates

`apm` was discontinued prior to the sunset by the Atom Editor team. Therefore, the installation instructions are now as follows:

- Locate the Atom packages directory on your filesystem (normally at `<home>/.atom/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom packages directory.
- Execute `npm install` in the package directory.

Additionally, this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
Terraform >= 0.12 is required to be installed (five most recent minor versions are officially supported; check CI matrix) before using this (downgrade to 1.4.1 for 0.11 support). The Linter and Language-Terraform Atom packages are also required.

### Usage
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information. Note this will not work on directory issues since a directory cannot be opened in a pane.
- Support for linting with `plan` was removed in version 1.6.0. Please downgrade to 1.5.1 if you wish to continue linting with `plan`.
