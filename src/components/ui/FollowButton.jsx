import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

const StyledFollowButton = styled("button")(({ isFollowing }) => ({
    backgroundColor: isFollowing ? `rgba(68, 122, 101, 0.6)` : `rgba(68, 122, 101, 1)`,
    borderRadius: `8px`,
    padding: `12px 24px`,
    border: `none`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `14px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    textTransform: `uppercase`,
    '&:hover': {
        backgroundColor: isFollowing ? `rgba(68, 122, 101, 0.8)` : `rgba(68, 122, 101, 0.8)`,
        transform: `translateY(-2px)`,
    },
    // Override styles when custom styling is applied
    '&.custom-styled': {
        backgroundColor: 'transparent',
        border: '2px solid #FFE8A1',
        color: '#FFE8A1',
        borderRadius: '25px',
        padding: '10px 24px',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#FFE8A1',
            color: '#1E2D27',
            boxShadow: '0 4px 12px rgba(255, 232, 161, 0.3)',
        },
        '&.following': {
            backgroundColor: '#FFE8A1',
            color: '#1E2D27',
            borderColor: '#FFE8A1',
        },
        '&.following:hover': {
            backgroundColor: '#e6d48a',
            borderColor: '#e6d48a',
        },
    },
}));

function FollowButton({ className, customStyle, ...props }) {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleClick = () => {
        setIsFollowing(!isFollowing);
    };

    const buttonClassName = `${className || ''} ${customStyle ? 'custom-styled' : ''} ${isFollowing ? 'following' : ''}`.trim();

    return (
        <StyledFollowButton
            isFollowing={isFollowing}
            onClick={handleClick}
            className={buttonClassName}
            {...props}
        >
            {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
        </StyledFollowButton>
    );
}

export default FollowButton; 