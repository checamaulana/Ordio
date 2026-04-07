# 📋 Product Requirements Document (PRD)
# Sistem Pemesanan QR Code — Kopi Tempo

---

## 1. Gambaran Umum

**Nama Produk:** Sistem Pemesanan QR Code — Kopi Tempo  
**Jenis Aplikasi:** Web Application (responsive)  
**Bahasa Tampilan:** Bahasa Indonesia  
**Tanggal Dokumen:** 17 Maret 2026  

### 1.1 Deskripsi Singkat

Sistem pemesanan makanan & minuman berbasis QR Code untuk cafe **Kopi Tempo**. Pelanggan memindai QR Code statis di meja untuk mengakses menu digital, memilih item, dan mengirimkan pesanan langsung ke dashboard kasir. Sistem mendukung pembayaran **cash** dan **QRIS** (statis).

### 1.2 Tujuan

- Menghilangkan kebutuhan pelanggan mengantri di kasir untuk memesan
- Mempercepat proses pemesanan dan mengurangi kesalahan order
- Memberikan kemudahan bagi kasir dalam mengelola pesanan secara real-time
- Menyediakan data penjualan dan laporan untuk pemilik cafe

### 1.3 Batasan Sistem

- Sistem dibuat untuk **1 cafe saja** (bukan multi-outlet)
- Mendukung **dine-in** (via QR Code) dan **takeaway** (diinput khusus oleh kasir)
- Tidak mendukung delivery
- Tidak ada fitur **reservasi meja**
- Tidak ada fitur **struk/receipt** (cetak maupun digital)
- Tidak ada fitur **export laporan** ke Excel/PDF
- Tidak ada fitur **split bill**
- Pelanggan **tidak bisa membatalkan** pesanan setelah dikirim
- Pelanggan **tidak bisa melihat status** pesanan di HP mereka

---

## 2. Target Pengguna (User Roles)

### 2.1 Pelanggan (Guest)

| Atribut | Detail |
|---|---|
| Login | **Tidak perlu** (guest mode) |
| Akses | Melalui QR Code di meja |
| Perangkat | Smartphone (mobile browser) |
| Kemampuan | Memesan Dine-in via QR, atau memesan Takeaway langsung ke kasir |

### 2.2 Kasir / Admin (1 Role, 1 Akun)

| Atribut | Detail |
|---|---|
| Login | **Username & password** |
| Akses | Dashboard web (desktop browser) |
| Multi-user | **Tidak** (hanya 1 akun kasir) |
| Kemampuan | Lihat di bawah |

**Kemampuan Kasir/Admin:**
- Menerima & memproses pesanan masuk
- Menginput pesanan baru spesifik untuk pelanggan **Takeaway**
- Mengubah status pesanan (Diproses → Selesai)
- Menghapus pesanan
- Mengonfirmasi pembayaran (QRIS & Cash)
- Menghitung kembalian (Cash)
- Mengelola menu (CRUD + toggle ketersediaan, promo, diskon, variasi)
- Mengelola meja (tambah, hapus, generate QR, tutup/reset meja)
- Melihat laporan penjualan
- Menyampaikan pesanan ke staff dapur secara **manual** (bukan melalui sistem)

> **Catatan:** Tidak ada Kitchen Display System. Kasir menyampaikan pesanan ke dapur secara manual.

---

## 3. Fitur Utama

### 3.1 QR Code & Manajemen Meja

| Fitur | Detail |
|---|---|
| Jumlah meja awal | ~20 meja |
| QR Code | **1 QR Code statis per meja** |
| Generate QR | Otomatis saat meja dibuat |
| Tambah meja | Kasir bisa menambah meja baru (QR otomatis di-generate) |
| Hapus meja | Kasir bisa menghapus meja |
| Tutup meja | Kasir bisa mereset status meja menjadi kosong setelah pelanggan selesai |
| Tampilan meja | **Daftar tabel biasa** (bukan layout visual/peta) |

