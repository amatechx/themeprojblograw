# Panduan Setup Template Rawtracks di Blogspot

## Daftar Isi
1. [Persiapan](#persiapan)
2. [Konfigurasi Repository GitHub](#konfigurasi-repository-github)
3. [Upload Template ke Blogspot](#upload-template-ke-blogspot)
4. [Konfigurasi Blog](#konfigurasi-blog)
5. [Testing dan Validasi](#testing-dan-validasi)
6. [Tips Optimisasi](#tips-optimisasi)

## Persiapan

### Yang Anda Butuhkan:
- ✅ Akun Blogspot aktif
- ✅ Repository GitHub public
- ✅ Browser modern (Chrome/Firefox/Edge)
- ✅ Koneksi internet stabil

### File yang Diperlukan:
```
github-assets/
├── Rawtracks-Blogspot-Template.xml (Template utama)
├── css/
│   ├── main.css
│   ├── rawtracks-core.css
│   └── responsive.css
├── js/
│   ├── audio-player.js
│   ├── animations.js
│   └── blogspot-navigation.js
├── images/
│   ├── new-logo-header-touch-devices.png
│   └── new-logo-side-area-1.png
└── vendors/
    ├── css/
    └── js/
```

## Konfigurasi Repository GitHub

### Langkah 1: Buat Repository Baru
1. Buka [GitHub.com](https://github.com) dan login
2. Klik **New repository**
3. Beri nama repository (contoh: `rawtracks-blogspot`)
4. Pastikan **Public** dipilih
5. ✅ **Add a README file**
6. Klik **Create repository**

### Langkah 2: Upload Assets
1. Clone repository ke lokal:
```bash
git clone https://github.com/amatechx/themeprojblograw.git
cd themeprojblograw
```

2. Copy folder `github-assets/` ke dalam repository:
```bash
cp -r /path/to/github-assets ./github-assets
```

3. Commit dan push ke GitHub:
```bash
git add .
git commit -m "Add Rawtracks Blogspot assets"
git push origin main
```

### Langkah 3: Verifikasi Repository
1. Buka repository di GitHub
2. Pastikan semua file ter-upload dengan benar
3. Copy URL repository untuk digunakan nanti

## Upload Template ke Blogspot

### Langkah 1: Akses Blogger Dashboard
1. Buka [blogger.com](https://blogger.com)
2. Login dengan akun Google Anda
3. Pilih blog yang ingin dikonfigurasi

### Langkah 2: Backup Template Lama
1. Pergi ke **Theme** di sidebar kiri
2. Klik **Edit HTML**
3. Klik **Download full template** untuk backup
4. Simpan file backup di tempat yang aman

### Langkah 3: Upload Template Baru
1. Buka file `Rawtracks-Blogspot-Template.xml`
2. Ganti placeholder berikut:
   - `YOUR_USERNAME` → amatechx
   - `YOUR_REPO` → themeprojblograw

**Contoh:**
```xml
<!-- Sebelum -->
@import url('https://raw.githubusercontent.com/amatechx/themeprojblograw/master/github-assets/css/main.css');

<!-- Sesudah -->
@import url('https://raw.githubusercontent.com/amatechx/themeprojblograw/master/github-assets/css/main.css');
```

3. Copy seluruh isi file XML
4. Paste ke editor HTML Blogspot (ganti semua yang ada)
5. Klik **Save** → **Save theme**

## Konfigurasi Blog

### Langkah 1: Pengaturan Dasar
1. Pergi ke **Settings** → **Basic**
2. Konfigurasi:
   - **Title**: Rawtracks Music Blog
   - **Description**: Your music blog description
   - **Width**: 1400px (untuk match dengan tema)

### Langkah 2: Konfigurasi Header
1. Pergi ke **Theme** → **Customize**
2. Klik **Header**
3. Upload logo jika diperlukan
4. Atur posisi dan ukuran header

### Langkah 3: Konfigurasi Layout
1. Pergi ke **Layout**
2. Klik **Blog Posts** widget
3. Konfigurasi:
   - **Posts per page**: 10
   - **Show post thumbnails**: ✅
   - **Show post snippets**: ✅
   - **Show comment count**: ❌
   - **Show author**: ❌
   - **Show date**: ✅

### Langkah 4: Konfigurasi Footer
1. Di **Layout**, edit footer widgets
2. Tambahkan link sosial media
3. Update copyright text

## Testing dan Validasi

### Checklist Testing:
- [ ] Template ter-upload tanpa error
- [ ] CSS dimuat dengan benar (cek styling)
- [ ] JavaScript berfungsi (audio player, navigation)
- [ ] Responsive design (test di mobile)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Loading speed (gunakan PageSpeed Insights)

### Debug Mode:
Tambahkan kode berikut untuk debugging:

```javascript
// Tambahkan di Theme → Edit HTML → sebelum </body>
<script>
console.log('=== RAWTRACKS TEMPLATE DEBUG ===');
console.log('🎵 AudioPlayer loaded:', typeof AudioPlayer);
console.log('🧭 Navigation loaded:', typeof BlogspotNavigation);
console.log('🎨 Animations loaded:', typeof RawtracksAnimations);
console.log('📱 Mobile:', window.innerWidth < 768);
console.log('🌐 Online:', navigator.onLine);
</script>
```

### Validasi Template:
1. Buka blog di browser baru
2. Klik kanan → **Inspect Element**
3. Cek **Console** untuk error JavaScript
4. Cek **Network** tab untuk failed requests
5. Test semua interaksi (menu, audio player, dll)

## Tips Optimisasi

### Performance:
1. **Minify CSS/JS**: Gunakan versi minified dari assets
2. **Lazy Loading**: Aktifkan lazy loading untuk gambar
3. **CDN**: Pastikan GitHub CDN merespons dengan baik
4. **Caching**: Atur cache headers di GitHub

### SEO:
1. **Meta Description**: Tambahkan deskripsi unik per post
2. **Alt Text**: Berikan alt text untuk semua gambar
3. **URL Structure**: Gunakan URL yang SEO-friendly
4. **Sitemap**: Aktifkan sitemap XML

### Mobile Optimization:
1. **Viewport**: Pastikan viewport meta tag sudah benar
2. **Touch Targets**: Pastikan button cukup besar untuk touch
3. **Font Size**: Minimum 16px untuk readability
4. **Image Optimization**: Compress gambar untuk mobile

## Troubleshooting

### Masalah Umum dan Solusi:

#### Assets Tidak Dimuat
```
Error: Failed to load resource
```
**Solusi:**
- Pastikan repository bersifat public
- Periksa URL GitHub sudah benar
- Gunakan `raw.githubusercontent.com` untuk file
- Clear browser cache

#### Audio Player Tidak Berfungsi
```
AudioPlayer is not defined
```
**Solusi:**
- Pastikan `audio-player.js` dimuat
- Cek console untuk error JavaScript
- Pastikan format audio didukung browser
- Test dengan file audio yang lebih kecil

#### Layout Rusak
```
CSS not applied properly
```
**Solusi:**
- Periksa import CSS di template
- Pastikan tidak ada konflik dengan CSS Blogspot default
- Gunakan `!important` jika diperlukan
- Test di incognito mode

#### Mobile View Bermasalah
```
Responsive design broken
```
**Solusi:**
- Periksa viewport meta tag
- Test responsive breakpoints
- Pastikan `responsive.css` dimuat
- Gunakan browser developer tools

## Support dan Update

### Update Template:
1. Update file di repository GitHub
2. Template akan otomatis menggunakan versi terbaru
3. Backup sebelum update besar

### Bantuan:
- Dokumentasi GitHub: https://docs.github.com
- Dokumentasi Blogspot: https://support.google.com/blogger
- Forum komunitas untuk troubleshooting

---

**Catatan Penting:**
- Selalu backup template sebelum melakukan perubahan
- Test di berbagai browser dan device
- Monitor loading speed secara berkala
- Update assets secara berkala untuk security

**Versi Template:** 1.0.0
**Terakhir Update:** November 2024
**Kompatibilitas:** Blogger 2024+