### Next (Roadmap)
- Switched to using Linter v2 API.
- jasmine+babel
- finish deprec warning capture (>= 0.9)
- deprec warning test throws unaccounted for error format
- clean spec now throws plan error
- terraform fmt --help

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
