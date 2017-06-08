# No validate error
# Plan error in format of
# 2 error(s) occurred:
#
# * digitalocean_floating_ip.float: cannot parse '' as int: strconv.ParseInt: parsing "droplet": invalid syntax
# * digitalocean_floating_ip.float: "region": required field is not set

provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_floating_ip" "float" {
  droplet_id = "droplet"
}
