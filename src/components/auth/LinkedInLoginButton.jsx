import React from 'react';

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LinkedInLoginButton = ({ onSuccess, onError, text = "Continue with LinkedIn" }) => {
  const linkedinClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  const handleLinkedInLogin = () => {
    if (!linkedinClientId) {
      onError(new Error('LinkedIn client ID not configured'));
      return;
    }

    const redirectUri = `${window.location.origin}/linkedin`;
    const scope = 'r_liteprofile r_emailaddress';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for validation
    localStorage.setItem('linkedin_oauth_state', state);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    // Open LinkedIn auth in a popup
    const popup = window.open(
      authUrl,
      'linkedin-login',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for the popup to close or send a message
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        onError(new Error('User closed the popup'));
      }
    }, 1000);

    // Listen for messages from the popup
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageListener);
        
        if (event.data.state !== localStorage.getItem('linkedin_oauth_state')) {
          onError(new Error('State mismatch'));
          return;
        }
        
        onSuccess({
          code: event.data.code,
          redirect_uri: redirectUri
        });
      } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageListener);
        onError(new Error(event.data.error || 'LinkedIn login failed'));
      }
    };

    window.addEventListener('message', messageListener);
  };

  if (!linkedinClientId) {
    console.warn('VITE_LINKEDIN_CLIENT_ID not configured - LinkedIn login disabled');
    return null;
  }

  return (
    <div className="linkedin-login-button">
      <button 
        onClick={handleLinkedInLogin} 
        type="button"
        style={{
          width: '100%',
          height: '44px',
          border: '1px solid #dadce0',
          borderRadius: '8px',
          backgroundColor: 'white',
          color: '#3c4043',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          padding: '0 16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <LinkedInIcon />
        {text}
      </button>
    </div>
  );
};

export default LinkedInLoginButton;