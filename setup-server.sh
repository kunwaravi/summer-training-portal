#!/bin/bash
set -e

echo "=========================================="
echo "    EduNexus Pro - Server Setup "
echo "=========================================="

echo "[1/4] Updating package lists..."
sudo apt-get update -y

echo "[2/4] Installing dependencies..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git ufw

echo "[3/4] Installing Docker & Docker Compose..."
if ! command -v docker &> /dev/null
then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully. You may need to log out and log back in for group changes to take effect."
else
    echo "Docker is already installed."
fi

# Ensure docker-compose is available (v2 is typically included in modern Docker, aliased to `docker compose`)
if ! command -v docker-compose &> /dev/null
then
    echo "Installing docker-compose standalone..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "[4/4] Configuring UFW Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

echo "=========================================="
echo " Setup complete! Next steps: "
echo " 1. Clone your repository if you haven't: git clone <your_repo_url>"
echo " 2. cd into the project folder"
echo " 3. cp .env.example .env and fill in your secrets"
echo " 4. Run ./deploy.sh"
echo "=========================================="
