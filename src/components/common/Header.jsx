import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import NotificationBell from './NotificationBell';
import notificationService from '../../services/notificationService';
import ProfileBalanceMenu from '../layout/ProfileBalanceMenu';

// Import existing images
import MagnifyingGlassImage from '../../assets/images/common/MagnifyingGlass.png';
import Avatars3DAvatar21Image from '../../assets/images/Fullpage_Avatars___3d_avatar_21.png';
import JungloreLogoImage from '../../assets/images/Junglore_Favicon_.png';

const Header1 = styled("div")(({ isVisible }) => ({
  display: `flex`,
  position: `fixed`, // Changed from absolute to fixed for scroll behavior
  top: `0px`,
  left: `0px`,
  right: `0px`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `100%`,
  height: `100px`,
  justifyContent: `center`,
  alignItems: `center`,
  padding: `20px 0px`,
  boxSizing: `border-box`,
  overflow: `visible`, // Changed from hidden to visible to allow dropdown to show
  zIndex: 10, // Lower z-index so mobile menu can cover it
  backgroundColor: `rgba(0, 0, 0, 0)`, // Semi-transparent background for fixed header
  backdropFilter: `blur(15px)`, // Blur effect for glassmorphism
  transform: isVisible ? 'translateY(0)' : 'translateY(-100%)', // Hide/show animation
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition
  '@media (max-width: 1200px)': {
    height: `100px`,
    padding: `18px 0px`,
  },
  '@media (max-width: 768px)': {
    height: `70px`,
    padding: `10px 0px`,
  },
  '@media (max-width: 480px)': {
    height: `60px`,
    padding: `8px 0px`,
  },
}));

const Frame7 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  alignItems: `center`,
  padding: `0px 60px`,
  boxSizing: `border-box`,
  height: `50px`,
  width: `100%`,
  maxWidth: `1400px`,
  '@media (max-width: 1440px)': {
    padding: `0px 50px`,
  },
  '@media (max-width: 1200px)': {
    padding: `0px 40px`,
  },
  '@media (max-width: 1024px)': {
    padding: `0px 30px`,
  },
  '@media (max-width: 768px)': {
    padding: `0px 20px`,
    height: `40px`,
  },
  '@media (max-width: 480px)': {
    padding: `0px 16px`,
    height: `35px`,
  },
  '@media (max-width: 360px)': {
    padding: `0px 12px`,
  },
});

const Group9 = styled(Link)({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `center`,
  alignItems: `center`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `60px`,
  height: `60px`,
  margin: `0px`,
  textDecoration: 'none',
  '@media (max-width: 768px)': {
    width: `50px`,
    height: `50px`,
  },
});

