# Rawtracks Blogspot Theme - Assets Repository

## Struktur Folder Assets

```
assets/
├── css/                    # Critical CSS files untuk Blogspot theme
│   ├── core.css           # Essential styling (dari rawtracks-core)
│   ├── responsive.css     # Mobile responsive styles
│   └── components.css     # UI components styles
├── js/                    # Essential JavaScript files
│   ├── audio-player.js    # Modern HTML5 audio player
│   ├── animations.js      # Scroll animations & transitions
│   └── utils.js           # Utility functions
├── images/                # Theme images
│   ├── default-album-cover.jpg
│   ├── logo.png
│   └── icons/             # Audio player icons
├── fonts/                 # Web fonts (jika diperlukan)
└── audio/                 # Sample audio files untuk demo
```

## File yang Telah Dikonversi

### CSS (Total ~50KB - Optimized)
- **core.css**: Essential styling dari rawtracks-core (simplified)
- **responsive.css**: Mobile-first responsive design
- **components.css**: Audio player, album grid, blog layouts

### JavaScript (Total ~15KB - Modern)
- **audio-player.js**: HTML5 audio player replacement untuk jPlayer
- **animations.js**: Scroll animations untuk Blogspot
- **utils.js**: Helper functions

### Performance Optimizations
- Minified CSS/JS untuk faster loading
- GitHub Raw CDN untuk asset serving
- Lazy loading untuk images
- Progressive enhancement

## GitHub Raw URLs Format
```
https://raw.githubusercontent.com/amatechx/themeprojblograw/main/assets/css/core.css
https://raw.githubusercontent.com/amatechx/themeprojblograw/main/assets/js/audio-player.js
```

## Blogspot Integration
Template XML menggunakan URL ini untuk loading assets secara dinamis, memungkinkan:
- **Easy Updates**: Update assets tanpa modify theme
- **CDN Performance**: GitHub serves files globally
- **Version Control**: Track changes pada assets
- **Development**: Local development dengan same assets

## Next Steps
1. Upload critical assets
2. Test GitHub raw file serving
3. Integrate dengan Blogspot theme
4. Performance testing