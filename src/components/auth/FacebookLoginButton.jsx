import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const FacebookLoginButton = ({ onSuccess, onError, text = "Continue with Facebook" }) => {
  const handleResponse = (response) => {
    if (response.accessToken) {
      onSuccess(response);
    } else {
      onError(new Error('Facebook login failed or was cancelled'));
    }
  };

  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

  if (!facebookAppId) {
    console.warn('VITE_FACEBOOK_APP_ID not configured - Facebook login disabled');
    return null;
  }

  return (
    <div className="facebook-login-container" style={{ position: 'relative' }}>
      {/* Hidden Facebook OAuth button */}
      <div style={{ 
        position: 'absolute', 
        opacity: 0, 
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <FacebookLogin
          appId={facebookAppId}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleResponse}
          cssClass="facebook-login-button"
          icon={<FacebookIcon />}
          textButton={text}
          style={{
            background: 'white',
            backgroundColor: 'white',
            border: '1px solid #dadce0',
            color: '#3c4043',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '0 16px',
            width: '100%',
            minHeight: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      
      {/* Custom overlay button */}
      <button
        type="button"
        onClick={() => {
          // Trigger the hidden Facebook button click
          const facebookButton = document.querySelector('.facebook-login-container .facebook-login-button');
          if (facebookButton) {
            facebookButton.click();
          }
        }}
        style={{
          position: 'relative',
          zIndex: 2,
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
        <FacebookIcon />
        {text}
      </button>
    </div>
  );
};

export default FacebookLoginButton;