# No validate error.
# Plan error in format of:
# 1 error(s) occurred:
#
# * digitalocean_ssh_key.key: 1 error(s) occurred:
#
# * digitalocean_ssh_key.key: file: open /foo/bar/baz: no such file or directory in:
#
# ${file("/foo/bar/baz")}

provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_ssh_key" "key" {
  name       = "My SSH Key"
  public_key = "${file("/foo/bar/baz")}"
}
