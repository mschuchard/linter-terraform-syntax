### Next (Roadmap)
- Added option to set global var files for all projects.
- Added option to set local var files for each project.

eventually require 0.11 as minimum and remove old regexps
only show error for directory once per open file
"file" not showing for .tf in bisam
option to ignore "required variable not set" unless module block in current file
why are displayed errors being cached in linter display until i reload

### 1.2.5
- Added option to exclude `.tf` filenames that match a regexp from linting.
- Updated `atom-linter` dependency.
- Catch linting on nonexistent files.

### 1.2.4
- Removing deprecation warning parsing since it does not seem to actually exist.
- Slight output parsing optimization.
- Adding proper capturing for new syntax error format.
- Notify when `terraform init` is necessary for solving issues in the directory.

### 1.2.3
- Added proper capturing for syntax errors in alternate format.

### 1.2.2
- Updated format captures and directory execution for 0.10 compatibility issues.

### 1.2.1
- Prevent displaying useless block info line for directory errors in Terraform >= 0.9.
- Added `terraform fmt` config option.
- Fixed path issue with Windows `\` versus expected `/` in Terraform.

### 1.2.0
- Switched to using Linter v2 API.
- Removed `atom-package-deps` dependency and functionality.

### 1.1.2
- Syntax errors for other files in the directory are now displayed within those files.
- Non-syntax directory error message no longer has superfluous current file.
- Removed color codes from displayed messages where applicable.
- Experimental support for capturing deprecation warnings.

### 1.1.1
- Capture error messages for all kinds of formatted `validate` and `plan` non-syntax errors in directory.
- Notify syntax errors for other Terraform files in directory.
- Removed range 1 where unnecessary.

### 1.1.0
- Added severity key.
- Show syntax errors for only active file and not all files in active directory.
- Add `terraform plan` option.

### 1.0.0
- Initial version ready for wide usage.
