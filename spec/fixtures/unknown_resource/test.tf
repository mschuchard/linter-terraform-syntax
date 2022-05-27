provider "digitalocean" {
  token = "12345"
}

resource "digitalocean_domain" "domain" {
  name       = "www.example.com"
  ip_address = digitalocean_droplet.droplet.ipv4_address
}