const Rectangle2 = styled("div")({
  border: `1px solid rgba(255, 232, 161, 1)`,
  boxSizing: `border-box`,
  borderRadius: `24px`,
  width: `48px`,
  height: `48px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
  backgroundColor: `rgba(0, 0, 0, 0.2)`,
  '@media (max-width: 768px)': {
    width: `40px`,
    height: `40px`,
    borderRadius: `20px`,
  },
});

const LogoImage = styled("img")({
  width: `80px`,
  height: `80px`,
  borderRadius: `4px`,
  objectFit: `contain`,
  filter: `brightness(0) saturate(100%) invert(100%)`, // White color filter
  transition: `all 0.3s ease`,
  '&:hover': {
    transform: `scale(1.05)`,
  },
  '@media (max-width: 768px)': {
    width: `40px`,
    height: `40px`,
  },
});

// Update Frame5 - Remove conflicting styles, this will be replaced by new structure
const Frame5 = styled("div")({
  // This component will be restructured
});

const MobileNavList = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 20px',
  gap: '20px',
  '@media (max-width: 480px)': {
    padding: '0 16px',
    gap: '16px',
  },
});

const MobileNavItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  padding: '15px 0',
  color: 'rgba(255, 232, 161, 1)',
  fontSize: '18px',
  fontFamily: '"DM Sans-Medium", Helvetica',
  fontWeight: '500',
  textDecoration: 'none',
  borderBottom: '1px solid rgba(255, 232, 161, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: 'white',
    paddingLeft: '10px',
    borderBottomColor: 'rgba(255, 232, 161, 0.3)',
  },
  '@media (max-width: 480px)': {
    fontSize: '16px',
    padding: '12px 0',
  },
});

const NavItem = styled(Link)({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 232, 161, 1)`,
  fontStyle: `normal`,
  fontFamily: '"DM Sans-Medium", Helvetica',
  fontWeight: `700`,
  fontSize: `16px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  lineHeight: `100%`,
  textTransform: `none`,
  height: `25px`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  cursor: `pointer`,
  transition: `all 0.3s ease`,
  position: `relative`,
  padding: `8px 0`,
  '&:hover': {
    color: `rgba(255, 232, 161, 0.8)`,
    '&::after': {
      width: `100%`,
    },
  },
  '&::after': {
    content: '""',
    position: `absolute`,
    bottom: `0`,
    left: `0`,
    width: `0`,
    height: `2px`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    transition: `width 0.3s ease`,
  },
  '@media (max-width: 1200px)': {
    fontSize: `15px`,
  },
  '@media (max-width: 1024px)': {
    fontSize: `14px`,
  },
  '@media (max-width: 768px)': {
    fontSize: `20px`,
    padding: `20px 0`,
    height: `auto`,
    width: `100%`,
    borderBottom: `1px solid rgba(255, 232, 161, 0.1)`,
    '&:hover': {
      backgroundColor: `rgba(255, 232, 161, 0.05)`,
      transform: `scale(1.02)`,
    },
  },
  '@media (max-width: 480px)': {
    fontSize: `18px`,
    padding: `18px 0`,
  },
});

const Frame6 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `center`,
  padding: `0px`,
  boxSizing: `border-box`,
  height: `50px`,
  gap: `15px`,
  '@media (max-width: 768px)': {
    gap: `10px`,
    height: `40px`,
  },
});

const SearchIconButton = styled("div")({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  cursor: `pointer`,
  transition: `all 0.3s ease`,
  position: `relative`,
  '&:hover img': {
    transform: `scale(1.1)`,
    filter: `brightness(1.2)`,
  },
  '@media (max-width: 768px)': {
    display: `none`, // Hide search icon on mobile
  },
});

const MagnifyingGlass = styled("img")({
  height: `24px`,
  width: `24px`,
  objectFit: `contain`,
  transition: `all 0.3s ease`,
  '@media (max-width: 768px)': {
    height: `20px`,
    width: `20px`,
  },
});

const SearchDropdown = styled("div")(({ isOpen }) => ({
  position: `absolute`,
  top: `calc(100% + 15px)`,
  right: `0`,
  width: `320px`,
  backgroundColor: `rgba(26, 42, 35, 0.98)`,
  backdropFilter: `blur(10px)`,
  borderRadius: `25px`,
  padding: `12px 20px`,
  boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5)`,
  display: isOpen ? `flex` : `none`,
  alignItems: `center`,
  gap: `10px`,
  zIndex: 1000,
  border: `2px solid rgba(255, 232, 161, 0.3)`,
  animation: isOpen ? `slideDown 0.3s ease` : `none`,
  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: `translateY(-10px)`,
    },
    to: {
      opacity: 1,
      transform: `translateY(0)`,
    },
  },
  '@media (max-width: 768px)': {
    width: `280px`,
    padding: `10px 16px`,
  },
  '@media (max-width: 480px)': {
    width: `260px`,
    right: `-20px`,
  },
}));

const DropdownSearchIcon = styled("img")({
  width: `20px`,
  height: `20px`,
  objectFit: `contain`,
  opacity: 0.7,
  filter: `brightness(0) saturate(100%) invert(88%) sepia(21%) saturate(653%) hue-rotate(340deg) brightness(105%) contrast(101%)`,
});

const DropdownSearchInput = styled("input")({
  flex: 1,
  border: `none`,
  outline: `none`,
  background: `transparent`,
  color: `rgba(255, 232, 161, 1)`,
  fontSize: `15px`,
  fontFamily: '"DM Sans-Medium", Helvetica',
  fontWeight: `500`,
  '&::placeholder': {
    color: `rgba(255, 232, 161, 0.6)`,
  },
  '@media (max-width: 480px)': {
    fontSize: `14px`,
  },
});

const ProfileAvatarLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
});