### 3.2 Menu Digital

#### Data Item Menu

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| Nama | String | ✅ | Nama item |
| Harga | Integer | ✅ | Harga dasar (sebelum pajak & variasi) |
| Foto | Image | ✅ | Upload wajib, disimpan di local storage |
| Kategori | Relasi | ✅ | Kategori utama |
| Sub-kategori | Relasi | ❌ | Opsional |
| Status Ketersediaan | Boolean | ✅ | Tersedia / Habis (toggle oleh kasir) |
| Best Seller | Boolean | ✅ | Toggle oleh kasir |
| Diskon | Integer/Percentage | ❌ | Per item, bisa on/off oleh kasir |

> **Catatan:** Field **Deskripsi** tidak diperlukan.

#### Variasi / Opsi Menu

- Variasi bersifat **opsional** (kasir bisa menambahkan atau tidak per item)
- Satu item bisa memiliki **lebih dari satu jenis variasi**
  - Contoh: Kopi Latte → Ukuran (S/M/L) + Level Gula (Normal/Less/No Sugar)
- Variasi **mempengaruhi harga** (misal: Large +Rp 5.000)
- Struktur variasi:
  - **Grup Variasi** (misal: "Ukuran", "Level Gula")
    - **Opsi Variasi** (misal: "Small +Rp 0", "Medium +Rp 3.000", "Large +Rp 5.000")

#### Kategori & Sub-kategori

- Menu memiliki **kategori utama** (misal: Makanan, Minuman, Dessert)
- Setiap kategori bisa memiliki **sub-kategori** (misal: Minuman → Kopi, Teh, Jus)
- Struktur hierarki: Kategori → Sub-kategori → Item Menu

### 3.3 Sistem Pemesanan

| Fitur | Detail |
|---|---|
| Multi-order per meja | ✅ Pelanggan bisa pesan berkali-kali dari meja yang sama |
| Syarat multi-order | Harus **bayar pesanan sebelumnya** dulu baru bisa pesan lagi |
| Catatan per item | ✅ Bisa (misal: "tidak pakai bawang") |
| Minimum order | Tidak ada |
| Batal pesanan (pelanggan) | ❌ Tidak bisa |
| Hapus pesanan (kasir) | ✅ Bisa |
| Pelanggan lihat status | ❌ Tidak bisa |

#### Status Pesanan

Hanya **2 status**:

```
Diproses → Selesai
```

- **Diproses**: Pesanan baru masuk / sedang disiapkan
- **Selesai**: Pesanan sudah disajikan ke pelanggan

> Perubahan status **hanya dilakukan oleh kasir**.

### 3.4 Pembayaran

| Aspek | Detail |
|---|---|
| Waktu bayar | **Per pesanan** (bayar langsung setiap kali pesan) |
| Metode | **Cash** atau **QRIS** |
| Split bill | ❌ Tidak ada |
| Struk | ❌ Tidak ada |

#### Alur Pembayaran Cash

1. Pelanggan memilih item di menu
2. Halaman konfirmasi pesanan muncul (ringkasan pesanan)
3. Pelanggan memilih metode bayar: **Cash**
4. Pesanan terkirim ke kasir dengan status pembayaran **"Belum Bayar"**
5. Pelanggan pergi ke kasir secara fisik untuk bayar
6. Kasir input jumlah uang yang diterima
7. Sistem menghitung dan menampilkan **kembalian**
8. Kasir konfirmasi pembayaran → status menjadi **"Sudah Bayar"**

#### Alur Pembayaran QRIS

1. Pelanggan memilih item di menu
2. Halaman konfirmasi pesanan muncul (ringkasan pesanan)
3. Pelanggan memilih metode bayar: **QRIS**
4. Sistem menampilkan **gambar QR QRIS statis** milik cafe
5. Pelanggan membayar melalui aplikasi bank/e-wallet
6. Pelanggan menekan tombol **"Saya Sudah Bayar"** di HP
7. Kasir menerima notifikasi di dashboard
8. Kasir memverifikasi pembayaran dan klik **"Konfirmasi Bayar"** di dashboard
9. Status pembayaran menjadi **"Sudah Bayar"**

