# Deployment Guide - Database Configuration

## Environment Variables

Pastikan environment variables berikut sudah di-set di deployment platform (Vercel, dll):

### Required Variables:
1. **DATABASE_URL** - Connection string untuk database (dari Supabase atau database provider lainnya)
2. **DIRECT_URL** (Optional) - Direct connection URL untuk Supabase (untuk menghindari prepared statement issues)

### Supabase Configuration:
Jika menggunakan Supabase, set:
- `DATABASE_URL` = Connection Pooling URL (format: `postgresql://...?pgbouncer=true`)
- `DIRECT_URL` = Direct Connection URL (format: `postgresql://...` tanpa pgbouncer)

**Cara mendapatkan connection string dari Supabase:**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Settings → Database
4. Copy "Connection string" (gunakan "Transaction" mode untuk DIRECT_URL, "Session" mode untuk DATABASE_URL)

## Build Steps

Build command sudah otomatis di `package.json` dengan `postinstall` script:

```bash
npm install  # Akan otomatis run: prisma generate
npm run build
```

Pastikan di deployment platform (Vercel):
- Build Command: `npm run build`
- Install Command: `npm install` (default)

## Troubleshooting "Gagal Fetch Data"

### 1. Check Environment Variables
Pastikan di deployment platform:
- `DATABASE_URL` sudah di-set dan benar
- `DIRECT_URL` (opsional) sudah di-set jika menggunakan Supabase
- Tidak ada typo atau whitespace di environment variables

**Cara check di Vercel:**
- Settings → Environment Variables
- Pastikan semua variables sudah ada dan value-nya benar

### 2. Check Prisma Client Generation
Pastikan Prisma client sudah ter-generate:
- Check build logs, harus ada: `Running "prisma generate"`
- Jika tidak ada, pastikan `postinstall` script ada di `package.json`

**Manual check:**
```bash
# Di local, test apakah Prisma client ter-generate
npm install
ls node_modules/.prisma/client
```

### 3. Check Database Connection
Test koneksi database:
```bash
# Di local, test dengan environment variables yang sama
DATABASE_URL="your-production-url" npx prisma db pull
```

### 4. Check API Routes Logs
Di deployment platform, check logs untuk:
- Error messages dari API routes
- Status code yang dikembalikan (503 = database issue, 500 = other error)
- Console warnings/errors

### 5. Common Error Messages

**"Can't reach database server"**
- Database URL salah atau tidak accessible
- Firewall/network blocking connection
- Database server down

**"column does not exist"**
- Migration belum dijalankan di production
- Schema tidak sync dengan database

**"PrismaClientInitializationError"**
- DATABASE_URL tidak ter-set
- Format DATABASE_URL salah
- Prisma client belum ter-generate

## Error Handling

Semua API routes sudah memiliki error handling untuk:
- Database connectivity issues (returns 503)
- Missing columns (returns 503)
- Other errors (returns 500)

Frontend akan menampilkan pesan error yang sesuai:
- Status 503: "Database connection unavailable. Please try again later."
- Status 404: "Resource not found"
- Status 500: Error message dari API

## Quick Fix Checklist

Jika masih "gagal fetch data" di deployment:

1. ✅ Check environment variables di deployment platform
2. ✅ Check build logs untuk Prisma generate
3. ✅ Check API route logs untuk error messages
4. ✅ Test database connection dengan DATABASE_URL yang sama
5. ✅ Pastikan migration sudah dijalankan di production database
6. ✅ Check browser console untuk error messages
7. ✅ Check network tab untuk melihat response dari API

## Testing Locally with Production Database

Untuk test dengan production database (hati-hati!):

```bash
# Set environment variable
export DATABASE_URL="your-production-database-url"

# Test connection
npx prisma db pull

# Test API route
npm run dev
# Visit: http://localhost:3000/api/brands
```

