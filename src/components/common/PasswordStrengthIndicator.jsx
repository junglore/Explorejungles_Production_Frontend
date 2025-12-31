import React from 'react';
import { getPasswordStrength, getPasswordRequirements } from '../../utils/passwordValidation';

const PasswordStrengthIndicator = ({ password, showRequirements = true }) => {
    const { strength, score, checks } = getPasswordStrength(password);
    const requirements = getPasswordRequirements();

    if (!password) {
        return null;
    }

    const strengthLabels = {
        'none': 'No Password',
        'very-weak': 'Very Weak',
        'weak': 'Weak',
        'fair': 'Fair', 
        'good': 'Good',
        'strong': 'Strong',
        'very-strong': 'Very Strong',
        'excellent': 'Excellent'
    };

    const strengthColors = {
        'very-weak': '#ff4444',
        'weak': '#ff8800',
        'fair': '#ffaa00', 
        'good': '#88cc00',
        'strong': '#44cc44',
        'very-strong': '#00aa44',
        'excellent': '#008844'
    };

    const containerStyle = {
        marginTop: '8px',
        marginBottom: '16px'
    };

    const strengthMeterStyle = {
        display: 'flex',
        gap: '4px',
        marginBottom: '8px'
    };

    const strengthBarStyle = (index, filled) => ({
        height: '4px',
        flex: 1,
        backgroundColor: filled ? strengthColors[strength] || '#e0e0e0' : '#e0e0e0',
        borderRadius: '2px',
        transition: 'background-color 0.3s ease'
    });

    const strengthLabelStyle = {
        fontSize: '12px',
        fontWeight: '500',
        marginBottom: '8px',
        color: strengthColors[strength] || '#666'
    };

    const requirementsListStyle = {
        margin: 0,
        paddingLeft: '16px',
        fontSize: '12px'
    };

    const requirementItemStyle = (met) => ({
        color: met ? '#44cc44' : '#666',
        margin: '4px 0',
        transition: 'color 0.3s ease'
    });

    return (
        <div style={containerStyle}>
            <div style={strengthMeterStyle}>
                {[1, 2, 3, 4, 5].map(bar => (
                    <div
                        key={bar}
                        style={strengthBarStyle(bar, score >= bar)}
                    />
                ))}
            </div>
            <div style={strengthLabelStyle}>
                Password Strength: {strengthLabels[strength]}
            </div>
            
            {showRequirements && (
                <ul style={requirementsListStyle}>
                    <li style={requirementItemStyle(password.length >= 8)}>
                        {password.length >= 8 ? '✓' : '•'} {requirements[0]}
                    </li>
                    <li style={requirementItemStyle(checks.uppercase)}>
                        {checks.uppercase ? '✓' : '•'} {requirements[1]}
                    </li>
                    <li style={requirementItemStyle(checks.lowercase)}>
                        {checks.lowercase ? '✓' : '•'} {requirements[2]}
                    </li>
                    <li style={requirementItemStyle(checks.number)}>
                        {checks.number ? '✓' : '•'} {requirements[3]}
                    </li>
                    <li style={requirementItemStyle(checks.special)}>
                        {checks.special ? '✓' : '•'} {requirements[4]}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;