> **QRIS tidak terintegrasi dengan payment gateway.** Konfirmasi pembayaran dilakukan **manual** oleh kasir.

### 3.5 Pajak & Diskon

| Aspek | Detail |
|---|---|
| Pajak | **11%** dihitung terpisah dari harga item |
| Diskon | Per item, dikonfigurasi oleh kasir, bisa di-toggle on/off |
| Perhitungan | Subtotal → Diskon → Pajak 11% → Total |

### 3.6 Dashboard Kasir

#### Halaman Utama Dashboard
- Daftar **pesanan aktif** (status: Diproses)
- Pesanan dicampur di satu daftar, namun dibedakan dengan **label/badge khusus** (Dine-in / Takeaway)
- Ada area/tombol **"Pesanan Takeaway Baru"** untuk membuat order takeaway
- Notifikasi pesanan baru: **suara + pop-up**
- Update otomatis setiap **10 detik** (polling, bukan WebSocket)

#### Manajemen Pesanan
- Create Takeaway Order (kasir memilih menu, jumlah, variasi, dan mode bayar, lalu memprosesnya)
- Lihat detail pesanan (item, jumlah, catatan, variasi, area meja/takeaway, metode bayar)
- Ubah status: Diproses → Selesai
- Hapus pesanan
- Konfirmasi pembayaran (Cash: input nominal & hitung kembalian | QRIS: konfirmasi manual)

#### Manajemen Menu
- CRUD item menu (nama, harga, foto, kategori, sub-kategori)
- CRUD kategori & sub-kategori
- CRUD grup variasi & opsi variasi per item
- Toggle ketersediaan item (Tersedia / Habis)
- Toggle best seller per item
- Toggle diskon per item (set persentase/nominal diskon)

#### Manajemen Meja
- Lihat daftar semua meja
- Tambah meja baru (QR code otomatis di-generate)
- Hapus meja
- Tutup/reset meja (set status meja ke kosong)
- Lihat/download QR Code per meja

#### Laporan

| Laporan | Detail |
|---|---|
| Penjualan harian | Total penjualan per hari |
| Penjualan mingguan | Total penjualan per minggu |
| Penjualan bulanan | Total penjualan per bulan |
| Item terlaris | Ranking item berdasarkan jumlah terjual |
| Pendapatan | Total pendapatan dalam periode tertentu |
| Export | ❌ Tidak ada (tampilkan di dashboard saja) |

### 3.7 Notifikasi & Real-time

| Aspek | Detail |
|---|---|
| Mekanisme | **Polling setiap 10 detik** |
| Notifikasi pesanan baru | Suara + Pop-up di browser kasir |
| WebSocket/Pusher | **Tidak digunakan** |

---

## 4. Non-Functional Requirements

| Aspek | Detail |
|---|---|
| Responsiveness | Halaman pelanggan: **mobile-first**. Dashboard kasir: **desktop-first** |
| Bahasa | **Bahasa Indonesia** saja |
| Storage foto | **Local storage** (server filesystem) |
| Deployment | Belum ditentukan |
| Browser support | Browser modern (Chrome, Safari, Firefox) |
| Brand | **Kopi Tempo** |
| Tema warna | Akan ditentukan oleh user kemudian |

---

## 5. Out of Scope (Tidak Termasuk)

- Multi-outlet / multi-cabang
- Delivery (Pesan antar)
- Reservasi meja
- Kitchen Display System
- Login / registrasi pelanggan
- Pembatalan pesanan oleh pelanggan
- Tracking status pesanan oleh pelanggan
- Struk / receipt (cetak / digital)
- Split bill
- Export laporan ke Excel/PDF
- Payment gateway integration (Midtrans, Xendit, dll)
- Multi-user kasir
- Layout visual meja (peta)
