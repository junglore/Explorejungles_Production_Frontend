import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import { Button, Input } from '../../components/ui';
import { CurrencyDisplay } from '../../components/rewards';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import quizService from '../../services/quizService';
import apiService from '../../services/api.js';
import flyingBirdImage from '../../assets/images/flyingbird.png';
import treeBranchImage from '../../assets/images/Desktop3_tree_branch_2.png';
import vinesImage from '../../assets/images/media/download-vines-leaves-green-royalty-free-stock-illustration-image-4.png';
import scoutImage from '../../assets/images/profilepage/scout.png';

const ProfileContainer = styled('div')({
    backgroundColor: '#1E2D27',
    position: 'relative',
    overflow: 'hidden',
});

const MainContent = styled('div')({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '140px 20px 40px 20px',
    position: 'relative',
    zIndex: 2,
    '@media (max-width: 1440px)': {
        maxWidth: '90%',
        padding: '130px 30px 40px 30px',
    },
    '@media (max-width: 1024px)': {
        maxWidth: '95%',
        padding: '120px 25px 30px 25px',
    },
    '@media (max-width: 768px)': {
        padding: '100px 15px 30px 15px',
    },
    '@media (max-width: 480px)': {
        padding: '90px 10px 20px 10px',
    },
});

const ProfileBanner = styled('div')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '40px',
    paddingTop: '40px',
    '@media (max-width: 1024px)': {
        paddingTop: '30px',
        marginBottom: '30px',
    },
    '@media (max-width: 768px)': {
        paddingTop: '20px',
        marginBottom: '25px',
    },
    '@media (max-width: 480px)': {
        paddingTop: '15px',
        marginBottom: '20px',
    },
});

const ProfileCircle = styled('div')({
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '4px solid #FFE8A1',
    background: 'rgba(30, 45, 39, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    zIndex: 2,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        '& .avatar-overlay': {
            opacity: 1,
        },
    },
    '@media (max-width: 1024px)': {
        width: '160px',
        height: '160px',
        border: '3px solid #FFE8A1',
    },
    '@media (max-width: 768px)': {
        width: '140px',
        height: '140px',
        marginBottom: '15px',
    },
    '@media (max-width: 480px)': {
        width: '120px',
        height: '120px',
        border: '3px solid #FFE8A1',
        marginBottom: '12px',
    },
    '@media (max-width: 360px)': {
        width: '100px',
        height: '100px',
        marginBottom: '10px',
    },
});

const AvatarImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
});

const AvatarOverlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: '50%',
});

const HiddenFileInput = styled('input')({
    display: 'none',
});

const ScoutImage = styled('img')({
    width: '400px',
    height: 'auto',
    objectFit: 'contain',
    zIndex: 1,
    marginLeft: '20px',
    marginTop: '-25px',
    '@media (max-width: 1200px)': {
        width: '350px',
        marginLeft: '15px',
    },
    '@media (max-width: 1024px)': {
        width: '300px',
        marginLeft: '10px',
        marginTop: '-20px',
    },
    '@media (max-width: 768px)': {
        width: '250px',
        marginLeft: '8px',
        marginTop: '-15px',
    },
    '@media (max-width: 480px)': {
        width: '200px',
        marginLeft: '5px',
        marginTop: '-10px',
    },
    '@media (max-width: 360px)': {
        width: '160px',
        marginLeft: '3px',
        marginTop: '-8px',
    },
});

const CameraIcon = styled('div')({
    width: '50px',
    height: '50px',
    background: 'rgba(255, 232, 161, 0.8)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#1E2D27',
    cursor: 'pointer',
    '&::before': {
        content: '"📷"',
        fontSize: '24px',
    },
    '@media (max-width: 1024px)': {
        width: '45px',
        height: '45px',
        fontSize: '18px',
        '&::before': {
            fontSize: '22px',
        },
    },
    '@media (max-width: 768px)': {
        width: '40px',
        height: '40px',
        fontSize: '16px',
        '&::before': {
            fontSize: '20px',
        },
    },
    '@media (max-width: 480px)': {
        width: '35px',
        height: '35px',
        fontSize: '14px',
        borderRadius: '6px',
        '&::before': {
            fontSize: '18px',
        },
    },
    '@media (max-width: 360px)': {
        width: '30px',
        height: '30px',
        fontSize: '12px',
        '&::before': {
            fontSize: '16px',
        },
    },
});

