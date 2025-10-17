# 🔐 Supabase Auth Setup Guide

Error "supabaseKey is required" terjadi karena environment variables Supabase belum dikonfigurasi.

## 🚀 **Setup Environment Variables**

Buat file `.env` di root project dengan isi:

```env
# Database
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

## 📋 **Cara Mendapatkan Supabase Keys:**

### 1. **Buka Supabase Dashboard**
- Login ke [supabase.com](https://supabase.com)
- Pilih project Anda

### 2. **Get Project URL**
- Go to **Settings** → **API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`

### 3. **Get API Keys**
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

## 🔧 **Setup Supabase Auth**

### 1. **Enable Email Auth**
- Go to **Authentication** → **Settings**
- Enable **Email** provider
- Disable **Confirm email** untuk development

### 2. **Create Test User**
- Go to **Authentication** → **Users**
- Click **Add user**
- Email: `agent@paragon.co.id`
- Password: `your-password`

### 3. **Setup Database Schema**
```bash
npx prisma db push
```

## 🎯 **Testing**

1. **Restart Development Server:**
```bash
npm run dev
```

2. **Test Login:**
- Go to `/login`
- Use credentials yang sudah dibuat di Supabase

## 🐛 **Troubleshooting**

### Error: "supabaseKey is required"
- Pastikan semua environment variables sudah di-set
- Restart development server setelah update .env
- Check console untuk error messages

### Error: "Authentication service not configured"
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada
- Check file `.env` sudah di root project

### Error: "Invalid credentials"
- Pastikan user sudah dibuat di Supabase Auth
- Check email dan password benar

## 📝 **Next Steps**

1. Setup environment variables
2. Configure Supabase Auth
3. Create test users
4. Test login functionality
5. Setup agent database integration

---

**Setup selesai! Login sekarang menggunakan Supabase Auth yang secure dan scalable.** 🎉
