# Maco — macOS Web Portfolio 

A high-fidelity macOS desktop web clone built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Motion** (Framer Motion v12). Designed as an interactive portfolio experience for **Hadi Gunawan**.

---

## 🌟 Fitur Utama

- **🖥️ Native macOS Desktop Experience**
  - **Menu Bar (TopBar)**: Apple menu interaktif (*About This Mac*, *System Settings*, *Restart*), status Control Center (Wi-Fi, Bluetooth, Dark Mode, Sliders), dan jam tanggal lokal.
  - **Dock**: Animasi bouncing launch icon, active indicator dots, drag-to-trash support.
  - **Window Management**: Window dapat digeser (*drag*), diatur ulang ukurannya (*resizable corner handles*), minimize, maximize, dan *cascading initial position* bertingkat.
  - **Widgets Layer**: Widget Jam/Kalender dinamis dan Widget Cuaca live.
  - **Desktop Icons & Context Menu**: Seleksi multi-item (*marquee selection*), rename file/folder, buat folder baru, dan ganti wallpaper desktop.

- **📁 Finder & File System**
  - Navigasi folder portofolio: **Project**, **Experience**, **Certificate**, **Documents**, **Downloads**, dan **Recents**.
  - Tautan langsung ke file PDF portofolio asli (`Portofolio Hadi 2026.pdf`), berkas proyek `.url`, ringkasan karier `.txt`, dan sertifikasi `.pdf` / `.png`.
  - Sidebar terorganisir (*Favorites*, *Portfolio*, *iCloud*, *Trash*) dengan fitur *Put Back* dari Trash.

- **🔍 Universal Spotlight Search (`Cmd + Space`)**
  - Pencarian terpadu real-time yang mencakup aplikasi sistem, berkas portofolio Finder, dan catatan pada aplikasi Notes.

- **🚀 Launchpad**
  - Tampilan grid aplikasi layar penuh dengan efek blur dinamis dan kolom pencarian (*search bar*) real-time.

- **📱 Aplikasi Bawaan (Built-in Apps)**
  - **Safari**: Web browser simulator dengan URL input dan embed renderer.
  - **Preview**: PDF & Image Viewer dengan kontrol zoom, rotasi, dan download langsung.
  - **Notes**: Aplikasi catatan interaktif dengan penyimpanan otomatis di `localStorage`, auto-title, dan pencarian catatan.
  - **Terminal**: Terminal simulator interaktif mendukung perintah `ls`, `cd`, `cat`, `pwd`, `whoami`, `date`, `clear`, dan `neofetch`.
  - **Music**: Player Apple Music berestetika tinggi dengan playback progress dan track cover.
  - **Wallpaper Settings**: Pilihan wallpaper resolusi tinggi (Tahoe, Ventura, Monterey, Big Sur) dan gradien warna.
  - **Trash**: Keranjang sampah dengan fitur empty trash dan put back item ke lokasi asalnya.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan `@tailwindcss/vite`
- **Animations**: [Motion](https://motion.dev/) (Framer Motion v12)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Docker](https://www.docker.com/), [Nginx Alpine](https://nginx.org/), Docker Compose

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- Node.js versi 20+
- npm versi 10+

### Instalasi & Menjalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/cinnamorollofficials/maco.git
cd maco

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser Anda di `http://localhost:3000`.

### Build untuk Produksi

```bash
# Validasi type checking
npm run lint

# Build static bundle
npm run build

# Preview hasil build
npm run preview
```

---

## 🐳 Deployment dengan Docker

Projek ini sudah dilengkapi konfigurasi multi-stage build `Dockerfile` dan `docker-compose.yml`:

```bash
# Build dan jalankan container di background
docker compose up -d --build

# Cek status container
docker compose ps
```

Aplikasi akan aktif di `http://localhost:3000` (atau IP VPS Anda).

> Untuk panduan deployment lengkap pada VPS Ubuntu/Debian dengan Nginx Reverse Proxy dan SSL Certbot, lihat [DEPLOYMENT.md](file:///Users/hadiyahku/code/maco/DEPLOYMENT.md).

---

## ⌨️ Shortcut Keyboard

| Shortcut | Aksi |
| :--- | :--- |
| `Cmd + Space` | Buka / tutup Spotlight Search |
| `Cmd + Tab` | Berpindah antar jendela aktif |
| `Arrow Up / Down` | Navigasi seleksi icon desktop |
| `Enter` | Buka folder / konfirmasi rename icon |
| `Esc` | Tutup Spotlight / Launchpad / Modal |

---

## 📄 Lisensi & Kontributor

Dibuat oleh **Hadi Gunawan** sebagai portofolio interaktif web desktop modern.
Open-source di bawah lisensi MIT.