const ProfileInfo = styled('div')({
    textAlign: 'center',
    marginTop: '20px',
    position: 'relative',
    zIndex: 2,
});

const ProfileName = styled('h1')({
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFE8A1',
    margin: '0 0 8px 0',
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center',
    '@media (max-width: 1024px)': {
        fontSize: '24px',
        letterSpacing: '1.5px',
    },
    '@media (max-width: 768px)': {
        fontSize: '22px',
        letterSpacing: '1px',
        margin: '0 0 6px 0',
    },
    '@media (max-width: 480px)': {
        fontSize: '18px',
        letterSpacing: '0.5px',
    },
    '@media (max-width: 360px)': {
        fontSize: '16px',
        letterSpacing: '0.5px',
    },
});

const ProfileEmail = styled('p')({
    fontSize: '16px',
    color: '#FFE8A1',
    margin: '0 0 20px 0',
    opacity: 0.9,
    fontFamily: 'DM Sans, sans-serif',
    textAlign: 'center',
    '@media (max-width: 1024px)': {
        fontSize: '15px',
        margin: '0 0 18px 0',
    },
    '@media (max-width: 768px)': {
        fontSize: '14px',
        margin: '0 0 16px 0',
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
        margin: '0 0 14px 0',
    },
    '@media (max-width: 360px)': {
        fontSize: '12px',
        margin: '0 0 12px 0',
    },
});

const ProfileStats = styled('div')({
    display: 'flex',
    gap: '40px',
    justifyContent: 'center',
    '@media (max-width: 1024px)': {
        gap: '32px',
    },
    '@media (max-width: 768px)': {
        gap: '24px',
    },
    '@media (max-width: 480px)': {
        gap: '20px',
    },
    '@media (max-width: 360px)': {
        gap: '16px',
    },
});

const StatItem = styled('div')({
    textAlign: 'center',
    position: 'relative',
    '&:not(:last-child)::after': {
        content: '"●"',
        position: 'absolute',
        right: '-22px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#FFE8A1',
        fontSize: '8px',
        '@media (max-width: 1024px)': {
            right: '-18px',
        },
        '@media (max-width: 768px)': {
            right: '-14px',
            fontSize: '7px',
        },
        '@media (max-width: 480px)': {
            right: '-12px',
            fontSize: '6px',
        },
        '@media (max-width: 360px)': {
            right: '-10px',
            fontSize: '6px',
        },
    },
});

const StatText = styled('div')({
    fontSize: '14px',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '@media (max-width: 1024px)': {
        fontSize: '13px',
        letterSpacing: '0.8px',
    },
    '@media (max-width: 768px)': {
        fontSize: '12px',
        letterSpacing: '0.6px',
    },
    '@media (max-width: 480px)': {
        fontSize: '11px',
        letterSpacing: '0.4px',
    },
    '@media (max-width: 360px)': {
        fontSize: '10px',
        letterSpacing: '0.2px',
    },
});

const Section = styled('div')({
    backgroundColor: 'rgba(205, 217, 157, 0.1)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    position: 'relative',
    '@media (max-width: 1024px)': {
        padding: '25px',
        marginBottom: '25px',
    },
    '@media (max-width: 768px)': {
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '12px',
    },
    '@media (max-width: 480px)': {
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '10px',
    },
    '@media (max-width: 360px)': {
        padding: '12px',
        marginBottom: '12px',
        borderRadius: '8px',
    },
});

const SectionTitle = styled('h2')({
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFE8A1',
    margin: '0 0 25px 0',
    fontFamily: 'DM Sans, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '@media (max-width: 1024px)': {
        fontSize: '24px',
        margin: '0 0 20px 0',
    },
    '@media (max-width: 768px)': {
        fontSize: '22px',
        margin: '0 0 18px 0',
        letterSpacing: '0.8px',
    },
    '@media (max-width: 480px)': {
        fontSize: '20px',
        margin: '0 0 16px 0',
        letterSpacing: '0.6px',
    },
    '@media (max-width: 360px)': {
        fontSize: '18px',
        margin: '0 0 14px 0',
        letterSpacing: '0.4px',
    },
});

const FormGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '14px',
    },
    '@media (max-width: 360px)': {
        gap: '12px',
    },
});