const Avatars3DAvatar21 = styled("img")({
  height: `50px`,
  width: `50px`,
  objectFit: `cover`,
  borderRadius: `50%`,
  border: `2px solid rgba(255, 232, 161, 1)`,
  cursor: `pointer`,
  transition: `transform 0.3s ease`,
  '&:hover': {
    transform: `scale(1.1)`,
  },
  '@media (max-width: 768px)': {
    height: `40px`,
    width: `40px`,
  },
});

const HamburgerMenu = styled("div")({
  display: `none`,
  flexDirection: `column`,
  cursor: `pointer`,
  padding: `8px`,
  borderRadius: `8px`,
  transition: `all 0.3s ease`,
  '&:hover': {
    backgroundColor: `rgba(255, 232, 161, 0.1)`,
    transform: `scale(1.05)`,
  },
  '@media (max-width: 768px)': {
    display: `flex`,
  },
});

const HamburgerBar = styled("div")(({ isOpen, index }) => ({
  width: `28px`,
  height: `3px`,
  backgroundColor: `rgba(255, 232, 161, 1)`,
  margin: `3px 0`,
  transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
  transformOrigin: `center`,
  borderRadius: `2px`,
  boxShadow: `0 1px 3px rgba(0, 0, 0, 0.2)`,
  ...(isOpen && index === 0 && {
    transform: `rotate(45deg) translate(7px, 7px)`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
  }),
  ...(isOpen && index === 1 && {
    opacity: 0,
    transform: `scale(0)`,
  }),
  ...(isOpen && index === 2 && {
    transform: `rotate(-45deg) translate(7px, -7px)`,
    backgroundColor: `rgba(255, 232, 161, 0.9)`,
  }),
  '@media (max-width: 480px)': {
    width: `24px`,
    height: `2.5px`,
    ...(isOpen && index === 0 && {
      transform: `rotate(45deg) translate(6px, 6px)`,
    }),
    ...(isOpen && index === 2 && {
      transform: `rotate(-45deg) translate(6px, -6px)`,
    }),
  },
}));

const HamburgerContainer = styled("div")({
  '@media (max-width: 768px)': {
    display: `flex`,
    alignItems: `center`,
    gap: `15px`,
  },
});

const AuthContainer = styled("div")({
  display: `flex`,
  alignItems: `center`,
  gap: `10px`,
});

const NotificationWrapper = styled("div")({
  display: `flex`,
  alignItems: `center`,
  '@media (max-width: 768px)': {
    display: `none`, // Hide notification bell on mobile
  },
});

const AuthButton = styled(Link)({
  padding: `8px 16px`,
  borderRadius: `20px`,
  textDecoration: `none`,
  fontSize: `14px`,
  fontWeight: `600`,
  transition: `all 0.3s ease`,
  cursor: `pointer`,
  border: `none`,
});

const LoginButton = styled(AuthButton)({
  backgroundColor: `transparent`,
  color: `rgba(255, 232, 161, 1)`,
  border: `3px solid rgba(255, 232, 161, 1)`,
  borderRadius: `24px`,
  height: `48px`,
  width: `100px`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  fontSize: `16px`,
  fontWeight: `600`,
  transition: `all 0.3s ease`,
  '&:hover': {
    backgroundColor: `rgba(255, 232, 161, 0.1)`,
    borderColor: `rgba(255, 232, 161, 0.8)`,
    boxShadow: `0 0 15px rgba(255, 232, 161, 0.3)`,
    transform: `scale(1.02)`,
  },
  '@media (max-width: 1024px)': {
    width: `90px`,
    fontSize: `15px`,
  },
  '@media (max-width: 768px)': {
    height: `40px`,
    width: `80px`,
    fontSize: `14px`,
    border: `2px solid rgba(255, 232, 161, 1)`,
  },
  '@media (max-width: 480px)': {
    height: `36px`,
    width: `70px`,
    fontSize: `13px`,
  },
});

// New styled components for layout sections
const LeftSection = styled("div")({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  '@media (max-width: 768px)': {
    flex: '0 0 auto',
  },
});

const CenterSection = styled("div")({
  flex: '1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  '@media (max-width: 768px)': {
    display: 'none', // Hide desktop navigation on mobile
  },
});

