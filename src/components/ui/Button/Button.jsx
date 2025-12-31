import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledButton = styled('button')(({ 
  variant, 
  size, 
  fullWidth, 
  disabled,
  loading,
  theme 
}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  border: 'none',
  borderRadius: '8px',
  fontFamily: '"DM Sans", Helvetica',
  fontWeight: '600',
  cursor: disabled || loading ? 'not-allowed' : 'pointer',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  position: 'relative',
  overflow: 'hidden',
  width: fullWidth ? '100%' : 'auto',
  opacity: disabled ? 0.6 : 1,
  
  // Size variants
  ...(size === 'small' && {
    padding: '8px 16px',
    fontSize: '12px',
    minHeight: '32px',
  }),
  ...(size === 'medium' && {
    padding: '12px 24px',
    fontSize: '14px',
    minHeight: '40px',
  }),
  ...(size === 'large' && {
    padding: '16px 32px',
    fontSize: '16px',
    minHeight: '48px',
  }),

  // Variant styles
  ...(variant === 'primary' && {
    backgroundColor: 'rgba(68, 122, 101, 1)',
    color: 'rgba(255, 255, 255, 1)',
    '&:hover': {
      backgroundColor: 'rgba(68, 122, 101, 0.8)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(68, 122, 101, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: 'rgba(255, 232, 161, 1)',
    border: '2px solid rgba(255, 232, 161, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 232, 161, 1)',
      color: 'rgba(30, 45, 39, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 232, 161, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    color: 'rgba(68, 122, 101, 1)',
    border: '2px solid rgba(68, 122, 101, 1)',
    '&:hover': {
      backgroundColor: 'rgba(68, 122, 101, 1)',
      color: 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  ...(variant === 'ghost' && {
    backgroundColor: 'transparent',
    color: 'rgba(255, 232, 161, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 232, 161, 0.1)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  ...(variant === 'danger' && {
    backgroundColor: 'rgba(220, 38, 38, 1)',
    color: 'rgba(255, 255, 255, 1)',
    '&:hover': {
      backgroundColor: 'rgba(185, 28, 28, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  // Loading state
  ...(loading && {
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  }),

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  // Responsive design
  '@media (max-width: 768px)': {
    ...(size === 'large' && {
      padding: '14px 28px',
      fontSize: '15px',
      minHeight: '44px',
    }),
  },
}));

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className,
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={handleClick}
      type={type}
      className={className}
      {...props}
    >
      {!loading && startIcon && startIcon}
      {loading ? 'Loading...' : children}
      {!loading && endIcon && endIcon}
    </StyledButton>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button; 