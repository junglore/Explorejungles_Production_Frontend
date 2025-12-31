import React from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import JungloreLogoSvg from '../../assets/images/common/Fullpage_JungloreLogo.png';
import Linkdin from "../../assets/images/common/linkdine.svg";
import Twitter from "../../assets/images/common/tweeter.svg";
import Insta from "../../assets/images/common/insta.svg";
import Fb from "../../assets/images/common/facebook.svg";

// Footer Components
const FooterContainer = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `52px 8%`,
    boxSizing: `border-box`,
    width: `100%`,
    minHeight: `350px`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    '@media (max-width: 1024px)': {
        padding: `39px 6%`,
        minHeight: `320px`,
    },
    '@media (max-width: 768px)': {
        padding: `39px 5%`,
        minHeight: `380px`,
    },
    '@media (max-width: 480px)': {
        padding: `32px 4%`,
        minHeight: `360px`,
    },
});

const FooterContent = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `flex-start`,
    width: `100%`,
    maxWidth: `1200px`,
    marginBottom: `39px`,
    '@media (max-width: 1024px)': {
        marginBottom: `32px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        gap: `32px`,
        marginBottom: `26px`,
        alignItems: 'center',
    },
    '@media (max-width: 480px)': {
        gap: `24px`,
        marginBottom: `19px`,
    },
});

const FooterLogo = styled("div")({
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `"Helvetica Neue Medium Extended", sans-serif`,
    fontWeight: `700`,
    fontSize: `21px`,
    letterSpacing: `2px`,
    textTransform: `uppercase`,
    marginBottom: `26px`,
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 1024px)': {
        fontSize: `18px`,
        marginBottom: `19px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        marginBottom: `20px`,
        justifyContent: 'center',
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        letterSpacing: `1px`,
    },
});

const FooterLogoSection = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '@media (max-width: 768px)': {
        alignItems: 'center',
        textAlign: 'center',
    },
});

const FooterSection = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-start`,
    gap: `10px`,
    '@media (max-width: 768px)': {
        alignItems: 'center',
        textAlign: 'center',
        gap: `8px`,
    },
    '@media (max-width: 480px)': {
        gap: `6px`,
    },
});

const FooterSectionTitle = styled("div")({
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `700`,
    fontSize: `12px`,
    marginBottom: `6px`,
    '@media (max-width: 1024px)': {
        fontSize: `10px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `14px`,
        marginBottom: `8px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `12px`,
    },
});

const FooterLink = styled(Link)({
    color: `rgba(30, 45, 39, 0.8)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `10px`,
    cursor: `pointer`,
    transition: `color 0.3s ease`,
    textDecoration: `none`,
    '&:hover': {
        color: `rgba(30, 45, 39, 1)`,
    },
    '@media (max-width: 1024px)': {
        fontSize: `9px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `12px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `10px`,
    },
});

const SubscribeSection = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-start`,
    maxWidth: `300px`,
    '@media (max-width: 768px)': {
        alignItems: 'center',
        maxWidth: '100%',
        width: '100%',
    },
});

const EmailInput = styled("input")({
    width: `250px`,
    padding: `8px 10px`,
    borderRadius: `25px`,
    border: `2px solid rgba(30, 45, 39, 0.3)`,
    backgroundColor: `rgba(30, 45, 39, 0.1)`,
    color: `rgba(30, 45, 39, 1)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontSize: `9px`,
    marginBottom: `10px`,
    boxSizing: 'border-box',
    '&::placeholder': {
        color: `rgba(30, 45, 39, 0.6)`,
    },
    '&:focus': {
        outline: `none`,
        borderColor: `rgba(30, 45, 39, 0.6)`,
    },
    '@media (max-width: 1024px)': {
        width: `220px`,
    },
    '@media (max-width: 768px)': {
        width: `100%`,
        maxWidth: `300px`,
        padding: `10px 12px`,
        fontSize: `11px`,
        marginBottom: `12px`,
    },
    '@media (max-width: 480px)': {
        padding: `8px 10px`,
        fontSize: `10px`,
    },
});

const SubscribeButton = styled("button")({
    padding: `8px 16px`,
    borderRadius: `25px`,
    border: `none`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `600`,
    fontSize: `9px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(30, 45, 39, 0.9)`,
        transform: `translateY(-2px)`,
    },
    '@media (max-width: 480px)': {
        padding: `8px 14px`,
        fontSize: `9px`,
    },
});

const SubscribeText = styled("div")({
    color: `rgba(30, 45, 39, 0.8)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `9px`,
    lineHeight: `1.4`,
    marginTop: `10px`,
    '@media (max-width: 768px)': {
        textAlign: 'center',
        fontSize: `10px`,
        marginTop: `12px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `9px`,
        marginTop: `10px`,
    },
});

const FooterBottom = styled("div")({
    width: `100%`,
    maxWidth: `1200px`,
    borderTop: `1px solid rgba(30, 45, 39, 0.3)`,
    paddingTop: `20px`,
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    flexWrap: `wrap`,
    gap: `20px`,
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: `16px`,
        gap: `15px`,
    },
    '@media (max-width: 480px)': {
        paddingTop: `13px`,
        gap: `12px`,
    },
});

const Copyright = styled("div")({
    color: `rgba(30, 45, 39, 0.8)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `400`,
    fontSize: `9px`,
    '@media (max-width: 768px)': {
        textAlign: 'center',
        order: 2,
        fontSize: `10px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `9px`,
    },
});

