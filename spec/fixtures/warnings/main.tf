# this fixture tests for warnings; >= 0.14 fmt automatically fixes the warnings though
locals {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}
