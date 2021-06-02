![Preview](https://raw.githubusercontent.com/mschuchard/linter-terraform-syntax/master/linter_terraform_syntax.png)

### Linter-Terraform-Syntax
[![Build Status](https://travis-ci.com/mschuchard/linter-terraform-syntax.svg?branch=master)](https://travis-ci.com/mschuchard/linter-terraform-syntax)

Linter-Terraform-Syntax aims to provide functional and robust `terraform validate` linting and `fmt` formatting functionality within Atom.

### Installation
Terraform >= 0.12 is required to be installed before using this (downgrade to 1.4.1 for 0.11 support). The Linter and Language-Terraform Atom packages are also required.

### Usage
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information. Note this will not work on directory issues since a directory cannot be opened in a pane.
- Support for linting with `plan` was dropped in version 1.6.0. Please downgrade to 1.5.1 if you wish to continue linting with `plan`.
