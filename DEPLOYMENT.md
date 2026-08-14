# Panduan Setup VPS Fresh & Deployment macOS Web Clone

Panduan lengkap dari awal untuk konfigurasi VPS baru (Ubuntu/Debian) hingga deployment menggunakan Docker dan alur update otomatis dengan Git Pull.

---

## Daftar Isi
1. [Langkah 1: Setup Awal & Update Server VPS](#langkah-1-setup-awal--update-server-vps)
2. [Langkah 2: Install Git, Nginx, Docker, & Docker Compose](#langkah-2-install-git-nginx-docker--docker-compose)
3. [Langkah 3: Clone Repository & Deploy Pertama Kali](#langkah-3-clone-repository--deploy-pertama-kali)
4. [Langkah 4: Alur Update Aplikasi (Git Pull & Rebuild)](#langkah-4-alur-update-aplikasi-git-pull--rebuild)
5. [Langkah 5: Konfigurasi Nginx Reverse Proxy & SSL (HTTPS)](#langkah-5-konfigurasi-nginx-reverse-proxy--ssl-https)
6. [Perintah Maintenance & Troubleshooting](#perintah-maintenance--troubleshooting)

---

## Langkah 1: Setup Awal & Update Server VPS

Masuk ke VPS via SSH dari terminal laptop/PC Anda:
```bash
ssh root@IP_VPS_ANDA
```

Update package index dan upgrade sistem ke versi terbaru:
```bash
sudo apt update && sudo apt upgrade -y
```

Konfigurasi firewall dasar (UFW):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## Langkah 2: Install Git, Nginx, Docker, & Docker Compose

### 1. Install Git, Curl, & Nginx Reverse Proxy
```bash
sudo apt install -y git curl wget ufw nginx certbot python3-certbot-nginx
```

Aktifkan service Nginx agar berjalan otomatis saat boot:
```bash
sudo systemctl enable --now nginx
```

Buka akses Nginx di firewall UFW:
```bash
sudo ufw allow 'Nginx Full'
```

### 2. Install Docker Official Engine
Jalankan script instalasi resmi Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 3. Aktifkan & Jalankan Service Docker
```bash
sudo systemctl enable --now docker
```

### 4. Verifikasi Instalasi Nginx & Docker
```bash
nginx -v
docker --version
docker compose version
```

---

## Langkah 3: Clone Repository & Deploy Pertama Kali

### 1. Clone Repository
Pindah ke direktori `/var/www` atau home direktori Anda:
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/cinnamorollofficials/maco.git
cd maco
```

> **Catatan jika repo bersifat private:** Anda bisa generate SSH key di VPS (`ssh-keygen -t ed25519`) dan tambahkan public key (`cat ~/.ssh/id_ed25519.pub`) ke GitHub -> Settings -> Deploy Keys.

### 2. Build & Jalankan Container
Jalankan Docker Compose untuk mem-build image dan menjalankan container di background:
```bash
docker compose up -d --build
```

### 3. Verifikasi Container Sedang Berjalan
```bash
docker compose ps
```
Output akan menampilkan container `maco-web` dengan status `Up` dan port `0.0.0.0:3000->80/tcp`.

Sekarang buka browser dan akses:
```
http://IP_VPS_ANDA:3000
```

---

## Langkah 4: Alur Update Aplikasi (Git Pull & Rebuild)

Setiap kali ada commit/update baru di branch `main`, lakukan langkah berikut di server:

```bash
# 1. Pindah ke direktori proyek
cd /var/www/maco

# 2. Tarik kode terbaru dari GitHub
git pull origin main

# 3. Build ulang dan jalankan container baru tanpa downtime
docker compose up -d --build

# 4. (Opsional) Bersihkan image lama yang tidak terpakai
docker image prune -f
```

---

### Tips: Buat Script Otomatis `deploy.sh`

Agar update cukup dengan 1 baris perintah, buat script deploy di server:

1. Buat file `deploy.sh`:
```bash
cat << 'EOF' > deploy.sh
#!/bin/bash
set -e

echo "🚀 [1/3] Pulling latest changes from Git..."
git pull origin main

echo "🔨 [2/3] Building and restarting Docker containers..."
docker compose up -d --build

echo "🧹 [3/3] Pruning unused Docker images..."
docker image prune -f

echo "✅ Deployment successful! App is running."
EOF

chmod +x deploy.sh
```

2. Selanjutnya, kapan saja Anda ingin update aplikasi, cukup jalankan:
```bash
./deploy.sh
```

---

## Langkah 5: Konfigurasi Nginx Reverse Proxy & SSL (HTTPS)

Untuk menghubungkan domain kustom Anda (contoh: `maco.domainanda.com`) dan port 80/443 dengan sertifikat SSL gratis dari Let's Encrypt:

### 1. Buat Konfigurasi Reverse Proxy Nginx
```bash
sudo nano /etc/nginx/sites-available/maco
```

Isi dengan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name maco.domainanda.com; # Ganti dengan domain Anda

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/maco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Generate Sertifikat SSL Gratis (HTTPS)
```bash
sudo certbot --nginx -d maco.domainanda.com
```
Certbot akan otomatis mengatur HTTPS dan auto-renewal sertifikat.

---

## Perintah Maintenance & Troubleshooting

| Perintah | Deskripsi |
| :--- | :--- |
| `docker compose logs -f` | Melihat live log dari web server Nginx |
| `docker compose ps` | Memeriksa status kesehatan container |
| `docker compose restart` | Merestart container tanpa rebuild |
| `docker compose down` | Menghentikan dan menghapus container |
| `docker system df` | Melihat penggunaan disk oleh Docker |
| `docker system prune -a` | Membersihkan cache dan image lama yang tidak terpakai |
