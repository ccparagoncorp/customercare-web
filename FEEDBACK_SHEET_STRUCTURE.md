# Google Sheets Structure - Feedback Data

## Struktur Kolom Baru

| Kolom | Header | Deskripsi | Contoh |
|-------|--------|-----------|---------|
| A | **timestamp** | Waktu feedback dikirim | 2024-01-15T10:30:00.000Z |
| B | **email** | Email pengirim | alghifarirasyidzola@gmail.com |
| C | **name** | Nama pengirim | Alghifari Rasyid Zola |
| D | **title** | Judul feedback (hanya contact form) | Testing |
| E | **rating** | Rating bintang (hanya feedback widget) | 4 |
| F | **feedback** | Isi pesan feedback | Test Message Feedback |
| G | **source** | Sumber feedback | contact-form / feedback-widget |

## Mapping Data per Source

### 📝 Contact Form (Form Lengkap)
- **timestamp**: ✅ Waktu submit
- **email**: ✅ Email user
- **name**: ✅ Nama user
- **title**: ✅ Subject dari form
- **rating**: ❌ Kosong (tidak ada rating)
- **feedback**: ✅ Message dari form
- **source**: `contact-form`

### ⭐ Feedback Widget (Popup)
- **timestamp**: ✅ Waktu submit
- **email**: ✅ "anonymous@feedback.com" (fixed)
- **name**: ✅ "Anonymous User" (fixed)
- **title**: ❌ Kosong (tidak ada title)
- **rating**: ✅ Rating bintang (1-5)
- **feedback**: ✅ Message dari popup
- **source**: `feedback-widget`

## Contoh Data

### Contact Form Example:
```
A: 2024-01-15T10:30:00.000Z
B: alghifarirasyidzola@gmail.com
C: Alghifari Rasyid Zola
D: Testing
E: (kosong)
F: Test Message Feedback
G: contact-form
```

### Feedback Widget Example:
```
A: 2024-01-15T10:35:00.000Z
B: anonymous@feedback.com
C: Anonymous User
D: (kosong)
E: 4
F: Rating: 4/5 stars\n\nMessage: Great service!
G: feedback-widget
```

## Scripts yang Tersedia

### Debug & Test
```bash
# Debug konfigurasi Google Sheets
npm run debug:sheets

# Test feedback integration
npm run test:feedback

# Inisialisasi headers (jika perlu)
curl -X POST http://localhost:3000/api/init-sheets
```

### Environment Variables
```env
GOOGLE_SHEET_ID=1sxKrSIJVWQeRym_UGbno-scyxJwze2xkCHKFEy7qsxo
GOOGLE_SHEET_NAME=Feedback
GOOGLE_SERVICE_ACCOUNT_EMAIL=feedback-sheets-service@cc-website-474303.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Benefits untuk Reporting

### 📊 Analytics
- **Filter by source**: Lihat perbandingan contact form vs feedback widget
- **Rating analysis**: Analisis rating dari feedback widget
- **Timestamp tracking**: Trend feedback over time
- **Title analysis**: Topik feedback dari contact form

### 📈 Insights
- Contact form untuk feedback detail dengan title
- Feedback widget untuk quick rating & feedback
- Dual source memberikan perspektif berbeda
- Structured data untuk easy reporting

## Troubleshooting

### Headers Tidak Sesuai
```bash
npm run debug:sheets  # Cek struktur saat ini
curl -X POST http://localhost:3000/api/init-sheets  # Reset headers
```

### Data Tidak Masuk
1. Cek environment variables
2. Pastikan service account punya akses
3. Verify sheet ID dan nama sheet
4. Check server logs untuk error
