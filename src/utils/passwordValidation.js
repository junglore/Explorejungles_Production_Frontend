/**
 * Password validation utilities
 * Rules: min 8 chars, at least one uppercase, one lowercase, one number, one special char
 */

export const PASSWORD_RULES = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
};

export const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    // Check minimum length
    if (password.length < PASSWORD_RULES.minLength) {
        errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long`);
    }

    // Check for uppercase letter
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase letter
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Check for number
    if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Check for special character
    if (PASSWORD_RULES.requireSpecialChar && !new RegExp(`[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', score: 0 };
    
    let score = 0;
    const checks = {
        length: password.length >= PASSWORD_RULES.minLength,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: new RegExp(`[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)
    };

    // Basic scoring
    Object.values(checks).forEach(check => {
        if (check) score++;
    });

    // Bonus points for longer passwords
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    const strength = {
        0: 'none',
        1: 'very-weak',
        2: 'weak', 
        3: 'fair',
        4: 'good',
        5: 'strong',
        6: 'very-strong',
        7: 'excellent'
    }[Math.min(score, 7)];

    return { strength, score, checks };
};

export const getPasswordRequirements = () => {
    return [
        `At least ${PASSWORD_RULES.minLength} characters long`,
        'At least one uppercase letter (A-Z)',
        'At least one lowercase letter (a-z)',
        'At least one number (0-9)',
        'At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)'
    ];
};

export const checkPasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
        return { isValid: false, error: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true, error: null };
};