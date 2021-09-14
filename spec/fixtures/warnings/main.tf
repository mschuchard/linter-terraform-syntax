# this fixture tests for warnings; >= 0.14 automatically fixes the warnings though
provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}