const FormField = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    '@media (max-width: 480px)': {
        gap: '6px',
    },
});

const FormLabel = styled('label')({
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 768px)': {
        fontSize: '15px',
    },
    '@media (max-width: 480px)': {
        fontSize: '14px',
    },
    '@media (max-width: 360px)': {
        fontSize: '13px',
    },
});

const FormSelect = styled('select')({
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid rgba(205, 217, 157, 0.3)',
    backgroundColor: 'rgba(205, 217, 157, 0.1)',
    color: '#FFE8A1',
    fontSize: '16px',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.3s ease',
    minHeight: '48px',
    '&:focus': {
        outline: 'none',
        borderColor: '#CDD99D',
    },
    '@media (max-width: 768px)': {
        padding: '10px 14px',
        fontSize: '15px',
        minHeight: '44px',
    },
    '@media (max-width: 480px)': {
        padding: '8px 12px',
        fontSize: '14px',
        minHeight: '40px',
    },
    '@media (max-width: 360px)': {
        padding: '6px 10px',
        fontSize: '13px',
        minHeight: '36px',
    },
});

const InterestGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '8px',
    },
    '@media (max-width: 360px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '6px',
    },
});

const InterestTag = styled('div')({
    backgroundColor: 'rgba(205, 217, 157, 0.3)',
    color: '#FFE8A1',
    padding: '10px 15px',
    borderRadius: '25px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&:hover': {
        backgroundColor: 'rgba(205, 217, 157, 0.5)',
        transform: 'translateY(-2px)',
    },
    '&.active': {
        backgroundColor: '#CDD99D',
        color: '#1E2D27',
        borderColor: '#FFE8A1',
    },
    '@media (max-width: 1024px)': {
        padding: '8px 12px',
        fontSize: '13px',
    },
    '@media (max-width: 768px)': {
        padding: '7px 10px',
        fontSize: '12px',
        borderRadius: '20px',
    },
    '@media (max-width: 480px)': {
        padding: '6px 8px',
        fontSize: '11px',
        borderRadius: '18px',
    },
    '@media (max-width: 360px)': {
        padding: '5px 6px',
        fontSize: '10px',
        borderRadius: '15px',
    },
});

const ActivityGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '18px',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '14px',
    },
});

const ActivityCard = styled('div')({
    backgroundColor: 'rgba(205, 217, 157, 0.2)',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
    '@media (max-width: 1024px)': {
        padding: '20px',
    },
    '@media (max-width: 768px)': {
        padding: '18px',
        borderRadius: '10px',
    },
    '@media (max-width: 480px)': {
        padding: '16px',
        borderRadius: '8px',
    },
    '@media (max-width: 360px)': {
        padding: '14px',
    },
});

const ActivityNumber = styled('div')({
    fontSize: '32px',
    fontWeight: '700',
    color: '#FFE8A1',
    marginBottom: '10px',
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 1024px)': {
        fontSize: '28px',
        marginBottom: '8px',
    },
    '@media (max-width: 768px)': {
        fontSize: '24px',
        marginBottom: '6px',
    },
    '@media (max-width: 480px)': {
        fontSize: '20px',
        marginBottom: '4px',
    },
    '@media (max-width: 360px)': {
        fontSize: '18px',
    },
});

const ActivityLabel = styled('div')({
    fontSize: '16px',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    opacity: 0.9,
    '@media (max-width: 1024px)': {
        fontSize: '15px',
    },
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
    '@media (max-width: 480px)': {
        fontSize: '13px',
    },
    '@media (max-width: 360px)': {
        fontSize: '12px',
    },
});

const CreditsSection = styled('div')({
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '16px',
    padding: '32px',
    border: '2px solid rgba(255, 232, 161, 0.2)',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
        padding: '24px',
        marginBottom: '32px',
    },
    '@media (max-width: 480px)': {
        padding: '20px',
        marginBottom: '24px',
    },
});

const CreditsHeader = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
    },
});

const CreditsBalance = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 768px)': {
        fontSize: '24px',
    },
});

const CreditsGuide = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    color: '#CDD99D',
    lineHeight: '1.6',
});

const RedemptionOptions = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
    },
});

const RedemptionCard = styled('div')({
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-2px)',
    },
});

const QuizGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px',
    },
    '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
    },
    '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '14px',
    },
});

const QuizCard = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '12px',
    padding: '20px',
    color: '#FFE8A1',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '200px',
    backgroundImage: 'linear-gradient(135deg, rgba(109, 115, 83, 0.4) 0%, rgba(157, 166, 120, 0.4) 100%)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
    '@media (max-width: 1024px)': {
        padding: '18px',
        minHeight: '180px',
    },
    '@media (max-width: 768px)': {
        padding: '16px',
        minHeight: '160px',
        borderRadius: '10px',
    },
    '@media (max-width: 480px)': {
        padding: '14px',
        minHeight: '140px',
        borderRadius: '8px',
    },
    '@media (max-width: 360px)': {
        padding: '12px',
        minHeight: '120px',
    },
});

const QuizTitle = styled('h3')({
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 15px 0',
    fontFamily: 'DM Sans, sans-serif',
    '@media (max-width: 1024px)': {
        fontSize: '18px',
        margin: '0 0 12px 0',
    },
    '@media (max-width: 768px)': {
        fontSize: '16px',
        margin: '0 0 10px 0',
    },
    '@media (max-width: 480px)': {
        fontSize: '15px',
        margin: '0 0 8px 0',
    },
    '@media (max-width: 360px)': {
        fontSize: '14px',
        margin: '0 0 6px 0',
    },
});

const QuizBadge = styled('div')({
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '15px',
    '&.completed': {
        backgroundColor: '#1E2D27',
        color: '#FFE8A1',
    },
    '&.excellent': {
        backgroundColor: '#4CAF50',
        color: 'white',
    },
    '&.good': {
        backgroundColor: '#FFC107',
        color: '#1E2D27',
    },
    '&.new': {
        backgroundColor: '#FFE8A1',
        color: '#F1663F',
    },
});

const QuizStats = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 232, 161, 0.3)',
});

const LinksGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '20px',
    alignItems: 'end',
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
    },
});

// Decorative Images
const FlyingBird = styled('img')({
    position: 'absolute',
    top: '17%',
    right: '3%',
    width: '200px',
    height: 'auto',
    zIndex: 1,
    '@media (max-width: 768px)': {
        width: '120px',
        right: '1%',
        opacity: 0.15,
    },
});

const LogoutButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    margin: '40px 0 20px 0',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'center',
    },
});

const LogoutButton = styled('button')({
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#F1663F',
    border: '2px solid #F1663F',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '&:hover': {
        backgroundColor: '#F1663F',
        color: 'white',
        transform: 'translateY(-2px)',
    },
    '@media (max-width: 768px)': {
        width: '200px',
    },
});

const TreeBranch = styled('img')({
    position: 'absolute',
    top: '5%',
    left: '-60px',
    width: '400px',
    height: 'auto',
    zIndex: 1,
    transform: `scaleX(-1)`, // Mirror the image
    '@media (max-width: 768px)': {
        width: '180px',
        left: '-40px',
        opacity: 0.1,
    },
});

const VinesDecoration = styled('img')({
    position: 'absolute',
    bottom: '15%',
    right: '5%',
    width: '140px',
    height: 'auto',
    opacity: 0.2,
    zIndex: 1,
    '@media (max-width: 768px)': {
        width: '90px',
        right: '2%',
        opacity: 0.1,
    },
});

