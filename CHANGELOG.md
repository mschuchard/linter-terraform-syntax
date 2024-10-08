### 1.6.3 (Next)
- Warn on automatic formatting errors returned for non-config Terraform files.
improve warn to only display non-config file issues?
improve warn to only trigger when all issues derive from only non-config files?
line/col parseint?

### 1.6.2
- Refactor auto formatting config options.
- Support deprecation for Terraform 0.12.
- Fix missing detail conditional from `null` to empty string.

### 1.6.1
- Update displayed information for File to be platform independent.
- Updates to Linter API usage.
- Fix inaccurate location position regression.

### 1.6.0
- Add config option for recursive auto-formatting.
- Drop support for `plan`.

### 1.5.1
- Remove description and replace summary in excerpt with details.
- Backup to validate summary if detail is null.
- Modify auto-formatting to execute from current file's directory.

### 1.5.0
- Add config setting to only auto-format the currently opened file.
- Minimum supported version now 0.12.

### 1.4.1
- Add `timeout` option to config settings.
- Circumvent atom-linter displaying only a file in the issue path for Terraform 0.12.

### 1.4.0
- Update linter scope to project level.
- Full 0.12 support and auto-detection.

### 1.3.1
- Add Beta support for Terraform >= 0.12.

### 1.3.0
- Remove specific check for `terraform init` prerequisite.
- Establish 0.11 as minimum version of Terraform.
- Fix check on linting nonexistent files.
- Improve required variable check disable.

### 1.2.6
- Added option to set global var files for all projects.
- Added option to set local var files for each project.
- Added option to ignore 'required variable not set' error.
- Improve ability to recognize necessary `terraform init`.
- Circumvent atom-linter displaying a blank file path when the linted file is in the root directory of the Atom project.

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
