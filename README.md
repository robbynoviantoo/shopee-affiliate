# Shopee Affiliate Finds

Website katalog link Shopee affiliate dengan tema neobrutalism, filter profesional, dan dashboard admin sederhana.

## Fitur

- Halaman publik dengan banner, filter nama/kategori/unggulan, dan toggle tampilan grid/list.
- Dashboard `/admin` dengan password, tambah/edit/hapus produk, status aktif, featured, dan urutan tampil.
- Database PostgreSQL via Prisma, cocok dipakai dengan Neon.
- Link foto disimpan sebagai URL eksternal. Rekomendasi: Cloudinary, ImageKit, Uploadcare, Supabase Storage, atau R2.

## Setup

1. Copy environment:

```bash
cp .env.example .env
```

2. Isi `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
ADMIN_PASSWORD="password-admin-yang-kuat"
SESSION_SECRET="random-secret-minimal-32-karakter"
```

3. Generate Prisma client dan buat tabel:

```bash
npx prisma generate
npx prisma db push
```

4. Opsional isi contoh produk:

```bash
npx prisma db seed
```

5. Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000` untuk katalog dan `http://localhost:3000/admin` untuk dashboard.

## Catatan Deploy

- Di Vercel, tambahkan `DATABASE_URL`, `ADMIN_PASSWORD`, dan `SESSION_SECRET` pada Environment Variables.
- Gunakan URL gambar publik dari layanan penyimpanan gambar agar produk bisa ditampilkan stabil.
- Password admin saat development default ke `admin12345` jika `ADMIN_PASSWORD` belum diisi, tapi wajib ganti di production.
