provider "google" {
  region = "us-west1"
}

resource "google_compute_instance" "test" {
  name         = "test"
  machine_type = "e2-micro"
  zone         = "us-west1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1804-bionic-v20221201"
      labels = {
        my_label = "value"
      }
    }
  }
}
