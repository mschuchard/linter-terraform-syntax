locals {
  kube_config_static = "${merge(
    var.kube_config_static,
    map(
      "client_cert", "${file("${kube_config_path}/../client-cert.pem")}"
      "client_key", "${file("${kube_config_path}/../client-key.pem")}"
      "cluster_ca_cert", "${file("${kube_config_path}/../cluster-ca-cert.pem")}"
    )
  )}"
}