// Desktop Navigation Container
const DesktopNavigation = styled("div")({
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  '@media (max-width: 1024px)': {
    gap: '30px',
  },
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

// Mobile Menu Container - Fixed for proper mobile display
const MobileMenuContainer = styled("div")(({ isMenuOpen }) => ({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: '0',
    right: '0',
    width: '100%',
    height: '100vh',
    backgroundColor: '#000000', // Solid black background
    border: 'none',
    padding: '80px 0 30px 0',
    alignItems: 'flex-start',
    gap: '0px',
    zIndex: 9999, // Much higher z-index to ensure it's above everything
    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'auto',
  },
  '@media (max-width: 480px)': {
    top: '0',
    height: '100vh',
    padding: '70px 0 20px 0',
  },
}));

// Add a backdrop overlay to ensure nothing is visible behind
const MobileMenuBackdrop = styled("div")(({ isMenuOpen }) => ({
  display: 'none',
  '@media (max-width: 768px)': {
    display: isMenuOpen ? 'block' : 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100vh',
    backgroundColor: '#000000', // Solid black backdrop
    zIndex: 9998, // Just below the menu
  },
}));

// Close button for mobile menu
const CloseButton = styled("button")({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'none',
  border: 'none',
  color: 'rgba(255, 232, 161, 1)',
  fontSize: '28px',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '50%',
  width: '45px',
  height: '45px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  zIndex: 10000, // Highest z-index to ensure it's always clickable
  '&:hover': {
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    color: 'white',
  },
  '@media (max-width: 480px)': {
    top: '15px',
    right: '15px',
    width: '40px',
    height: '40px',
    fontSize: '24px',
  },
});

const RightSection = styled("div")({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '15px',
  '@media (max-width: 1024px)': {
    gap: '12px',
  },
  '@media (max-width: 768px)': {
    gap: '10px',
  },
  '@media (max-width: 480px)': {
    gap: '8px',
  },
});

// Mobile search component
const MobileSearchContainer = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 20px',
  marginBottom: '30px',
  '@media (max-width: 480px)': {
    padding: '0 16px',
    marginBottom: '25px',
  },
});

const MobileSearchBox = styled("div")({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 232, 161, 0.1)',
  border: '2px solid rgba(255, 232, 161, 0.3)',
  borderRadius: '25px',
  padding: '15px 20px',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    borderColor: 'rgba(255, 232, 161, 1)',
    backgroundColor: 'rgba(255, 232, 161, 0.15)',
    boxShadow: '0 0 20px rgba(255, 232, 161, 0.2)',
  },
  '@media (max-width: 480px)': {
    padding: '12px 16px',
  },
});

const MobileSearchInput = styled("input")({
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'rgba(255, 232, 161, 1)',
  fontSize: '16px',
  fontFamily: '"DM Sans-Medium", Helvetica',
  fontWeight: '500',
  marginLeft: '10px',
  '&::placeholder': {
    color: 'rgba(255, 232, 161, 0.6)',
  },
  '@media (max-width: 480px)': {
    fontSize: '15px',
  },
});

const MobileSearchIcon = styled("img")({
  width: '20px',
  height: '20px',
  opacity: 0.7,
  '@media (max-width: 480px)': {
    width: '18px',
    height: '18px',
  },
});

// Mobile Notifications Section
const MobileNotificationsSection = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 20px',
  marginBottom: '20px',
  '@media (max-width: 480px)': {
    padding: '0 16px',
    marginBottom: '16px',
  },
});

const NotificationsSectionHeader = styled("div")({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid rgba(255, 232, 161, 0.2)',
  marginBottom: '12px',
});

const NotificationsSectionTitle = styled("h3")({
  margin: 0,
  color: 'rgba(255, 232, 161, 1)',
  fontSize: '18px',
  fontWeight: '700',
  fontFamily: '"DM Sans-Medium", Helvetica',
});

const NotificationsHeaderRight = styled("div")({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const ClearAllButton = styled("button")({
  background: 'none',
  border: 'none',
  color: 'rgba(255, 232, 161, 0.7)',
  fontSize: '13px',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  fontFamily: '"DM Sans-Medium", Helvetica',
  '&:hover': {
    color: 'rgba(255, 232, 161, 1)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
  },
});

const NotificationsCount = styled("span")({
  background: '#ef4444',
  color: 'white',
  borderRadius: '12px',
  padding: '2px 8px',
  fontSize: '12px',
  fontWeight: '700',
});

const NotificationsList = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxHeight: '300px',
  overflowY: 'auto',
  paddingRight: '8px',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 232, 161, 0.3)',
    borderRadius: '3px',
    '&:hover': {
      background: 'rgba(255, 232, 161, 0.5)',
    },
  },
  '@media (max-width: 480px)': {
    maxHeight: '250px',
    gap: '8px',
  },
});

