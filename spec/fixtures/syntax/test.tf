# Plan error in format of:
# Failed to load root config module: Error parsing syntax/test.tf: At 11:14: expected: IDENT | STRING | ASSIGN | LBRACE got: SUB
provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     - var.region
}

resource "aws_instance" "example" {
  ami           = var.amis[var.region]
  instance_type = "t2.micro"
}
