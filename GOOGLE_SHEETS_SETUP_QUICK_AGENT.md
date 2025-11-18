# Setup Google Sheets Baru untuk Improvement Form (Cara Cepat)

## Prasyarat
✅ Anda sudah punya service account Google Sheets yang sudah dikonfigurasi sebelumnya

## Langkah-langkah (5 Menit)

### Step 1: Ambil Service Account Email dari Konfigurasi Lama

1. Buka file `.env.local` Anda
2. Cari `GOOGLE_SERVICE_ACCOUNT_EMAIL` (yang sudah ada)
3. Copy email tersebut, contoh: `feedback-sheets-service@your-project-id.iam.gserviceaccount.com`

**Atau** buka file JSON service account yang sudah di-download sebelumnya:
- Buka file JSON
- Cari field `client_email`
- Copy email tersebut

### Step 2: Buat Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com/)
2. Klik **"Blank"** untuk membuat spreadsheet baru
3. Beri nama spreadsheet, contoh: **"Improvement Feedback"** atau **"Agent Feedback"**
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   → **SPREADSHEET_ID_HERE** adalah ID yang perlu di-copy

### Step 3: Share Spreadsheet dengan Service Account

1. Di spreadsheet yang baru dibuat, klik tombol **"Share"** (kanan atas)
2. Masukkan **email service account** (dari Step 1):
   ```
   feedback-sheets-service@your-project-id.iam.gserviceaccount.com
   ```
3. Set permission: **"Editor"** (bukan Viewer!)
4. **Uncheck** "Notify people" (opsional, karena ini service account)
5. Klik **"Share"**

### Step 4: Ambil Private Key dari Konfigurasi Lama

1. Buka file `.env.local` Anda
2. Cari `GOOGLE_PRIVATE_KEY` (yang sudah ada)
3. Copy seluruh private key tersebut (termasuk `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`)

**Atau** buka file JSON service account:
- Buka file JSON
- Cari field `private_key`
- Copy seluruh private key

### Step 5: Tambahkan ke `.env.local`

Tambahkan environment variables berikut ke file `.env.local` Anda:

```env
# ============================================
# Google Sheets - Default (Contact & Feedback Widget)
# ============================================
GOOGLE_SHEET_ID=spreadsheet-id-lama
GOOGLE_SHEET_NAME=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL=feedback-sheets-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ============================================
# Google Sheets - Agent (Improvement Form) - BARU!
# ============================================
GOOGLE_SHEET_ID_AGENT=SPREADSHEET_ID_DARI_STEP_2
GOOGLE_SHEET_NAME_AGENT=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL_AGENT=feedback-sheets-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY_AGENT="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Yang perlu diisi:**
- `GOOGLE_SHEET_ID_AGENT` → Spreadsheet ID dari Step 2
- `GOOGLE_SHEET_NAME_AGENT` → Nama sheet (default: "Feedback")
- `GOOGLE_SERVICE_ACCOUNT_EMAIL_AGENT` → Email yang sama dari konfigurasi lama
- `GOOGLE_PRIVATE_KEY_AGENT` → Private key yang sama dari konfigurasi lama

### Step 6: Restart Development Server

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

### Step 7: Test

1. Buka halaman `/improvement`
2. Submit form improvement
3. Cek spreadsheet baru yang Anda buat - data harus muncul!

---

## Checklist

- [ ] Service account email sudah di-copy (dari konfigurasi lama)
- [ ] Spreadsheet baru sudah dibuat
- [ ] Spreadsheet ID sudah di-copy
- [ ] Spreadsheet sudah di-share dengan service account email (permission: Editor)
- [ ] Private key sudah di-copy (dari konfigurasi lama)
- [ ] Environment variables sudah ditambahkan ke `.env.local` dengan suffix `_AGENT`
- [ ] Development server sudah di-restart
- [ ] Form improvement sudah ditest

---

## Contoh Lengkap `.env.local`

```env
# ============================================
# Google Sheets - Default (Contact & Feedback Widget)
# ============================================
GOOGLE_SHEET_ID=1sxKrSIJVWQeRym_UGbno-scyxJwze2xkCHKFEy7qsxo
GOOGLE_SHEET_NAME=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL=feedback-sheets-service@cc-website-474303.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ============================================
# Google Sheets - Agent (Improvement Form) - BARU!
# ============================================
GOOGLE_SHEET_ID_AGENT=xyz789abc123NEW_SPREADSHEET_ID
GOOGLE_SHEET_NAME_AGENT=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL_AGENT=feedback-sheets-service@cc-website-474303.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY_AGENT="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ============================================
# SMTP Configuration
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
CONTACT_TO=recipient@example.com
CONTACT_FROM=your-email@gmail.com
```

---

## Troubleshooting

### Data tidak masuk ke spreadsheet baru?
1. Pastikan spreadsheet sudah di-share dengan service account email (Editor)
2. Pastikan `GOOGLE_SHEET_ID_AGENT` benar (dari URL spreadsheet)
3. Pastikan `GOOGLE_SHEET_NAME_AGENT` sesuai dengan nama sheet (default: "Feedback")
4. Restart development server setelah update `.env.local`
5. Cek console log untuk error messages

### Error: "The caller does not have permission"
- Pastikan service account email sudah di-share dengan spreadsheet
- Pastikan permission set ke **"Editor"** (bukan Viewer)

### Error: "Spreadsheet not found"
- Double-check `GOOGLE_SHEET_ID_AGENT` dari URL spreadsheet
- Pastikan spreadsheet ID benar (bukan URL lengkapnya)

---

## Summary

Karena Anda sudah punya service account yang dikonfigurasi:
- ✅ **Tidak perlu** membuat service account baru
- ✅ **Tidak perlu** generate key baru
- ✅ **Hanya perlu**: 
  1. Buat spreadsheet baru
  2. Share dengan service account email yang sama
  3. Tambahkan env vars dengan suffix `_AGENT` menggunakan konfigurasi yang sama

**Selamat! Setup selesai dalam 5 menit! 🎉**

