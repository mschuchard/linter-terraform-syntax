provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_floating_ip" "float" {
  droplet_id = "droplet"
}
