![Preview](https://raw.githubusercontent.com/mschuchard/linter-terraform-syntax/master/linter_terraform_syntax.png)

### Linter-Terraform-Syntax
`Linter-Terraform-Syntax` aims to provide functional and robust `terraform validate/plan` linting functionality within Atom.

### Installation
`Terraform` is required to be installed before using this. The `Linter` and `Language-Terraform` Atom packages are also required, but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- In the package settings there is an option to use `terraform plan` instead of `terraform validate`. Both options will show syntax errors for files in the current directory and notify non-syntax validation errors for the current directory. The plan option will additionally notify non-syntax plan errors for the current directory.
- To quickly and easily access issues in other files, you will need to change the settings inside `Linter-UI-Default`. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
