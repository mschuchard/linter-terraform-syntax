### Next (Roadmap)
- jasmine+babel
- terraform fmt --help
- output changed in 0.9 for missing_file and unknown_resource to give block info like packer/vagrant (but this already exists in specific errors so no capture necessary)

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
