/*!
 * Rawtracks Blogspot Theme - Modern HTML5 Audio Player
 * Replacement untuk kompleks jPlayer dengan HTML5 native audio
 * GitHub: https://github.com/amatechx/themeprojblograw
 */

class RawtracksAudioPlayer {
    constructor(options = {}) {
        this.options = {
            container: '#audioPlayer',
            progressBar: '#progressBar',
            progressFill: '#progressFill',
            playBtn: '#playBtn',
            playIcon: '#playIcon',
            currentTime: '#currentTime',
            duration: '#duration',
            volumeBtn: '#volumeBtn',
            volumeIcon: '#volumeIcon',
            volumeSlider: '#volumeSlider',
            volumeFill: '#volumeFill',
            playlistContainer: '.qodef-playlist',
            autoPlay: false,
            loop: false,
            ...options
        };

        this.audio = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.currentVolume = 0.7;
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.bindElements();
        this.setupEventListeners();
        this.loadPlaylist();
        
        // Initialize player state
        this.updatePlayButton();
        this.updateVolumeControls();
        
        console.log('Rawtracks Audio Player initialized');
    }

    bindElements() {
        this.elements = {
            audio: document.querySelector(this.options.container),
            progressBar: document.querySelector(this.options.progressBar),
            progressFill: document.querySelector(this.options.progressFill),
            playBtn: document.querySelector(this.options.playBtn),
            playIcon: document.querySelector(this.options.playIcon),
            currentTime: document.querySelector(this.options.currentTime),
            duration: document.querySelector(this.options.duration),
            volumeBtn: document.querySelector(this.options.volumeBtn),
            volumeIcon: document.querySelector(this.options.volumeIcon),
            volumeSlider: document.querySelector(this.options.volumeSlider),
            volumeFill: document.querySelector(this.options.volumeFill),
            playlistContainer: document.querySelector(this.options.playlistContainer)
        };

        // Validate required elements
        const required = ['audio', 'progressBar', 'playBtn', 'currentTime', 'duration'];
        required.forEach(el => {
            if (!this.elements[el]) {
                console.warn(`AudioPlayer: Missing required element: ${el}`);
            }
        });
    }

