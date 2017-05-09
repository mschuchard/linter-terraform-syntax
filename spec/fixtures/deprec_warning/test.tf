# No validate error
#
# Plan error in format of
# Error refreshing state: 1 error(s) occurred:
#
# * data.terraform_remote_state.state: RequestError: send request failed
# caused by: Get https://terraform-state-environment.s3.region.amazonaws.com/network/terraform.tfstate: dial tcp: lookup terraform-state-environment.s3.region.amazonaws.com on 127.0.0.1:53: no such host

# PRIMARILY FUTURE HOME OF DEPREC WARNING TEST,

data "terraform_remote_state" "state" {
  backend = "s3"
  config {
    bucket = "terraform-state-environment"
    key = "network/terraform.tfstate"
    region = "region"
  }
}
