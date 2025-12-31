/**
 * ProfileBalanceMenu Component
 * Displays user's Credits and Points balance in a dropdown menu
 * Activated on profile picture hover
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const ProfileBalanceMenu = () => {
  const { user } = useAuth();
  const { balance, refreshBalance, loadingStates } = useRewards();
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Fetch balance when menu opens
  useEffect(() => {
    if (isOpen && refreshBalance) {
      refreshBalance();
    }
  }, [isOpen, refreshBalance]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setIsOpen(false), 200);
    setHoverTimeout(timeout);
  };

  // Format balance with commas
  const formatBalance = (value) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const defaultAvatar = '/assets/images/Fullpage_Avatars___3d_avatar_21.png';
  const avatarUrl = user?.avatar_url 
    ? `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '')}${user.avatar_url}` 
    : defaultAvatar;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Picture */}
      <Link
        to="/profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
        }}
      >
        <Box
          component="img"
          src={avatarUrl}
          alt="Profile"
          sx={{
            height: { xs: '40px', sm: '50px' },
            width: { xs: '40px', sm: '50px' },
            objectFit: 'cover',
            borderRadius: '50%',
            border: '2px solid rgba(255, 232, 161, 1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />
      </Link>

      {/* Dropdown Balance Menu */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          minWidth: '240px',
          background: 'linear-gradient(135deg, rgba(31, 56, 44, 0.98) 0%, rgba(20, 35, 28, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: { xs: '14px 16px', sm: '16px 18px' },
          border: '2px solid rgba(255, 232, 161, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 9999,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-8px',
            right: '20px',
            width: '14px',
            height: '14px',
            background: 'linear-gradient(135deg, rgba(31, 56, 44, 0.98) 0%, rgba(20, 35, 28, 0.98) 100%)',
            border: '2px solid rgba(255, 232, 161, 0.6)',
            borderBottom: 'none',
            borderRight: 'none',
            transform: 'rotate(45deg)',
          },
        }}
      >
        {/* Credits Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            padding: { xs: '10px 12px', sm: '12px 14px' },
            backgroundColor: 'rgba(255, 232, 161, 0.08)',
            borderRadius: '10px',
            marginBottom: { xs: '8px', sm: '10px' },
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 232, 161, 0.12)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '36px', sm: '40px' },
              height: { xs: '36px', sm: '40px' },
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255, 232, 161, 0.2) 0%, rgba(255, 232, 161, 0.1) 100%)',
            }}
          >
            <AccountBalanceWalletIcon
              sx={{
                color: 'rgba(255, 232, 161, 1)',
                fontSize: { xs: '18px', sm: '20px' },
                filter: 'drop-shadow(0 0 6px rgba(255, 232, 161, 0.4))',
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255, 232, 161, 0.7)',
                fontSize: { xs: '10px', sm: '11px' },
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px',
                fontFamily: '"DM Sans", Helvetica',
              }}
            >
              Credits
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 232, 161, 1)',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 700,
                fontFamily: '"DM Sans", Helvetica',
                textShadow: '0 0 10px rgba(255, 232, 161, 0.3)',
              }}
            >
              {loadingStates?.balance ? '...' : formatBalance(balance?.credits || 0)}
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 232, 161, 0.3) 50%, transparent 100%)',
            margin: { xs: '8px 0', sm: '10px 0' },
          }}
        />

        {/* Points Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            padding: { xs: '10px 12px', sm: '12px 14px' },
            backgroundColor: 'rgba(255, 232, 161, 0.08)',
            borderRadius: '10px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 232, 161, 0.12)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '36px', sm: '40px' },
              height: { xs: '36px', sm: '40px' },
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255, 232, 161, 0.2) 0%, rgba(255, 232, 161, 0.1) 100%)',
            }}
          >
            <EmojiEventsIcon
              sx={{
                color: 'rgba(255, 232, 161, 1)',
                fontSize: { xs: '18px', sm: '20px' },
                filter: 'drop-shadow(0 0 6px rgba(255, 232, 161, 0.4))',
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255, 232, 161, 0.7)',
                fontSize: { xs: '10px', sm: '11px' },
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px',
                fontFamily: '"DM Sans", Helvetica',
              }}
            >
              Points
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 232, 161, 1)',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 700,
                fontFamily: '"DM Sans", Helvetica',
                textShadow: '0 0 10px rgba(255, 232, 161, 0.3)',
              }}
            >
              {loadingStates?.balance ? '...' : formatBalance(balance?.points || 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileBalanceMenu;
