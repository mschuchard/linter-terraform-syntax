![Preview](https://raw.githubusercontent.com/mschuchard/linter-terraform-syntax/master/linter_terraform_syntax.png)

### Linter-Terraform-Syntax
`Linter-Terraform-Syntax` aims to provide functional and robust `terraform validate` linting functionality within Atom.

### Installation
`Terraform` is required to be installed before using this. The `Linter` and `Language-Terraform` atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- In the package settings there is an option to use `terraform plan` instead of `terraform validate`. Both options will show syntax errors for the current file and notify of the presence of non-syntax validation errors for the current directory. The plan option will additionally notify of the presence of non-syntax plan errors for the current directory. The actual error messages will be captured in an upcoming version.