const NotificationItem = styled("div")(({ isRead }) => ({
  padding: '14px',
  background: isRead ? 'rgba(255, 232, 161, 0.05)' : 'rgba(255, 232, 161, 0.12)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 232, 161, 0.25)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    background: 'rgba(255, 232, 161, 0.18)',
    borderColor: 'rgba(255, 232, 161, 0.4)',
    transform: 'translateX(4px)',
  },
  '@media (max-width: 480px)': {
    padding: '12px',
  },
}));

const NotificationTitle = styled("div")({
  color: 'rgba(255, 232, 161, 1)',
  fontSize: '15px',
  fontWeight: '700',
  marginBottom: '6px',
  fontFamily: '"DM Sans-Medium", Helvetica',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '@media (max-width: 480px)': {
    fontSize: '14px',
  },
});

const NotificationMessage = styled("div")({
  color: 'rgba(255, 232, 161, 0.85)',
  fontSize: '14px',
  lineHeight: '1.5',
  fontFamily: '"DM Sans-Medium", Helvetica',
  marginBottom: '8px',
  '@media (max-width: 480px)': {
    fontSize: '13px',
  },
});

const NotificationTime = styled("div")({
  color: 'rgba(255, 232, 161, 0.5)',
  fontSize: '12px',
  fontFamily: '"DM Sans-Medium", Helvetica',
  '@media (max-width: 480px)': {
    fontSize: '11px',
  },
});