const LegalLinks = styled("div")({
    display: `flex`,
    gap: `20px`,
    flexWrap: `wrap`,
    '@media (max-width: 768px)': {
        justifyContent: 'center',
        order: 1,
        gap: `15px`,
    },
    '@media (max-width: 480px)': {
        gap: `12px`,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const LegalLink = styled("div")({
    color: `rgba(30, 45, 39, 0.8)`,
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontWeight: `500`,
    fontSize: `9px`,
    cursor: `pointer`,
    transition: `color 0.3s ease`,
    '&:hover': {
        color: `rgba(30, 45, 39, 1)`,
    },
    '@media (max-width: 480px)': {
        fontSize: `9px`,
    },
});

const FollowUsText = styled("div")({
    color: 'rgba(30, 45, 39, 0.8)',
    fontFamily: `"DM Sans-Medium", Helvetica`,
    fontSize: '10px',
    marginBottom: '13px',
    '@media (max-width: 1024px)': {
        fontSize: '9px',
    },
    '@media (max-width: 768px)': {
        fontSize: '12px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    '@media (max-width: 480px)': {
        fontSize: '10px',
        marginBottom: '12px',
    },
});

const FooterLogoImage = styled("img")({
    height: '31px',
    width: 'auto',
    display: 'block',
    filter: 'brightness(0) saturate(100%) invert(100%)', // White color filter
    '@media (max-width: 1024px)': {
        height: '27px',
    },
    '@media (max-width: 768px)': {
        height: '25px',
    },
    '@media (max-width: 480px)': {
        height: '21px',
    },
});

const FooterSectionsContainer = styled("div")({
    display: 'flex',
    gap: '39px',
    '@media (max-width: 1024px)': {
        gap: '26px',
    },
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        alignItems: 'center',
    },
    '@media (max-width: 480px)': {
        gap: '20px',
    },
});

const FooterLogoMask = styled("div")({
    height: '48px',
    width: '220px',
    backgroundColor: '#1E2D27',
    WebkitMaskImage: `url(${JungloreLogoSvg})`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'left center',
    WebkitMaskSize: 'contain',
    maskImage: `url(${JungloreLogoSvg})`,
    maskRepeat: 'no-repeat',
    maskPosition: 'left center',
    maskSize: 'contain',
    display: 'block',
    '@media (max-width: 1024px)': {
        height: '42px',
        width: '200px',
    },
    '@media (max-width: 768px)': {
        height: '38px',
        width: '180px',
    },
    '@media (max-width: 480px)': {
        height: '32px',
        width: '150px',
    },
});

const SocialIconsContainer = styled("div")({
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
    '@media (max-width: 768px)': {
        justifyContent: 'center',
        width: '100%',
    },
});

const SocialAnchor = styled("a")({
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: '2px solid rgba(30, 45, 39, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: '6px',
    boxSizing: 'border-box',
    transition: 'all 0.18s ease',
    '@media (max-width: 480px)': {
        width: '48px',
        height: '48px',
    },
});

const SocialIconImage = styled("img")({
    width: '22px',
    height: '22px',
    objectFit: 'contain',
    filter: 'brightness(0) saturate(100%) invert(12%) sepia(13%) saturate(1234%) hue-rotate(135deg) brightness(97%) contrast(88%)',
});



const Footer = React.forwardRef((props, ref) => {
    return (
        <FooterContainer ref={ref}>
            <FooterContent className="footer-content">
                <FooterLogoSection>
                    <FooterLogo>
                        <FooterLogoMask role="img" aria-label="Junglore Logo" />
                    </FooterLogo>
                    <FollowUsText>
                        Follow Us
                    </FollowUsText>
                    <SocialIconsContainer>
                        <SocialAnchor href="https://www.linkedin.com/company/junglore/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <SocialIconImage src={Linkdin} alt="LinkedIn" />
                        </SocialAnchor>
                        <SocialAnchor href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                            <SocialIconImage src={Twitter} alt="Twitter" />
                        </SocialAnchor>
                        <SocialAnchor href="https://www.facebook.com/profile.php?id=61563322723211&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <SocialIconImage src={Fb} alt="Facebook" />
                        </SocialAnchor>
                        <SocialAnchor href="https://www.instagram.com/junglore_/?igsh=NXgxOThpaWFwNHly#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <SocialIconImage src={Insta} alt="Instagram" />
                        </SocialAnchor>
                    </SocialIconsContainer>
                </FooterLogoSection>

                <FooterSectionsContainer>
                    <FooterSection>
                        <FooterSectionTitle>Navigation</FooterSectionTitle>
                        <FooterLink to="/resources">Resources</FooterLink>
                        <FooterLink to="/media">Media & Podcasts</FooterLink>
                        <FooterLink to="/community">Community</FooterLink>
                        <FooterLink to="/about">About Us</FooterLink>
                    </FooterSection>

                    <FooterSection>
                        <FooterSectionTitle>Contact Us</FooterSectionTitle>
                        <FooterLink>info@junglore.com</FooterLink>
                    </FooterSection>

                    <SubscribeSection>
                        <FooterSectionTitle>Subscribe</FooterSectionTitle>
                        <EmailInput type="email" placeholder="Email address" />
                        <SubscribeButton>Subscribe</SubscribeButton>
                        <SubscribeText>
                            We are your 'go-to' partners for a memorable, wholesome jungle exploring adventure!
                        </SubscribeText>
                    </SubscribeSection>
                </FooterSectionsContainer>
            </FooterContent>

            <FooterBottom>
                <Copyright>2026 All right reserved - Junglore</Copyright>
                <LegalLinks>
                    <LegalLink>Disclaimer</LegalLink>
                    <LegalLink>Privacy policy</LegalLink>
                    <LegalLink>Terms of use</LegalLink>
                    <LegalLink>Terms & Conditions</LegalLink>
                </LegalLinks>
            </FooterBottom>
        </FooterContainer>
    );
});

export default Footer; 