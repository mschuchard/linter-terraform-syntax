# No validate error
#
# Plan error in format of
# Error refreshing state: 1 error(s) occurred:
#
# * data.terraform_remote_state.state: 1 error(s) occurred:
#
# * data.terraform_remote_state.state: data.terraform_remote_state.state: error initializing backend: Not a valid region: region
#
# Cannot seem to reproduce https://stackoverflow.com/questions/42886251/migrating-from-remote-state-to-backend-in-terraform-0-9

data "terraform_remote_state" "state" {
  backend = "s3"

  config {
    bucket = "terraform-state-environment"
    key    = "network/terraform.tfstate"
    region = "region"
  }
}
