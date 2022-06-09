resource "digitalocean_domain" "domain" {
  name       = "www.example.com"
  ip_address = digitalocean_droplet.droplet.ipv4_address
}
