import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { KeyboardNavigation, ScreenReader } from '../../utils/accessibility.js';

// Main audio player container
const AudioPlayerContainer = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

// Controls container
const ControlsContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 480px)': {
        gap: '12px'
    },
});

// Play/Pause button
const PlayButton = styled('button')({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 232, 161, 1)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    color: '#FFE8A1',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.2)',
        transform: 'scale(1.05)',
    },
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        '&:hover': {
            transform: 'none',
            backgroundColor: 'rgba(255, 232, 161, 0.1)',
        }
    },
    '@media (max-width: 480px)': {
        width: '40px',
        height: '40px',
        fontSize: '16px'
    },
});

// Progress container
const ProgressContainer = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

// Progress bar container
const ProgressBarContainer = styled('div')({
    position: 'relative',
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    borderRadius: '3px',
    cursor: 'pointer',
    overflow: 'hidden',
});

// Progress bar fill
const ProgressBarFill = styled('div')(({ progress }) => ({
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#FFE8A1',
    borderRadius: '3px',
    transition: 'width 0.1s ease',
}));

// Progress bar buffer
const ProgressBarBuffer = styled('div')(({ buffered }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${buffered}%`,
    backgroundColor: 'rgba(255, 232, 161, 0.4)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
}));

// Time display container
const TimeContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#FFE8A1',
    opacity: 0.8,
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 480px)': {
        fontSize: '11px'
    },
});

// Volume container
const VolumeContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '@media (max-width: 768px)': {
        display: 'none' // Hide volume on mobile to save space
    },
});

// Volume button
const VolumeButton = styled('button')({
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#FFE8A1',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        opacity: 0.8,
    },
});

// Volume slider
const VolumeSlider = styled('input')({
    width: '80px',
    height: '4px',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
    '&::-webkit-slider-thumb': {
        appearance: 'none',
        width: '12px',
        height: '12px',
        backgroundColor: '#FFE8A1',
        borderRadius: '50%',
        cursor: 'pointer',
    },
    '&::-moz-range-thumb': {
        width: '12px',
        height: '12px',
        backgroundColor: '#FFE8A1',
        borderRadius: '50%',
        cursor: 'pointer',
        border: 'none',
    },
});

// Loading state
const LoadingState = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#FFE8A1',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    gap: '8px',
});

const LoadingSpinner = styled('div')({
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,232,161,0.3)',
    borderTop: '2px solid #FFE8A1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

// Error state
const ErrorState = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#FFE8A1',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    gap: '12px',
    textAlign: 'center',
});

const RetryButton = styled('button')({
    padding: '8px 16px',
    borderRadius: '20px',
    border: '2px solid rgba(255, 232, 161, 1)',
    backgroundColor: 'transparent',
    color: '#FFE8A1',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 232, 161, 0.1)',
    },
});

function AudioPlayer({ src, title, onError, onLoadStart, onLoadEnd, ...props }) {
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audioLoading, setAudioLoading] = useState(false);
    const [announceText, setAnnounceText] = useState('');

    // Initialize audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !src) return;

        const handleLoadStart = () => {
            setLoading(true);
            setAudioLoading(true);
            setError(null);
            onLoadStart?.();
        };

        const handleCanPlay = () => {
            setLoading(false);
            setAudioLoading(false);
            onLoadEnd?.();
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime || 0);

            // Update buffered progress
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                const bufferedPercent = (bufferedEnd / audio.duration) * 100;
                setBuffered(bufferedPercent);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const handleError = (e) => {
            setLoading(false);
            setAudioLoading(false);
            setIsPlaying(false);
            const errorMessage = 'Failed to load audio file';
            setError(errorMessage);
            onError?.(errorMessage);
        };

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                const bufferedPercent = (bufferedEnd / audio.duration) * 100;
                setBuffered(bufferedPercent);
            }
        };

        // Add event listeners
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('progress', handleProgress);

        // Set initial volume
        audio.volume = volume;

        return () => {
            // Cleanup event listeners
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('progress', handleProgress);
        };
    }, [src, volume, onError, onLoadStart, onLoadEnd]);

    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Announce to screen readers
    const announceToScreenReader = (message) => {
        setAnnounceText(message);
        ScreenReader.announce(message);
    };

    // Play/pause handler
    const handlePlayPause = async () => {
        const audio = audioRef.current;
        if (!audio || loading) return;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
                announceToScreenReader('Audio paused');
            } else {
                await audio.play();
                setIsPlaying(true);
                announceToScreenReader('Audio playing');
            }
        } catch (err) {
            console.error('Playback error:', err);
            setError('Playback failed');
            setIsPlaying(false);
            announceToScreenReader('Playback failed');
        }
    };

    // Seek handler
    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * duration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
        announceToScreenReader(`Seeked to ${formatTime(newTime)}`);
    };

    // Keyboard navigation for audio player
    const handleKeyDown = (e) => {
        KeyboardNavigation.handleAudioPlayerNavigation(e, {
            onPlayPause: handlePlayPause,
            onSeekBackward: () => {
                const audio = audioRef.current;
                if (audio) {
                    audio.currentTime = Math.max(0, audio.currentTime - 10);
                    announceToScreenReader(`Rewound 10 seconds to ${formatTime(audio.currentTime)}`);
                }
            },
            onSeekForward: () => {
                const audio = audioRef.current;
                if (audio) {
                    audio.currentTime = Math.min(duration, audio.currentTime + 10);
                    announceToScreenReader(`Fast forwarded 10 seconds to ${formatTime(audio.currentTime)}`);
                }
            },
            onVolumeUp: () => {
                const newVolume = Math.min(1, volume + 0.1);
                setVolume(newVolume);
                if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                }
                announceToScreenReader(`Volume increased to ${Math.round(newVolume * 100)}%`);
            },
            onVolumeDown: () => {
                const newVolume = Math.max(0, volume - 0.1);
                setVolume(newVolume);
                if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                }
                announceToScreenReader(`Volume decreased to ${Math.round(newVolume * 100)}%`);
            }
        });
    };

    // Volume handlers
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        const audio = audioRef.current;
        if (audio) {
            audio.volume = newVolume;
        }

        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const handleMuteToggle = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            audio.volume = volume;
            setIsMuted(false);
        } else {
            audio.volume = 0;
            setIsMuted(true);
        }
    };

    // Retry handler
    const handleRetry = () => {
        setError(null);
        const audio = audioRef.current;
        if (audio) {
            audio.load();
        }
    };

    // Calculate progress percentage
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Don't render if no source
    if (!src) {
        return (
            <ErrorState>
                <div>🎧</div>
                <div>No audio source available</div>
            </ErrorState>
        );
    }

    return (
        <AudioPlayerContainer
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="application"
            aria-label={`Audio player for ${title || 'podcast'}`}
            {...props}
        >
            {/* Live region for announcements */}
            <div
                className="live-region"
                aria-live="polite"
                aria-atomic="true"
                role="status"
            >
                {announceText}
            </div>

            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                style={{ display: 'none' }}
                aria-label={`Audio track: ${title || 'podcast'}`}
            />

            {error ? (
                <ErrorState>
                    <div>⚠️</div>
                    <div>{error}</div>
                    <RetryButton onClick={handleRetry}>
                        Try Again
                    </RetryButton>
                </ErrorState>
            ) : (
                <>
                    <ControlsContainer role="group" aria-label="Audio controls">
                        <PlayButton
                            onClick={handlePlayPause}
                            disabled={loading || audioLoading}
                            aria-label={isPlaying ? `Pause ${title || 'audio'}` : `Play ${title || 'audio'}`}
                            aria-pressed={isPlaying}
                            className="audio-control"
                            title={`${isPlaying ? 'Pause' : 'Play'} (Space key)`}
                        >
                            {loading || audioLoading ? (
                                <LoadingSpinner aria-hidden="true" />
                            ) : isPlaying ? (
                                <span aria-hidden="true">⏸️</span>
                            ) : (
                                <span aria-hidden="true">▶️</span>
                            )}
                        </PlayButton>

                        <ProgressContainer>
                            <ProgressBarContainer
                                ref={progressRef}
                                onClick={handleSeek}
                                role="slider"
                                aria-label="Audio progress"
                                aria-valuemin={0}
                                aria-valuemax={duration}
                                aria-valuenow={currentTime}
                                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                                tabIndex={0}
                                className="progress-bar"
                                title="Click to seek (Left/Right arrows to seek 10 seconds)"
                            >
                                <ProgressBarBuffer buffered={buffered} aria-hidden="true" />
                                <ProgressBarFill progress={progressPercent} aria-hidden="true" />
                            </ProgressBarContainer>

                            <TimeContainer aria-live="off">
                                <span aria-label={`Current time: ${formatTime(currentTime)}`}>
                                    {formatTime(currentTime)}
                                </span>
                                <span aria-label={`Total duration: ${formatTime(duration)}`}>
                                    {formatTime(duration)}
                                </span>
                            </TimeContainer>
                        </ProgressContainer>

                        <VolumeContainer role="group" aria-label="Volume controls">
                            <VolumeButton
                                onClick={handleMuteToggle}
                                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                                aria-pressed={isMuted}
                                className="audio-control"
                                title={`${isMuted ? 'Unmute' : 'Mute'} audio`}
                            >
                                <span aria-hidden="true">
                                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                                </span>
                            </VolumeButton>

                            <VolumeSlider
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume control"
                                aria-valuetext={`Volume ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                                title="Volume (Up/Down arrows to adjust)"
                            />
                        </VolumeContainer>
                    </ControlsContainer>

                    {(loading || audioLoading) && (
                        <LoadingState>
                            <LoadingSpinner />
                            <span>Loading audio...</span>
                        </LoadingState>
                    )}
                </>
            )}
        </AudioPlayerContainer>
    );
}

export default AudioPlayer;