const EmptyNotifications = styled("div")({
  padding: '40px 20px',
  textAlign: 'center',
  color: 'rgba(255, 232, 161, 0.6)',
  fontSize: '15px',
  fontFamily: '"DM Sans-Medium", Helvetica',
  '@media (max-width: 480px)': {
    padding: '30px 16px',
    fontSize: '14px',
  },
});

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll handler for hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top of page
      if (currentScrollY === 0) {
        setIsHeaderVisible(true);
      }
      // Hide header when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px - hide header
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue && searchValue.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector('.search-container');
      if (isSearchOpen && searchContainer && !searchContainer.contains(event.target)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Fetch notifications for mobile menu
  useEffect(() => {
    if (isAuthenticated && isMenuOpen) {
      // Fetch notifications when menu opens
      notificationService.fetchBackendNotifications();
    }

    // Listen to notification updates
    const unsubscribe = notificationService.addBackendListener((data) => {
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, isMenuOpen]);

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await notificationService.markAsRead([notification.id]);
    }

    // Navigate to resource if URL exists
    if (notification.resource_url) {
      navigate(notification.resource_url);
      closeMenu();
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;
    
    // Mark all as read
    const notificationIds = notifications.map(n => n.id);
    await notificationService.markAsRead(notificationIds, false);
    
    // Clear local state immediately for better UX
    setNotifications([]);
    setUnreadCount(0);
    
    // Refresh notifications from backend
    await notificationService.fetchBackendNotifications();
  };

  return (
    <>
      <Header1 isVisible={isHeaderVisible}>
        <Frame7>
          {/* Left Section - Logo */}
          <LeftSection>
            <Group9 to="/" data-cy="logo">
              <LogoImage src={JungloreLogoImage} alt="Junglore Logo" loading="lazy" />
            </Group9>
          </LeftSection>

          {/* Center Section - Desktop Navigation */}
          <CenterSection>
            <DesktopNavigation>
              <NavItem to="/resources" onClick={closeMenu}>RESOURCES</NavItem>
              <NavItem to="/media" onClick={closeMenu}>MEDIA & PODCASTS</NavItem>
              <NavItem to="/community" onClick={closeMenu}>COMMUNITY</NavItem>
              <NavItem to="/about" onClick={closeMenu}>ABOUT US</NavItem>
            </DesktopNavigation>
          </CenterSection>

          {/* Right Section - Search and Auth */}
          <RightSection>
            <Frame6>
              {/* Search Icon with Dropdown - Only for authenticated users */}
              {isAuthenticated && (
                <SearchIconButton className="search-container" title="Search">
                  <MagnifyingGlass 
                    src={MagnifyingGlassImage} 
                    loading="lazy" 
                    alt="Search"
                    onClick={toggleSearch}
                  />
                  <SearchDropdown isOpen={isSearchOpen} onClick={(e) => e.stopPropagation()}>
                    <DropdownSearchIcon src={MagnifyingGlassImage} alt="Search" />
                    <DropdownSearchInput
                      type="text"
                      placeholder="Search Junglore..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(e);
                          closeSearch();
                        }
                      }}
                      autoFocus={isSearchOpen}
                    />
                  </SearchDropdown>
                </SearchIconButton>
              )}
              
              {/* Notification Bell - Hidden on mobile, only for authenticated users */}
              {isAuthenticated && (
                <NotificationWrapper>
                  <NotificationBell />
                </NotificationWrapper>
              )}
              
              <AuthContainer>
                {isAuthenticated ? (
                  <>
                    <ProfileBalanceMenu />
                  </>
                ) : (
                  <>
                    <LoginButton to="/login">Login</LoginButton>
                  </>
                )}
              </AuthContainer>

              <HamburgerContainer>
                <HamburgerMenu onClick={toggleMenu}>
                  <HamburgerBar isOpen={isMenuOpen} index={0} />
                  <HamburgerBar isOpen={isMenuOpen} index={1} />
                  <HamburgerBar isOpen={isMenuOpen} index={2} />
                </HamburgerMenu>
              </HamburgerContainer>
            </Frame6>
          </RightSection>
        </Frame7>
      </Header1>

      {/* Mobile Menu Backdrop - Ensures no background is visible */}
      <MobileMenuBackdrop isMenuOpen={isMenuOpen} />

      {/* Mobile Menu - Separate from main header */}
      <MobileMenuContainer isMenuOpen={isMenuOpen}>
        {/* Close Button */}
        <CloseButton onClick={closeMenu}>
          ✕
        </CloseButton>

        {/* Mobile Search - Only for authenticated users */}
        {isAuthenticated && (
          <MobileSearchContainer>
            <MobileSearchBox>
              <MobileSearchIcon
                alt="Search"
                src={MagnifyingGlassImage}
              />
              <MobileSearchInput 
                placeholder="Search here..." 
                value={searchValue}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
              />
            </MobileSearchBox>
          </MobileSearchContainer>
        )}

        {/* Mobile Notifications - Only for authenticated users */}
        {isAuthenticated && (
          <MobileNotificationsSection>
            <NotificationsSectionHeader>
              <NotificationsSectionTitle>Notifications</NotificationsSectionTitle>
              <NotificationsHeaderRight>
                {unreadCount > 0 && (
                  <NotificationsCount>{unreadCount}</NotificationsCount>
                )}
                {notifications.length > 0 && (
                  <ClearAllButton onClick={handleClearAllNotifications}>
                    Clear all
                  </ClearAllButton>
                )}
              </NotificationsHeaderRight>
            </NotificationsSectionHeader>
            
            <NotificationsList>
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    isRead={notification.is_read}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationMessage>{notification.message}</NotificationMessage>
                    <NotificationTime>{formatTimeAgo(notification.created_at)}</NotificationTime>
                  </NotificationItem>
                ))
              ) : (
                <EmptyNotifications>No notifications yet</EmptyNotifications>
              )}
            </NotificationsList>
          </MobileNotificationsSection>
        )}

        {/* Mobile Navigation Items */}
        <MobileNavList>
          <MobileNavItem to="/resources" onClick={closeMenu}>RESOURCES</MobileNavItem>
          <MobileNavItem to="/media" onClick={closeMenu}>MEDIA</MobileNavItem>
          <MobileNavItem to="/community" onClick={closeMenu}>COMMUNITY</MobileNavItem>
          <MobileNavItem to="/about" onClick={closeMenu}>ABOUT US</MobileNavItem>
          
          {/* Mobile Auth Items */}
          {!isAuthenticated ? (
            <MobileNavItem to="/login" onClick={closeMenu}>LOGIN</MobileNavItem>
          ) : (
            <>
              <MobileNavItem to="/profile" onClick={closeMenu}>PROFILE</MobileNavItem>
              <MobileNavItem 
                as="button" 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  closeMenu();
                  window.location.href = '/';
                }}
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                LOGOUT
              </MobileNavItem>
            </>
          )}
        </MobileNavList>
      </MobileMenuContainer>
    </>
  );
}

export default Header; 