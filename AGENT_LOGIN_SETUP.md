# 🔐 Agent Login Setup Guide

Sistem login agent sudah dibuat dan menggunakan **Supabase Auth** dengan tabel `Agent` untuk metadata.

## 📋 Yang Sudah Dibuat

### 1. **API Authentication** (`/api/auth/login`)
- Endpoint untuk login agent menggunakan Supabase Auth
- Validasi agent aktif dari database
- Session management dengan Supabase

### 2. **Updated LoginForm**
- Form sekarang menggunakan email (bukan username)
- Terintegrasi dengan Supabase Auth
- Error handling yang proper
- Session management dengan Supabase

### 3. **Supabase Client** (`src/lib/supabase.ts`)
- Supabase client configuration
- Admin client untuk server-side operations

## 🚀 Setup yang Perlu Dilakukan

### 1. **Environment Variables**
Buat file `.env` di root project dengan isi:

```env
# Database
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

### 2. **Generate Prisma Client**
```bash
npx prisma generate
```

### 3. **Sync Database Schema**
```bash
npx prisma db push
```

### 4. **Setup Supabase Auth**

**Rekomendasi: Sync Agent yang Sudah Ada**
```bash
node scripts/sync-existing-agents.js
```

1. Edit file `scripts/sync-existing-agents.js`
2. Update mapping `agentPasswords` dengan email dan password yang benar:
```javascript
const agentPasswords = {
  'agent@paragon.co.id': 'password123', // Ganti dengan password yang benar
  'agent2@paragon.co.id': 'password456', // Tambahkan email lain jika ada
}
```
3. Jalankan script

**Opsi Lain:**
- `scripts/setup-supabase-auth.js` - untuk agent baru
- `scripts/create-agent-from-db.js` - untuk semua agent dengan password yang sama

Ini akan membuat:
- User di Supabase Auth dengan ID yang sama dengan tabel Agent
- Agent record di database terintegrasi dengan Supabase Auth
- **Password:** Sesuai dengan yang sudah Anda daftarkan di Supabase Auth

## 🎯 Cara Login

1. Buka `http://localhost:3000/login`
2. Masukkan email dari tabel Agent yang sudah ada
3. Masukkan password yang sudah Anda daftarkan di Supabase Auth
4. Klik "Sign In"

## 🔧 Struktur Tabel Agent

```sql
model Agent {
  id        String   @id // Same as auth.users.id from Supabase
  name      String
  email     String   @unique
  category  String   @default("socialMedia")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("agents")
}
```

## 🛡️ Security Features

- ✅ Supabase Auth untuk authentication
- ✅ Password hashing managed by Supabase
- ✅ Session management dengan Supabase
- ✅ Email validation
- ✅ Agent active status check
- ✅ Secure session storage
- ✅ Error handling tanpa expose sensitive info

## 📝 Next Steps

1. **Setup environment variables** sesuai dengan database Supabase Anda
2. **Generate Prisma client** untuk koneksi database
3. **Create agent pertama** dengan script yang disediakan
4. **Test login** dengan credentials yang dibuat
5. **Buat agent dashboard** untuk halaman setelah login berhasil

## 🐛 Troubleshooting

### Error: "Email atau password salah"
- Pastikan agent sudah dibuat di database
- Pastikan email dan password benar
- Pastikan agent status `isActive = true`

### Error: Database connection
- Pastikan `DATABASE_URL` benar di file `.env`
- Pastikan database Supabase sudah running
- Jalankan `npx prisma db push` untuk sync schema

### Error: Supabase Auth
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah di-set
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah di-set untuk server-side operations
- Pastikan user sudah dibuat di Supabase Auth dashboard

---

**Sistem login agent siap digunakan! 🎉**
