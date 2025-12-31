import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { styled } from '@mui/material/styles';

// Custom styles for the lightbox to match your theme
const StyledLightbox = styled(Lightbox)({
    '& .yarl__root': {
        '--yarl__color_backdrop': 'rgba(30, 45, 39, 0.95)',
        '--yarl__color_button': 'rgba(255, 232, 161, 1)',
        '--yarl__color_button_active': 'rgba(255, 232, 161, 0.8)',
        '--yarl__color_button_disabled': 'rgba(255, 232, 161, 0.3)',
        '--yarl__color_navigation_button': 'rgba(255, 232, 161, 1)',
        '--yarl__color_navigation_button_active': 'rgba(255, 232, 161, 0.8)',
        '--yarl__color_navigation_button_disabled': 'rgba(255, 232, 161, 0.3)',
        '--yarl__color_toolbar': 'rgba(30, 45, 39, 0.8)',
        '--yarl__color_toolbar_border': 'rgba(255, 232, 161, 0.2)',
        '--yarl__border_radius': '12px',
        fontFamily: '"DM Sans", Helvetica',
    },
    '& .yarl__button': {
        backgroundColor: 'rgba(30, 45, 39, 0.8)',
        border: '2px solid rgba(255, 232, 161, 0.4)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 232, 161, 0.15)',
            borderColor: 'rgba(255, 232, 161, 0.6)',
        },
    },
    '& .yarl__navigation_button': {
        backgroundColor: 'rgba(30, 45, 39, 0.9)',
        border: '2px solid rgba(255, 232, 161, 0.4)',
        borderRadius: '50%',
        backdropFilter: 'blur(10px)',
        width: '60px',
        height: '60px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 232, 161, 0.15)',
            borderColor: 'rgba(255, 232, 161, 0.6)',
        },
    },
    '& .yarl__toolbar': {
        backgroundColor: 'rgba(30, 45, 39, 0.95)',
        borderBottom: '2px solid rgba(255, 232, 161, 0.3)',
        backdropFilter: 'blur(15px)',
        padding: '1rem',
    },
    '& .yarl__slide_image': {
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
});

// Custom slide component - handles both images and videos
const CustomSlide = ({ slide }) => {
    const { src, alt, media_type } = slide;

    const isVideo = media_type === 'VIDEO' || media_type === 'video';

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {isVideo ? (
                <video
                    src={src}
                    controls
                    style={{
                        maxWidth: '95%',
                        maxHeight: '95%',
                        borderRadius: '12px',
                        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
                    }}
                    onError={(e) => {
                        console.error('Video failed to load:', src);
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        maxWidth: '95%',
                        maxHeight: '95%',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
                    }}
                />
            )}
        </div>
    );
};

const ImageViewer = ({
    open,
    onClose,
    images = [],
    currentIndex = 0,
    onIndexChange
}) => {
    // Transform media items to lightbox format
    const slides = images.map(media => ({
        src: media.file_url,
        alt: media.title || (media.media_type === 'VIDEO' ? 'Wildlife Video' : 'Wildlife Image'),
        title: media.title,
        photographer: media.photographer,
        national_park: media.national_park,
        created_at: media.created_at,
        description: media.description,
        media_type: media.media_type,
    }));

    return (
        <StyledLightbox
            open={open}
            close={onClose}
            slides={slides}
            index={currentIndex}
            on={{
                view: ({ index }) => onIndexChange?.(index),
            }}
            render={{
                slide: CustomSlide,
            }}
            carousel={{
                finite: false,
                preload: 2,
            }}
            controller={{
                closeOnBackdropClick: true,
                closeOnPullDown: true,
                closeOnPullUp: true,
            }}
            animation={{
                fade: 300,
                swipe: 500,
            }}
            styles={{
                container: {
                    backgroundColor: 'rgba(30, 45, 39, 0.95)',
                },
            }}
        />
    );
};

export default ImageViewer;