// Quiz Milestones Section Component
const QuizMilestonesSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [quizHistory, setQuizHistory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuizHistory = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const history = await quizService.getUserQuizHistory();
                setQuizHistory(history);
            } catch (error) {
                console.error('Error loading quiz history:', error);
            } finally {
                setLoading(false);
            }
        };

        loadQuizHistory();
    }, [isAuthenticated]);

    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes === 0) return `${remainingSeconds}s`;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getPerformanceBadge = (percentage) => {
        if (percentage >= 90) return { text: '✓ EXCELLENT', className: 'excellent' };
        if (percentage >= 75) return { text: '✓ GOOD', className: 'good' };
        if (percentage >= 60) return { text: '✓ COMPLETED', className: 'completed' };
        return { text: '✓ COMPLETED', className: 'completed' };
    };

    // Get recent quizzes (last 3)
    const recentQuizzes = quizHistory?.results?.slice(0, 3) || [];

    return (
        <Section>
            <SectionTitle>Quiz Milestones</SectionTitle>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#CDD99D' }}>
                    Loading quiz history...
                </div>
            ) : recentQuizzes.length > 0 ? (
                <>
                    <QuizGrid>
                        {recentQuizzes.map((result, index) => {
                            const badge = getPerformanceBadge(result.percentage);
                            return (
                                <QuizCard
                                    key={`${result.quiz_id}-${index}`}
                                    onClick={() => navigate(`/quizzes/${result.quiz_id}/results`, { state: { result } })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <QuizTitle>{result.quiz_title || 'Quiz'}</QuizTitle>
                                    <QuizBadge className={badge.className}>{badge.text}</QuizBadge>
                                    <QuizStats>
                                        <span>📊 {result.score}/{result.max_score} ({result.percentage}%)</span>
                                        <span>⏱️ {formatTime(result.time_taken)}</span>
                                    </QuizStats>
                                </QuizCard>
                            );
                        })}
                    </QuizGrid>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button
                            variant="outline"
                            size="medium"
                            onClick={() => navigate('/quiz-history')}
                        >
                            View All Quiz History
                        </Button>
                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#CDD99D',
                    backgroundColor: 'rgba(205, 217, 157, 0.05)',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎯</div>
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>No quizzes completed yet</div>
                    <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '20px' }}>
                        Start taking quizzes to track your learning progress!
                    </div>
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={() => navigate('/quizzes')}
                    >
                        Browse Quizzes
                    </Button>
                </div>
            )}
        </Section>
    );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const { logout, user, updateProfile, refreshAuth, loading: authLoading } = useAuth();
    
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        gender: '',
        country: '',
        bio: '',
        avatar_url: '',
        language: 'English',
        occupation: 'Wildlife Photographer',
        favoriteSpecies: 'Bengal Tiger',
        expertise: 'Wildlife Photography',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [avatarUploading, setAvatarUploading] = useState(false);

    // Initialize form data with user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            console.log('User data received:', user);
            setFormData(prevData => ({
                ...prevData,
                fullName: user.full_name || '',
                username: user.username || '',
                email: user.email || '',
                gender: user.gender ? mapGenderFromBackend(user.gender) : '',
                country: user.country || '',
                bio: user.bio || '',
                avatar_url: user.avatar_url || '',
            }));
            console.log('Form data set with:', {
                gender: user.gender ? mapGenderFromBackend(user.gender) : '',
                country: user.country || '',
                bio: user.bio || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    // Map backend gender enum to frontend display values
    const mapGenderFromBackend = (backendGender) => {
        const genderMap = {
            'male': 'Male',
            'female': 'Female',
            'other': 'Other',
            'prefer_not_to_say': 'Prefer not to say'
        };
        return genderMap[backendGender] || backendGender;
    };

    // Map frontend gender to backend enum
    const mapGenderToBackend = (frontendGender) => {
        const genderMap = {
            'Male': 'male',
            'Female': 'female',
            'Other': 'other',
            'Prefer not to say': 'prefer_not_to_say'
        };
        return genderMap[frontendGender] || frontendGender.toLowerCase().replace(/\s+/g, '_');
    };

    const [interests, setInterests] = useState([
        { name: 'Wildlife', active: true },
        { name: 'Photography', active: true },
        { name: 'Conservation', active: true },
        { name: 'Birds', active: false },
        { name: 'Mammals', active: true },
        { name: 'Reptiles', active: false },
        { name: 'Marine Life', active: false },
        { name: 'Botany', active: false },
    ]);

    const [links, setLinks] = useState([
        { name: 'Instagram', url: 'https://instagram.com/aisharawat03' },
        { name: 'Website', url: 'https://aisharawat-photography.com' },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Add validation for specific fields
        let processedValue = value;
        
        if (name === 'username') {
            // Remove spaces and special characters except underscore and hyphen
            processedValue = value.replace(/[^\w-]/g, '');
        } else if (name === 'email') {
            // Convert to lowercase
            processedValue = value.toLowerCase();
        } else if (name === 'fullName') {
            // Capitalize first letter of each word
            processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        setFormData({
            ...formData,
            [name]: processedValue,
        });
    };

    const toggleInterest = (index) => {
        setInterests(interests.map((interest, i) =>
            i === index ? { ...interest, active: !interest.active } : interest
        ));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setUpdateMessage('');

            // Basic validation
            if (!formData.fullName.trim()) {
                setUpdateMessage('Full name is required.');
                return;
            }
            
            if (!formData.username.trim()) {
                setUpdateMessage('Username is required.');
                return;
            }
            
            if (formData.username.length < 3) {
                setUpdateMessage('Username must be at least 3 characters long.');
                return;
            }
            
            if (!formData.email.trim()) {
                setUpdateMessage('Email is required.');
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setUpdateMessage('Please enter a valid email address.');
                return;
            }

            // Prepare data for backend (only the fields that exist in the user model)
            const profileData = {
                full_name: formData.fullName.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                gender: formData.gender ? mapGenderToBackend(formData.gender) : null,
                country: formData.country || null,
                bio: formData.bio ? formData.bio.trim() : null,
            };

            // Debug: Log the data being sent
            console.log('Sending profile data:', profileData);
            console.log('Form data:', formData);

            // Remove empty strings and convert to null
            Object.keys(profileData).forEach(key => {
                if (profileData[key] === '') {
                    profileData[key] = null;
                }
            });

            console.log('Final profile data to send:', profileData);

            await updateProfile(profileData);
            setUpdateMessage('Profile updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setUpdateMessage(''), 3000);
        } catch (error) {
            console.error('Profile update failed:', error);
            setUpdateMessage(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirect to home after logout
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUpdateMessage('Please select an image file for avatar upload.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setUpdateMessage('Avatar image must be less than 5MB.');
            return;
        }

        try {
            setAvatarUploading(true);
            setUpdateMessage('');

            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const token = apiService.getToken();
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const result = await apiService.postFormData('/auth/upload-avatar', uploadFormData);
            
            // Update the form data with new avatar URL
            setFormData(prev => ({
                ...prev,
                avatar_url: result.avatar_url
            }));

            // Refresh user profile to get updated avatar
            try {
                await refreshAuth();
            } catch (profileError) {
                console.warn('Failed to refresh profile:', profileError);
            }

            setUpdateMessage('Avatar uploaded successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setUpdateMessage(''), 3000);

        } catch (error) {
            console.error('Avatar upload failed:', error);
            setUpdateMessage(error.message || 'Failed to upload avatar. Please try again.');
        } finally {
            setAvatarUploading(false);
        }
    };

    const triggerAvatarUpload = () => {
        document.getElementById('avatar-upload-input').click();
    };

    return (
        <ProfileContainer>
            <Header />

            {/* Decorative Images */}
            <FlyingBird src={flyingBirdImage} alt="Flying Bird" />
            <TreeBranch src={treeBranchImage} alt="Tree Branch" />
            <VinesDecoration src={vinesImage} alt="Vines" />

            <MainContent>
                {/* Profile Banner */}
                <ProfileBanner>
                    <ProfileCircle onClick={triggerAvatarUpload}>
                        {formData.avatar_url ? (
                            <>
                                <AvatarImage 
                                    src={formData.avatar_url} 
                                    alt="User Avatar" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <AvatarOverlay className="avatar-overlay">
                                    <CameraIcon />
                                </AvatarOverlay>
                            </>
                        ) : (
                            <CameraIcon />
                        )}
                        {avatarUploading && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFE8A1',
                                fontSize: '14px',
                                zIndex: 10
                            }}>
                                Uploading...
                            </div>
                        )}
                    </ProfileCircle>
                    <HiddenFileInput
                        id="avatar-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                    />
                    <ScoutImage src={scoutImage} alt="Scout Uniform" />
                    <ProfileInfo>
                        <ProfileName>{formData.fullName || 'User'}</ProfileName>
                        <ProfileEmail>{formData.email || 'No email'}</ProfileEmail>
                        <ProfileStats>
                            <StatItem>
                                <StatText>0 FOLLOWERS</StatText>
                            </StatItem>
                            <StatItem>
                                <StatText>20 FOLLOWING</StatText>
                            </StatItem>
                        </ProfileStats>
                    </ProfileInfo>
                </ProfileBanner>

                {/* Basic Information */}
                <Section>
                    <SectionTitle>Basic Information</SectionTitle>
                    <FormGrid>
                        <FormField>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                        <FormField>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                        <FormField>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                        <FormField>
                            <FormLabel>Gender</FormLabel>
                            <FormSelect
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </FormSelect>
                        </FormField>
                        <FormField>
                            <FormLabel>Country</FormLabel>
                            <FormSelect
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Country</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Australia">Australia</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Canada">Canada</option>
                                <option value="China">China</option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Japan">Japan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="South Africa">South Africa</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Thailand">Thailand</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="Other">Other</option>
                            </FormSelect>
                        </FormField>
                        <FormField>
                            <FormLabel>Bio</FormLabel>
                            <Input
                                type="text"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself"
                                variant="outlined"
                                size="medium"
                                multiline
                                rows={3}
                            />
                        </FormField>
                        <FormField>
                            <FormLabel>Language</FormLabel>
                            <FormSelect
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Other">Other</option>
                            </FormSelect>
                        </FormField>
                        <FormField>
                            <FormLabel>Occupation</FormLabel>
                            <Input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleInputChange}
                                placeholder="Enter your occupation"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                    </FormGrid>
                </Section>

                {/* Interests */}
                <Section>
                    <SectionTitle>Your Interests</SectionTitle>
                    <FormGrid>
                        <FormField>
                            <FormLabel>Favorite Species</FormLabel>
                            <Input
                                type="text"
                                name="favoriteSpecies"
                                value={formData.favoriteSpecies}
                                onChange={handleInputChange}
                                placeholder="Enter your favorite species"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                        <FormField>
                            <FormLabel>Areas of Expertise</FormLabel>
                            <Input
                                type="text"
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleInputChange}
                                placeholder="Enter your areas of expertise"
                                variant="outlined"
                                size="medium"
                            />
                        </FormField>
                    </FormGrid>
                    <div style={{ marginTop: '25px' }}>
                        <FormLabel style={{ marginBottom: '15px', display: 'block' }}>Topics Followed</FormLabel>
                        <InterestGrid>
                            {interests.map((interest, index) => (
                                <InterestTag
                                    key={index}
                                    className={interest.active ? 'active' : ''}
                                    onClick={() => toggleInterest(index)}
                                >
                                    {interest.name}
                                </InterestTag>
                            ))}
                        </InterestGrid>
                    </div>
                </Section>

                {/* Activity */}
                <Section>
                    <SectionTitle>Your Activity</SectionTitle>
                    <ActivityGrid>
                        <ActivityCard>
                            <ActivityNumber>42</ActivityNumber>
                            <ActivityLabel>Your Posts</ActivityLabel>
                        </ActivityCard>
                        <ActivityCard>
                            <ActivityNumber>28</ActivityNumber>
                            <ActivityLabel>Saved Podcasts</ActivityLabel>
                        </ActivityCard>
                        <ActivityCard>
                            <ActivityNumber>156</ActivityNumber>
                            <ActivityLabel>Saved Photos</ActivityLabel>
                        </ActivityCard>
                    </ActivityGrid>
                </Section>

                {/* Credits & Rewards Section */}
                <Section>
                    <SectionTitle>Credits & Rewards</SectionTitle>
                    <CreditsSection>
                        <CreditsHeader>
                            <div>
                                <CreditsBalance>
                                    <CurrencyDisplay variant="compact" showBoth={true} />
                                </CreditsBalance>
                                <div style={{ color: '#CDD99D', fontSize: '14px', marginTop: '4px' }}>
                                    Available credits for discounts
                                </div>
                            </div>
                        </CreditsHeader>

                        <CreditsGuide>
                            <h4 style={{ color: '#FFE8A1', marginBottom: '12px', fontSize: '18px' }}>
                                💡 How to Use Your Credits
                            </h4>
                            <p style={{ marginBottom: '12px' }}>
                                Credits are your loyalty rewards that can be redeemed for real discounts:
                            </p>
                            <ul style={{ paddingLeft: '20px', margin: '0' }}>
                                <li><strong>500 credits</strong> = 2.5% discount</li>
                                <li><strong>1000 credits</strong> = 5% discount</li>
                                <li><strong>2000 credits</strong> = 10% discount</li>
                                <li><strong>4000 credits</strong> = 20% discount (maximum)</li>
                            </ul>
                            <p style={{ marginTop: '12px', fontSize: '13px', opacity: '0.8' }}>
                                💳 Credits expire after 6 months. Minimum redemption: 500 credits.
                            </p>
                        </CreditsGuide>

                        <RedemptionOptions>
                            <RedemptionCard onClick={() => window.open('https://junglore.com', '_blank')}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏕️</div>
                                <h4 style={{ color: '#FFE8A1', marginBottom: '8px' }}>Junglore Expeditions</h4>
                                <p style={{ color: '#CDD99D', fontSize: '14px', margin: '0' }}>
                                    Use credits for discounts on wildlife expeditions and eco-tours
                                </p>
                            </RedemptionCard>
                            
                            <RedemptionCard onClick={() => window.open('https://store.junglore.com', '_blank')}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏪</div>
                                <h4 style={{ color: '#FFE8A1', marginBottom: '8px' }}>House of Junglore</h4>
                                <p style={{ color: '#CDD99D', fontSize: '14px', margin: '0' }}>
                                    Redeem credits for wildlife merchandise and conservation gear
                                </p>
                            </RedemptionCard>
                        </RedemptionOptions>
                    </CreditsSection>
                </Section>

                {/* Quiz Milestones */}
                <QuizMilestonesSection />
                {/* <Section>
                    <SectionTitle>Quiz Milestones</SectionTitle>
                    <QuizGrid>
                        <QuizCard>
                            <QuizTitle>Birds of India</QuizTitle>
                            <QuizBadge className="completed">✓ COMPLETED</QuizBadge>
                            <QuizStats>
                                <span>📚 20 Cards</span>
                                <span>⏱️ 2 min 30 sec</span>
                            </QuizStats>
                        </QuizCard>
                        <QuizCard>
                            <QuizTitle>Cultural Importance of Animals</QuizTitle>
                            <QuizBadge className="completed">✓ COMPLETED</QuizBadge>
                            <QuizStats>
                                <span>📚 15 Cards</span>
                                <span>⏱️ 1 min 45 sec</span>
                            </QuizStats>
                        </QuizCard>
                        <QuizCard>
                            <QuizTitle>Asian Wildlife</QuizTitle>
                            <QuizBadge className="new">NEW</QuizBadge>
                            <QuizStats>
                                <span>📚 25 Cards</span>
                                <span>⏱️ 3 min 15 sec</span>
                            </QuizStats>
                        </QuizCard>
                    </QuizGrid>
                </Section> */}

                {/* Links */}
                <Section>
                    <SectionTitle>Links</SectionTitle>
                    {links.map((link, index) => (
                        <LinksGrid key={index} style={{ marginBottom: '20px' }}>
                            <FormField>
                                <FormLabel>Link Name</FormLabel>
                                <Input
                                    type="text"
                                    value={link.name}
                                    placeholder="Enter link name"
                                    variant="outlined"
                                    size="medium"
                                />
                            </FormField>
                            <FormField>
                                <FormLabel>URL</FormLabel>
                                <Input
                                    type="url"
                                    value={link.url}
                                    placeholder="Enter URL"
                                    variant="outlined"
                                    size="medium"
                                />
                            </FormField>
                            <div style={{ paddingTop: '25px' }}>
                                <Button variant="outline" size="small">Remove</Button>
                            </div>
                        </LinksGrid>
                    ))}
                    <Button variant="outline" size="medium" style={{ marginTop: '20px' }}>+ Add Link</Button>
                </Section>

                {/* Update Message */}
                {updateMessage && (
                    <div style={{
                        textAlign: 'center',
                        margin: '20px 0',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: updateMessage.includes('successfully') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        border: `1px solid ${updateMessage.includes('successfully') ? '#4CAF50' : '#F44336'}`,
                        color: updateMessage.includes('successfully') ? '#4CAF50' : '#F44336',
                        fontSize: '14px',
                        fontWeight: '600',
                    }}>
                        {updateMessage}
                    </div>
                )}

                {/* Save and Logout Buttons */}
                <LogoutButtonContainer>
                    <Button 
                        variant="primary" 
                        size="large" 
                        onClick={handleSave}
                        disabled={isLoading}
                        style={{ 
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </Button>
                    <LogoutButton onClick={handleLogout} disabled={isLoading}>
                        Logout
                    </LogoutButton>
                </LogoutButtonContainer>

            </MainContent>

            <Footer />
        </ProfileContainer>
    );
};

export default ProfilePage;
