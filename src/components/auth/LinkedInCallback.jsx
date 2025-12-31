import React, { useEffect } from 'react';

const LinkedInCallbackComponent = () => {
  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Check if we have an opener (popup scenario)
    if (window.opener) {
      if (error) {
        // Send error to parent window
        window.opener.postMessage({
          type: 'LINKEDIN_AUTH_ERROR',
          error: errorDescription || error || 'Authorization failed'
        }, window.location.origin);
      } else if (code) {
        // Send success to parent window
        window.opener.postMessage({
          type: 'LINKEDIN_AUTH_SUCCESS',
          code: code,
          state: state
        }, window.location.origin);
      }
      
      // Close the popup
      window.close();
    } else {
      // Fallback for non-popup scenario - redirect to login
      if (error) {
        window.location.href = '/login?error=' + encodeURIComponent(errorDescription || error);
      } else {
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0077b5',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Processing LinkedIn authentication...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LinkedInCallbackComponent;