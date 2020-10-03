![Preview](https://raw.githubusercontent.com/mschuchard/linter-terraform-syntax/master/linter_terraform_syntax.png)

### Linter-Terraform-Syntax
[![Build Status](https://travis-ci.org/mschuchard/linter-terraform-syntax.svg?branch=master)](https://travis-ci.org/mschuchard/linter-terraform-syntax)

Linter-Terraform-Syntax aims to provide functional and robust `terraform validate` and `plan` linting and `fmt` formatting functionality within Atom.

### Installation
Terraform >= 0.12 is required to be installed before using this (downgrade to 1.4.1 for 0.11 support). The Linter and Language-Terraform Atom packages are also required.

### Usage
- In the package settings there is an option to use `terraform plan` instead of `terraform validate`. Both options will show syntax errors for files in the current directory and notify non-syntax validation errors for the current directory. The plan option will additionally notify non-syntax plan errors for the current directory, but it will take longer to execute. As of Terraform version 0.10, `terraform validate` now catches many more issues that it previously missed and `terraform plan` found.
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information. Note this will not work on directory issues since a directory cannot be opened in a pane.
