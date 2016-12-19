# totally fine
provider "aws" {
  access_key = "123"
  secret_key = "456"
  region     = "789"
}

resource "aws_instance" "example" {
  ami           = "AMI"
  instance_type = "t2.micro"
}
