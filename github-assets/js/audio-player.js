/**
 * Blogspot Audio Player Module
 * HTML5 Audio API implementation for Rawtracks template
 * Compatible with Blogger/Blogspot platform
 */

(function(window) {
    'use strict';

    class BlogspotAudioPlayer {
        constructor(options = {}) {
            this.options = {
                container: null,
                playlist: [],
                autoplay: false,
                volume: 0.7,
                loop: false,
                preload: 'metadata',
                ...options
            };

            this.audio = null;
            this.currentTrack = 0;
            this.isPlaying = false;
            this.isLoading = false;
            this.playlist = [...this.options.playlist];
            this.volume = this.options.volume;
            this.loop = this.options.loop;

            this.init();
        }

        init() {
            if (!this.options.container) {
                console.error('BlogspotAudioPlayer: Container element is required');
                return;
            }

            this.createAudioElement();
            this.bindEvents();
            this.setupControls();
        }

        createAudioElement() {
            this.audio = document.createElement('audio');
            this.audio.preload = this.options.preload;
            this.audio.volume = this.volume;

            // Insert audio element into container
            this.options.container.appendChild(this.audio);
        }

        loadPlaylist(playlist) {
            this.playlist = [...playlist];
            this.currentTrack = 0;

            if (this.playlist.length > 0) {
                this.loadTrack(0);
            }
        }

        loadTrack(index) {
            if (index < 0 || index >= this.playlist.length) {
                return false;
            }

            this.currentTrack = index;
            const track = this.playlist[index];

            if (!track || !track.mp3) {
                console.error('Invalid track data:', track);
                return false;
            }

            this.isLoading = true;
            this.audio.src = track.mp3;
            this.audio.load();

            // Trigger loading event
            this.trigger('trackLoading', { track: track, index: index });

            return true;
        }

        play(index = null) {
            if (typeof index === 'number' && index !== this.currentTrack) {
                if (!this.loadTrack(index)) return;
            }

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.trigger('play', { track: this.getCurrentTrack(), index: this.currentTrack });
                }).catch(error => {
                    console.error('Playback failed:', error);
                    this.trigger('error', { error: error, track: this.getCurrentTrack() });
                });
            }
        }

        pause() {
            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                this.trigger('pause', { track: this.getCurrentTrack(), index: this.currentTrack });
            }
        }

        stop() {
            this.pause();
            this.audio.currentTime = 0;
            this.trigger('stop', { track: this.getCurrentTrack(), index: this.currentTrack });
        }

        next() {
            const nextIndex = this.loop ? (this.currentTrack + 1) % this.playlist.length : this.currentTrack + 1;
            if (nextIndex < this.playlist.length) {
                this.play(nextIndex);
            } else {
                this.stop();
                this.trigger('playlistEnd');
            }
        }

        previous() {
            const prevIndex = this.currentTrack - 1;
            if (prevIndex >= 0) {
                this.play(prevIndex);
            }
        }

        seek(time) {
            if (this.audio.duration) {
                this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
            }
        }

        setVolume(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
            this.audio.volume = this.volume;
            this.trigger('volumeChange', { volume: this.volume });
        }

        toggleMute() {
            this.audio.muted = !this.audio.muted;
            this.trigger('muteChange', { muted: this.audio.muted });
        }

        getCurrentTrack() {
            return this.playlist[this.currentTrack] || null;
        }

        getCurrentTime() {
            return this.audio.currentTime || 0;
        }

        getDuration() {
            return this.audio.duration || 0;
        }

        getProgress() {
            const duration = this.getDuration();
            return duration > 0 ? (this.getCurrentTime() / duration) * 100 : 0;
        }

        bindEvents() {
            // Audio element events
            this.audio.addEventListener('loadstart', () => {
                this.isLoading = true;
                this.trigger('loadStart');
            });

            this.audio.addEventListener('canplay', () => {
                this.isLoading = false;
                this.trigger('canPlay');
            });

            this.audio.addEventListener('loadedmetadata', () => {
                this.trigger('loadedMetadata', {
                    duration: this.getDuration(),
                    track: this.getCurrentTrack()
                });
            });

            this.audio.addEventListener('timeupdate', () => {
                this.trigger('timeUpdate', {
                    currentTime: this.getCurrentTime(),
                    duration: this.getDuration(),
                    progress: this.getProgress()
                });
            });

            this.audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.trigger('ended', { track: this.getCurrentTrack(), index: this.currentTrack });

                if (!this.loop) {
                    this.next();
                }
            });

            this.audio.addEventListener('error', (e) => {
                this.isLoading = false;
                this.trigger('error', {
                    error: e.target.error,
                    track: this.getCurrentTrack()
                });
            });

            // Handle page visibility changes for autoplay
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && this.isPlaying) {
                    this.pause();
                }
            });
        }

        setupControls() {
            // Add keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                switch(e.keyCode) {
                    case 32: // Spacebar
                        e.preventDefault();
                        this.isPlaying ? this.pause() : this.play();
                        break;
                    case 39: // Right arrow
                        e.preventDefault();
                        this.seek(this.getCurrentTime() + 10);
                        break;
                    case 37: // Left arrow
                        e.preventDefault();
                        this.seek(this.getCurrentTime() - 10);
                        break;
                    case 38: // Up arrow
                        e.preventDefault();
                        this.setVolume(Math.min(1, this.volume + 0.1));
                        break;
                    case 40: // Down arrow
                        e.preventDefault();
                        this.setVolume(Math.max(0, this.volume - 0.1));
                        break;
                }
            });
        }

        trigger(eventName, data = {}) {
            const event = new CustomEvent('blogspotAudioPlayer:' + eventName, {
                detail: { player: this, ...data }
            });
            this.options.container.dispatchEvent(event);
        }

        destroy() {
            if (this.audio) {
                this.audio.pause();
                this.audio.src = '';
                this.audio.load();
                this.options.container.removeChild(this.audio);
            }
            this.playlist = [];
            this.currentTrack = 0;
            this.isPlaying = false;
        }
    }

    // Playlist functionality for album players
    class BlogspotAudioPlaylist extends BlogspotAudioPlayer {
        constructor(options = {}) {
            super(options);
            this.playlistVisible = true;
        }

        togglePlaylist() {
            this.playlistVisible = !this.playlistVisible;
            this.trigger('playlistToggle', { visible: this.playlistVisible });
        }

        addTrack(track, index = null) {
            if (index === null) {
                this.playlist.push(track);
            } else {
                this.playlist.splice(index, 0, track);
            }
            this.trigger('trackAdded', { track: track, index: index });
        }

        removeTrack(index) {
            if (index >= 0 && index < this.playlist.length) {
                const removedTrack = this.playlist.splice(index, 0, 1)[0];
                this.trigger('trackRemoved', { track: removedTrack, index: index });

                if (index <= this.currentTrack) {
                    this.currentTrack = Math.max(0, this.currentTrack - 1);
                }
            }
        }

        reorderTrack(fromIndex, toIndex) {
            if (fromIndex >= 0 && fromIndex < this.playlist.length &&
                toIndex >= 0 && toIndex < this.playlist.length) {

                const track = this.playlist.splice(fromIndex, 1)[0];
                this.playlist.splice(toIndex, 0, track);

                if (this.currentTrack === fromIndex) {
                    this.currentTrack = toIndex;
                } else if (fromIndex < this.currentTrack && toIndex >= this.currentTrack) {
                    this.currentTrack--;
                } else if (fromIndex > this.currentTrack && toIndex <= this.currentTrack) {
                    this.currentTrack++;
                }

                this.trigger('trackReordered', {
                    fromIndex: fromIndex,
                    toIndex: toIndex,
                    track: track
                });
            }
        }
    }

    // Make classes globally available for Blogspot
    window.BlogspotAudioPlayer = BlogspotAudioPlayer;
    window.BlogspotAudioPlaylist = BlogspotAudioPlaylist;

})(window);