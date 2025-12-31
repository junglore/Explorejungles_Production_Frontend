import React, { forwardRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const InputContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

const StyledInput = styled('input')(({
    variant,
    size,
    error,
    success,
    disabled,
    fullWidth,
    hasIcon
}) => ({
    width: fullWidth ? '100%' : '100%',
    border: '2px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '8px',
    fontFamily: '"DM Sans", Helvetica',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    color: 'rgba(255, 232, 161, 1)',
    paddingLeft: hasIcon ? '40px' : '12px',

    // Size variants
    ...(size === 'small' && {
        padding: '8px 12px',
        fontSize: '12px',
        minHeight: '32px',
    }),
    ...(size === 'medium' && {
        padding: '12px 16px',
        fontSize: '14px',
        minHeight: '40px',
    }),
    ...(size === 'large' && {
        padding: '16px 20px',
        fontSize: '16px',
        minHeight: '48px',
    }),

    // Variant styles
    ...(variant === 'outlined' && {
        borderColor: 'rgba(205, 217, 157, 0.3)',
        backgroundColor: 'rgba(205, 217, 157, 0.1)',
        '&:hover': {
            borderColor: 'rgba(205, 217, 157, 0.6)',
        },
        '&:focus': {
            borderColor: 'rgba(205, 217, 157, 1)',
            boxShadow: '0 0 0 3px rgba(205, 217, 157, 0.1)',
        },
    }),

    ...(variant === 'filled' && {
        borderColor: 'transparent',
        backgroundColor: 'rgba(30, 45, 39, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(30, 45, 39, 0.2)',
        },
        '&:focus': {
            backgroundColor: 'rgba(30, 45, 39, 0.2)',
            borderColor: 'rgba(255, 232, 161, 0.5)',
            boxShadow: '0 0 0 3px rgba(255, 232, 161, 0.1)',
        },
    }),

    ...(variant === 'search' && {
        borderColor: 'rgba(255, 232, 161, 1)',
        borderWidth: '3px',
        backgroundColor: 'transparent',
        borderRadius: '24px',
        paddingLeft: '45px',
        paddingRight: '16px',
        '&:hover': {
            borderColor: 'rgba(255, 232, 161, 0.8)',
        },
        '&:focus': {
            borderColor: 'rgba(255, 232, 161, 1)',
            boxShadow: '0 0 0 3px rgba(255, 232, 161, 0.1)',
        },
    }),

    // Error state
    ...(error && {
        borderColor: 'rgba(220, 38, 38, 1)',
        '&:focus': {
            borderColor: 'rgba(220, 38, 38, 1)',
            boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
        },
    }),

    // Success state
    ...(success && {
        borderColor: 'rgba(34, 197, 94, 1)',
        '&:focus': {
            borderColor: 'rgba(34, 197, 94, 1)',
            boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
        },
    }),

    // Disabled state
    ...(disabled && {
        opacity: 0.6,
        cursor: 'not-allowed',
        backgroundColor: 'rgba(30, 45, 39, 0.05)',
    }),

    // Placeholder styles
    '&::placeholder': {
        color: 'rgba(255, 232, 161, 0.5)',
        fontWeight: '400',
    },

    // Responsive design
    '@media (max-width: 768px)': {
        ...(size === 'large' && {
            padding: '14px 18px',
            fontSize: '15px',
            minHeight: '44px',
        }),
        ...(variant === 'search' && {
            borderWidth: '2px',
            borderRadius: '20px',
            paddingLeft: '40px',
            paddingRight: '12px',
        }),
    },
}));

const InputWrapper = styled('div')({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
});

const InputIcon = styled('div')(({ position }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 232, 161, 0.7)',
    zIndex: 1,
    ...(position === 'start' && {
        left: '12px',
    }),
    ...(position === 'end' && {
        right: '12px',
    }),
}));

const HelperText = styled('div')(({ error, success }) => ({
    fontSize: '12px',
    marginTop: '4px',
    marginLeft: '4px',
    fontFamily: '"DM Sans", Helvetica',
    fontWeight: '500',
    ...(error && {
        color: 'rgba(220, 38, 38, 1)',
    }),
    ...(success && {
        color: 'rgba(34, 197, 94, 1)',
    }),
    ...(!error && !success && {
        color: 'rgba(255, 232, 161, 0.7)',
    }),
}));

const Label = styled('label')({
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: '"DM Sans", Helvetica',
    marginBottom: '8px',
    display: 'block',
});

const Input = forwardRef(({
    label,
    helperText,
    error,
    success,
    disabled,
    fullWidth = true,
    variant = 'outlined',
    size = 'medium',
    startIcon,
    endIcon,
    required,
    className,
    id,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    return (
        <InputContainer className={className}>
            {label && (
                <Label htmlFor={inputId}>
                    {label}
                    {required && <span style={{ color: 'rgba(220, 38, 38, 1)' }}> *</span>}
                </Label>
            )}

            <InputWrapper>
                {startIcon && (
                    <InputIcon position="start">
                        {startIcon}
                    </InputIcon>
                )}

                <StyledInput
                    ref={ref}
                    id={inputId}
                    variant={variant}
                    size={size}
                    error={error}
                    success={success}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    hasIcon={!!startIcon}
                    required={required}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />

                {endIcon && (
                    <InputIcon position="end">
                        {endIcon}
                    </InputIcon>
                )}
            </InputWrapper>

            {helperText && (
                <HelperText error={error} success={success}>
                    {helperText}
                </HelperText>
            )}
        </InputContainer>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    helperText: PropTypes.string,
    error: PropTypes.bool,
    success: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    variant: PropTypes.oneOf(['outlined', 'filled', 'search']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    required: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};

export default Input; 