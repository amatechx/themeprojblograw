# Panduan Integrasi Template Rawtracks untuk Blogspot

## Prasyarat
- Akun Blogspot aktif
- Repository GitHub dengan assets yang sudah diekstrak
- Pengetahuan dasar HTML/CSS/JavaScript

## Langkah Instalasi

### 1. Persiapan Repository GitHub
```bash
# Pastikan repository Anda public dan berisi folder github-assets/
# Struktur folder yang benar:
your-repo/
├── github-assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── rawtracks-core.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── audio-player.js
│   │   ├── animations.js
│   │   └── blogspot-navigation.js
│   ├── images/
│   └── vendors/
└── README.md
```

### 2. Upload Template ke Blogspot
1. Buka Blogger Dashboard
2. Pilih blog yang ingin diubah
3. Pergi ke **Theme** → **Edit HTML**
4. Backup template lama dengan mengklik **Download full template**
5. Salin seluruh isi file `Rawtracks-Blogspot-Template.xml`
6. Ganti seluruh kode HTML yang ada
7. **PENTING:** Ganti placeholder berikut dengan URL GitHub Anda:
   - `YOUR_USERNAME` → username GitHub Anda
   - `YOUR_REPO` → nama repository Anda

### 3. Konfigurasi Blogspot
1. Pergi ke **Settings** → **Basic**
2. Upload logo melalui **Theme** → **Customize** → **Header**
3. Konfigurasi widget Blog Posts:
   - Pergi ke **Layout** → **Blog Posts**
   - Atur jumlah posts per page
   - Konfigurasi format tampilan

## Konfigurasi JavaScript

### Audio Player Setup
```javascript
// Pastikan file audio-player.js dimuat dengan benar
// Tambahkan script berikut di bagian </body> jika diperlukan:

<script>
// Initialize audio player dengan konfigurasi khusus
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AudioPlayer !== 'undefined') {
        AudioPlayer.init({
            autoplay: false,
            volume: 0.8,
            // Konfigurasi lainnya sesuai kebutuhan
        });
    }
});
</script>
```

### Navigation Setup
```javascript
// Navigation akan otomatis berfungsi
// Namun pastikan elemen-elemen menu memiliki ID yang benar
```

## Custom CSS untuk Blogspot

Tambahkan CSS kustom melalui **Theme** → **Customize** → **Advanced** → **Add CSS**:

```css
/* Override untuk kompatibilitas Blogspot */
.blogger-content {
    display: none !important;
}

.qodef-page-wrapper {
    margin-top: 0 !important;
}

/* Mobile optimization */
@media only screen and (max-width: 768px) {
    .qodef-header-navigation {
        display: none;
    }

    .qodef-mobile-header-navigation {
        display: block;
    }
}
```

## Troubleshooting

### Masalah Umum:

1. **Assets tidak dimuat**
   - Pastikan repository GitHub bersifat public
   - Periksa URL GitHub CDN sudah benar
   - Gunakan Raw GitHub URLs untuk file

2. **Audio player tidak berfungsi**
   - Pastikan file `audio-player.js` dimuat
   - Periksa format file audio (MP3/WAV)
   - Gunakan HTTPS URLs untuk audio files

3. **Layout tidak responsive**
   - Pastikan `responsive.css` dimuat
   - Periksa viewport meta tag
   - Test pada berbagai device

4. **Navigation tidak berfungsi**
   - Pastikan `blogspot-navigation.js` dimuat
   - Periksa ID elemen-elemen menu

### Debug Mode
Tambahkan kode berikut untuk debugging:

```javascript
// Tambahkan di bagian </body>
<script>
console.log('Template Rawtracks loaded');
console.log('AudioPlayer:', typeof AudioPlayer);
console.log('BlogspotNavigation:', typeof BlogspotNavigation);
console.log('RawtracksAnimations:', typeof RawtracksAnimations);
</script>
```

## Optimisasi SEO

### Meta Tags
Konfigurasi meta tags melalui **Settings** → **Search preferences**:
- Description
- Keywords
- Custom robots.txt

### Struktur Heading
- Gunakan H1 untuk judul utama
- H2 untuk section headings
- H3-H6 untuk sub-headings

### Image Optimization
- Gunakan alt text untuk semua gambar
- Kompres gambar sebelum upload
- Gunakan WebP format jika memungkinkan

## Maintenance

### Update Assets
1. Update file di repository GitHub
2. GitHub akan otomatis serve versi terbaru
3. Clear cache browser jika diperlukan

### Backup Template
- Selalu backup template sebelum melakukan perubahan
- Simpan versi template di local storage

## Support
Jika mengalami masalah, periksa:
1. Console browser untuk error JavaScript
2. Network tab untuk failed requests
3. GitHub repository accessibility
4. Blogspot template validator

**Catatan:** Template ini merupakan konversi dari tema WordPress. Beberapa fitur mungkin memerlukan penyesuaian tambahan untuk kompatibilitas penuh dengan Blogspot.