    setupEventListeners() {
        // Audio events
        if (this.elements.audio) {
            this.elements.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
            this.elements.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
            this.elements.audio.addEventListener('ended', () => this.onTrackEnded());
            this.elements.audio.addEventListener('play', () => this.onPlay());
            this.elements.audio.addEventListener('pause', () => this.onPause());
            this.elements.audio.addEventListener('error', (e) => this.onError(e));
            this.elements.audio.addEventListener('loadstart', () => this.onLoadStart());
            this.elements.audio.addEventListener('canplay', () => this.onCanPlay());
        }

        // Control events
        if (this.elements.playBtn) {
            this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        }

        if (this.elements.progressBar) {
            this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
        }

        if (this.elements.volumeBtn) {
            this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());
        }

        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Window events
        window.addEventListener('resize', () => this.handleResize());
    }

    loadPlaylist() {
        // Auto-load playlist from data attributes
        if (this.elements.playlistContainer) {
            const tracks = this.elements.playlistContainer.querySelectorAll('[data-audio-src]');
            this.playlist = Array.from(tracks).map((track, index) => ({
                src: track.getAttribute('data-audio-src'),
                title: track.getAttribute('data-audio-title') || `Track ${index + 1}`,
                artist: track.getAttribute('data-audio-artist') || 'Unknown Artist',
                cover: track.getAttribute('data-audio-cover') || '',
                duration: track.getAttribute('data-audio-duration') || ''
            }));
        }

        // Load first track if available
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return false;

        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        if (this.elements.audio && track.src) {
            this.isLoading = true;
            this.showLoader();
            
            this.elements.audio.src = track.src;
            this.elements.audio.load();
            
            this.updateTrackInfo(track);
            return true;
        }
        
        return false;
    }

    updateTrackInfo(track) {
        // Update track title and artist if elements exist
        const titleEl = document.querySelector('.qodef-track-title');
        const artistEl = document.querySelector('.qodef-track-artist');
        const coverEl = document.querySelector('.qodef-album-cover');

        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist;
        if (coverEl && track.cover) coverEl.src = track.cover;

        // Update document title
        document.title = `${track.title} - ${track.artist} | Rawtracks`;
    }

    togglePlay() {
        if (!this.elements.audio) return;

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.elements.audio) return false;

        const playPromise = this.elements.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.hideLoader();
            }).catch(error => {
                console.error('Audio play failed:', error);
                this.onError(error);
            });
        }

        return true;
    }

    pause() {
        if (!this.elements.audio) return;

        this.elements.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    seek(event) {
        if (!this.elements.audio || !this.elements.progressBar) return;

        const rect = this.elements.progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const seekTime = percent * this.elements.audio.duration;

        if (!isNaN(seekTime)) {
            this.elements.audio.currentTime = seekTime;
        }
    }

    setVolume(event) {
        if (!this.elements.volumeSlider) return;

        const rect = this.elements.volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        
        this.currentVolume = percent;
        if (this.elements.audio) {
            this.elements.audio.volume = this.currentVolume;
        }

        this.updateVolumeControls();
        
        // Unmute if volume was 0
        if (percent > 0 && this.isMuted) {
            this.toggleMute();
        }
    }

    toggleMute() {
        if (!this.elements.audio) return;

        this.isMuted = !this.isMuted;
        this.elements.audio.muted = this.isMuted;
        this.updateVolumeControls();
    }

    nextTrack() {
        if (this.playlist.length > 0) {
            const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
            return this.loadTrack(nextIndex);
        }
        return false;
    }

    previousTrack() {
        if (this.playlist.length > 0) {
            const prevIndex = this.currentTrackIndex === 0 
                ? this.playlist.length - 1 
                : this.currentTrackIndex - 1;
            return this.loadTrack(prevIndex);
        }
        return false;
    }

    updatePlayButton() {
        if (!this.elements.playBtn || !this.elements.playIcon) return;

        if (this.isPlaying) {
            this.elements.playBtn.classList.add('playing');
            this.elements.playIcon.innerHTML = '&#10074;&#10074;'; // Pause icon
        } else {
            this.elements.playBtn.classList.remove('playing');
            this.elements.playIcon.innerHTML = '&#9654;'; // Play icon
        }
    }

    updateVolumeControls() {
        if (this.elements.volumeIcon) {
            this.elements.volumeIcon.textContent = this.isMuted || this.currentVolume === 0 
                ? '🔇' // Muted
                : this.currentVolume < 0.5 
                    ? '🔉' // Low volume
                    : '🔊'; // High volume
        }

        if (this.elements.volumeFill) {
            this.elements.volumeFill.style.width = `${this.currentVolume * 100}%`;
        }
    }

    updateProgress() {
        if (!this.elements.audio || !this.elements.progressFill || !this.elements.currentTime) return;

        const current = this.elements.audio.currentTime;
        const duration = this.elements.audio.duration;
        
        if (duration > 0) {
            const percent = (current / duration) * 100;
            this.elements.progressFill.style.width = `${percent}%`;
            
            // Update time display
            this.elements.currentTime.textContent = this.formatTime(current);
            if (this.elements.duration) {
                this.elements.duration.textContent = this.formatTime(duration);
            }
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showLoader() {
        // Add loading state to play button
        if (this.elements.playBtn) {
            this.elements.playBtn.classList.add('loading');
        }
    }

    hideLoader() {
        // Remove loading state from play button
        if (this.elements.playBtn) {
            this.elements.playBtn.classList.remove('loading');
        }
    }

    // Event handlers
    onLoadedMetadata() {
        this.isLoading = false;
        this.hideLoader();
        this.updateProgress();
    }

    onTimeUpdate() {
        this.updateProgress();
    }

    onPlay() {
        this.isPlaying = true;
        this.updatePlayButton();
    }

    onPause() {
        this.isPlaying = false;
        this.updatePlayButton();
    }

    onTrackEnded() {
        if (this.options.loop && this.playlist.length > 0) {
            this.play();
        } else if (this.playlist.length > 0) {
            this.nextTrack();
        }
    }

    onError(event) {
        console.error('Audio error:', event);
        this.isLoading = false;
        this.hideLoader();
        
        // Show error message
        this.showErrorMessage('Failed to load audio track');
    }

    onLoadStart() {
        this.showLoader();
    }

    onCanPlay() {
        this.hideLoader();
    }

    showErrorMessage(message) {
        // Simple error notification
        const notification = document.createElement('div');
        notification.className = 'qodef-player-notification qodef-error';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    handleKeyboard(event) {
        // Only handle if not typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.elements.audio.currentTime = Math.max(0, this.elements.audio.currentTime - 10);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.elements.audio.currentTime = Math.min(this.elements.audio.duration, this.elements.audio.currentTime + 10);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.setVolumePercentage(Math.min(1, this.currentVolume + 0.1));
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.setVolumePercentage(Math.max(0, this.currentVolume - 0.1));
                break;
            case 'KeyM':
                event.preventDefault();
                this.toggleMute();
                break;
        }
    }

    setVolumePercentage(percentage) {
        this.currentVolume = percentage;
        if (this.elements.audio) {
            this.elements.audio.volume = this.currentVolume;
        }
        this.updateVolumeControls();
    }

    handleResize() {
        // Responsive adjustments if needed
        this.updateProgress();
    }

    // Public API methods
    playTrack(index) {
        return this.loadTrack(index);
    }

    addTrack(track) {
        this.playlist.push(track);
    }

    removeTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.playlist.splice(index, 1);
        }
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex] || null;
    }

    getPlaylist() {
        return [...this.playlist];
    }

    setPlaylist(tracks) {
        this.playlist = [...tracks];
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    }

    destroy() {
        // Clean up event listeners
        if (this.elements.audio) {
            this.elements.audio.pause();
        }
        
        // Remove listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize player with default options
    window.rawtracksPlayer = new RawtracksAudioPlayer();
    
    // Global helper functions
    window.playTrack = (index) => window.rawtracksPlayer.playTrack(index);
    window.nextTrack = () => window.rawtracksPlayer.nextTrack();
    window.previousTrack = () => window.rawtracksPlayer.previousTrack();
    window.togglePlay = () => window.rawtracksPlayer.togglePlay();
    
    console.log('Rawtracks Audio Player ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RawtracksAudioPlayer;
}