/**
 * Custom hook for audio preloading and progressive loading
 * Optimizes audio delivery for podcast playback
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioPreloader = (audioUrl, options = {}) => {
    const {
        preloadStrategy = 'metadata', // 'none', 'metadata', 'auto'
        enableProgressiveLoading = true,
        bufferSize = 1024 * 1024, // 1MB buffer
        onProgress = null,
        onCanPlay = null,
        onError = null
    } = options;

    const [isLoading, setIsLoading] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [canPlay, setCanPlay] = useState(false);
    const [error, setError] = useState(null);
    const [duration, setDuration] = useState(0);
    const [bufferedRanges, setBufferedRanges] = useState([]);

    const audioRef = useRef(null);
    const progressIntervalRef = useRef(null);

    // Create audio element and set up preloading
    useEffect(() => {
        if (!audioUrl) return;

        const audio = new Audio();
        audioRef.current = audio;

        // Set preload strategy
        audio.preload = preloadStrategy;

        // Enable CORS for cross-origin audio
        audio.crossOrigin = 'anonymous';

        // Set up event listeners
        const handleLoadStart = () => {
            setIsLoading(true);
            setError(null);
            setLoadProgress(0);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
            if (onCanPlay) onCanPlay();
        };

        const handleCanPlay = () => {
            setCanPlay(true);
            setIsLoading(false);
        };

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const buffered = [];
                for (let i = 0; i < audio.buffered.length; i++) {
                    buffered.push({
                        start: audio.buffered.start(i),
                        end: audio.buffered.end(i)
                    });
                }
                setBufferedRanges(buffered);

                // Calculate total buffered percentage
                const totalBuffered = buffered.reduce((total, range) =>
                    total + (range.end - range.start), 0
                );
                const progress = audio.duration > 0 ? (totalBuffered / audio.duration) * 100 : 0;
                setLoadProgress(Math.min(progress, 100));

                if (onProgress) onProgress(progress, buffered);
            }
        };

        const handleError = (e) => {
            setIsLoading(false);
            setCanPlay(false);
            const errorMessage = getAudioErrorMessage(audio.error);
            setError(errorMessage);
            if (onError) onError(errorMessage);
        };

        const handleStalled = () => {
            // Handle network stalls
            console.warn('Audio loading stalled');
        };

        const handleSuspend = () => {
            // Handle when loading is suspended
            setIsLoading(false);
        };

        // Add event listeners
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('progress', handleProgress);
        audio.addEventListener('error', handleError);
        audio.addEventListener('stalled', handleStalled);
        audio.addEventListener('suspend', handleSuspend);

        // Start loading
        audio.src = audioUrl;

        // Set up progress monitoring for progressive loading
        if (enableProgressiveLoading) {
            progressIntervalRef.current = setInterval(() => {
                handleProgress();
            }, 500);
        }

        return () => {
            // Cleanup
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('progress', handleProgress);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('stalled', handleStalled);
            audio.removeEventListener('suspend', handleSuspend);

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            // Pause and cleanup audio
            audio.pause();
            audio.src = '';
            audio.load();
        };
    }, [audioUrl, preloadStrategy, enableProgressiveLoading, onProgress, onCanPlay, onError]);

    // Get audio error message
    const getAudioErrorMessage = (error) => {
        if (!error) return 'Unknown audio error';

        switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
                return 'Audio loading was aborted';
            case error.MEDIA_ERR_NETWORK:
                return 'Network error while loading audio';
            case error.MEDIA_ERR_DECODE:
                return 'Audio file is corrupted or unsupported';
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                return 'Audio format not supported';
            default:
                return 'Failed to load audio file';
        }
    };

    // Preload next audio file
    const preloadNext = useCallback((nextAudioUrl) => {
        if (!nextAudioUrl) return;

        const nextAudio = new Audio();
        nextAudio.preload = 'metadata';
        nextAudio.src = nextAudioUrl;

        // Store reference for cleanup if needed
        return nextAudio;
    }, []);

    // Get buffered percentage for a specific time
    const getBufferedPercentage = useCallback((currentTime = 0) => {
        if (!audioRef.current || !audioRef.current.duration) return 0;

        const audio = audioRef.current;
        for (let i = 0; i < audio.buffered.length; i++) {
            if (currentTime >= audio.buffered.start(i) && currentTime <= audio.buffered.end(i)) {
                return (audio.buffered.end(i) / audio.duration) * 100;
            }
        }
        return 0;
    }, []);

    // Check if time range is buffered
    const isTimeRangeBuffered = useCallback((startTime, endTime) => {
        if (!audioRef.current) return false;

        const audio = audioRef.current;
        for (let i = 0; i < audio.buffered.length; i++) {
            if (startTime >= audio.buffered.start(i) && endTime <= audio.buffered.end(i)) {
                return true;
            }
        }
        return false;
    }, []);

    return {
        audioElement: audioRef.current,
        isLoading,
        loadProgress,
        canPlay,
        error,
        duration,
        bufferedRanges,
        preloadNext,
        getBufferedPercentage,
        isTimeRangeBuffered
    };
};

export default useAudioPreloader;