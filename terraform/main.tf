provider "google" {
  region = "us-west1"
}

resource "google_compute_firewall" "allow-firewall" {
  name    = "allow-firewall"
  network = "default"

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["firewall"]

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "8080", "3389"]
  }
}

resource "google_compute_instance" "myinstance" {
  name         = "myinstance"
  machine_type = "e2-micro"
  zone         = "us-west1-c"

  allow_stopping_for_update = true

  tags = ["firewall"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1804-bionic-v20221201"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral public IP
    }
  }
}
