# Validate error in format of:
# Error validating: 1 error(s) occurred:
#
#   * resource 'digitalocean_floating_ip.float' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.id

# Plan error in format of:
# module root: 1 error(s) occurred:
#
#   * resource 'digitalocean_floating_ip.float' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.id

provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_domain" "domain" {
  name = "www.example.com"
  ip_address = "${digitalocean_droplet.droplet.ipv4_address}"
}
