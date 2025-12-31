import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

// Import images
import Live1Image from '../../assets/images/community/live1.jpg';
import Live2Image from '../../assets/images/community/live2.jpg';
import Live3Image from '../../assets/images/community/live3.jpg';
import PodcastAvatar from '../../assets/images/media/podcastcarousal_1.png';
import AnimalBirdsImage from '../../assets/images/community/animal_birds.png';
import AnimalMammalImage from '../../assets/images/community/animal_mammal.png';
import AnimalMammalsImage from '../../assets/images/community/animal_mammals.png';
import PlantsAndBotanyImage from '../../assets/images/community/plantsandbotany.png';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import FollowButton from '../../components/ui/FollowButton';

const ProfileContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    minHeight: `100vh`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    padding: `0px`,
    margin: `0px`,
    boxSizing: `border-box`,
    overflow: `hidden`,
});

// Profile Section
const ProfileSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `120px 40px 80px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    '@media (max-width: 1024px)': {
        padding: `100px 30px 60px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        padding: `120px 20px 60px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        padding: `100px 15px 40px`,
    },
});

const ProfileContent = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    maxWidth: `1200px`,
    width: `100%`,
    alignItems: `center`,
    gap: `72px`,
    '@media (max-width: 1024px)': {
        gap: `50px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        gap: `30px`,
        alignItems: `center`,
    },
    '@media (max-width: 480px)': {
        gap: `20px`,
    },
});

const ProfileImage = styled("img")({
    height: `355px`,
    width: `280px`,
    objectFit: `cover`,
    borderRadius: `15px`,
    '@media (max-width: 1024px)': {
        height: `300px`,
        width: `240px`,
    },
    '@media (max-width: 768px)': {
        height: `250px`,
        width: `200px`,
    },
    '@media (max-width: 480px)': {
        height: `200px`,
        width: `160px`,
    },
});

const ProfileInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `flex-start`,
    alignItems: `flex-start`,
    flex: 1,
    '@media (max-width: 768px)': {
        alignItems: `center`,
        textAlign: `center`,
    },
});

const ProfileTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    marginBottom: `12px`,
    '@media (max-width: 1024px)': {
        fontSize: `28px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        marginBottom: `10px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        marginBottom: `8px`,
    },
});

const ProfileStats = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    gap: `13px`,
    marginBottom: `12px`,
    '@media (max-width: 768px)': {
        justifyContent: `center`,
    },
    '@media (max-width: 480px)': {
        flexDirection: `column`,
        gap: `8px`,
    },
});

const ProfileStat = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `20px`,
    letterSpacing: `0px`,
    '@media (max-width: 1024px)': {
        fontSize: `18px`,
    },
    '@media (max-width: 768px)': {
        fontSize: `16px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const StatDot = styled("div")({
    width: `5px`,
    height: `5px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    '@media (max-width: 480px)': {
        display: `none`,
    },
});

const ProfileTags = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `10px`,
    marginBottom: `55px`,
    flexWrap: `wrap`,
    '@media (max-width: 768px)': {
        justifyContent: `center`,
        marginBottom: `30px`,
    },
    '@media (max-width: 480px)': {
        gap: `8px`,
        marginBottom: `25px`,
    },
});

const ProfileTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `34px`,
    padding: `8px 16px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `11px`,
    letterSpacing: `0px`,
    textAlign: `center`,
    '@media (max-width: 480px)': {
        fontSize: `10px`,
        padding: `6px 12px`,
    },
});

// Live Section Components (reused from CommunityPage)
const LiveSection = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `80px 40px`,
    boxSizing: `border-box`,
    width: `100%`,
    backgroundColor: `rgba(30, 45, 39, 1)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        padding: `70px 30px`,
    },
    '@media (max-width: 768px)': {
        padding: `60px 20px`,
    },
    '@media (max-width: 480px)': {
        padding: `40px 15px`,
    },
});

const LiveTitle = styled("div")({
    textAlign: `left`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `32px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    width: `100%`,
    maxWidth: `1200px`,
    margin: `0px 0px 60px 0px`,
    '@media (max-width: 768px)': {
        fontSize: `24px`,
        margin: `0px 0px 40px 0px`,
        textAlign: `center`,
    },
    '@media (max-width: 480px)': {
        fontSize: `20px`,
        margin: `0px 0px 30px 0px`,
    },
});

const LiveCardsContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `flex-start`,
    gap: `25px`,
    maxWidth: `1200px`,
    width: `100%`,
    '@media (max-width: 1024px)': {
        justifyContent: `center`,
        flexWrap: `wrap`,
        gap: `20px`,
    },
    '@media (max-width: 768px)': {
        flexDirection: `column`,
        alignItems: `center`,
        gap: `30px`,
    },
});

const LiveCard = styled("div")({
    display: `flex`,
    position: `relative`,
    flexDirection: `column`,
    width: `100%`,
    maxWidth: `376px`,
    minWidth: `300px`,
    flex: `1`,
    backgroundColor: `transparent`,
    borderRadius: `10px`,
    overflow: `visible`,
    '@media (max-width: 1024px)': {
        maxWidth: `350px`,
        minWidth: `280px`,
    },
    '@media (max-width: 768px)': {
        maxWidth: `450px`,
        minWidth: `320px`,
        flex: `none`,
    },
    '@media (max-width: 480px)': {
        maxWidth: `100%`,
        minWidth: `280px`,
    },
});

const LiveVideo = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `234px`,
    borderRadius: `10px`,
    overflow: `hidden`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        height: `180px`,
    },
});

const LiveVideoImage = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
});

const LiveBadge = styled("div")({
    position: `absolute`,
    top: `15px`,
    left: `16px`,
    backgroundColor: `rgba(241, 63, 63, 1)`,
    borderRadius: `2px`,
    padding: `2px 6px`,
    color: `rgba(255, 255, 255, 1)`,
    fontStyle: `italic`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        top: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `2px 5px`,
    },
});

const ViewerCount = styled("div")({
    position: `absolute`,
    bottom: `16px`,
    left: `16px`,
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    borderRadius: `2px`,
    padding: `4px 8px`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `8px`,
    letterSpacing: `0.37px`,
    lineHeight: `13px`,
    textTransform: `none`,
    zIndex: 3,
    '@media (max-width: 480px)': {
        bottom: `12px`,
        left: `12px`,
        fontSize: `7px`,
        padding: `3px 6px`,
    },
});

const LiveInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    padding: `0px 70px 0px 15px`,
    gap: `5px`,
    marginBottom: `15px`,
    '@media (max-width: 480px)': {
        padding: `0px 60px 0px 15px`,
    },
});

const LiveVideoTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    wordWrap: `break-word`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        fontSize: `15px`,
    },
    '@media (max-width: 480px)': {
        fontSize: `14px`,
    },
});

const LiveChannel = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `500`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `uppercase`,
    lineHeight: `1.3`,
    opacity: 0.9,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const LiveCategory = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    lineHeight: `1.3`,
    opacity: 0.8,
    '@media (max-width: 480px)': {
        fontSize: `11px`,
    },
});

const LiveTags = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    gap: `5px`,
    padding: `0px 15px`,
    marginBottom: `10px`,
    flexWrap: `wrap`,
    alignItems: `flex-start`,
    '@media (max-width: 480px)': {
        gap: `4px`,
    },
});

const LiveTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `34px`,
    padding: `4px 12px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `10px`,
    letterSpacing: `0px`,
    textTransform: `none`,
    textAlign: `center`,
    lineHeight: `1.4`,
    whiteSpace: `nowrap`,
    flexShrink: 0,
    '@media (max-width: 480px)': {
        fontSize: `9px`,
        padding: `3px 10px`,
    },
});

const LiveAvatar = styled("img")({
    position: `absolute`,
    bottom: `55px`,
    right: `15px`,
    width: `49px`,
    height: `49px`,
    borderRadius: `50%`,
    objectFit: `cover`,
    border: `2px solid rgba(255, 232, 161, 0.3)`,
    zIndex: 2,
    '@media (max-width: 768px)': {
        width: `45px`,
        height: `45px`,
        bottom: `50px`,
    },
    '@media (max-width: 480px)': {
        width: `40px`,
        height: `40px`,
        bottom: `45px`,
        right: `10px`,
    },
});

const ShowMoreContainer = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
    width: `100%`,
    maxWidth: `1200px`,
    marginTop: `60px`,
    gap: `20px`,
    '@media (max-width: 768px)': {
        marginTop: `40px`,
        gap: `15px`,
    },
    '@media (max-width: 480px)': {
        marginTop: `30px`,
        gap: `10px`,
    },
});

const ShowMoreLine = styled("div")({
    border: `1px solid rgba(255, 232, 161, 1)`,
    height: `0px`,
    flex: `1`,
    '@media (max-width: 480px)': {
        display: `none`,
    },
});

const ShowMoreButton = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    gap: `5px`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        transform: `translateY(-2px)`,
    },
});

const ShowMoreText = styled("div")({
    textAlign: `center`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `12px`,
    letterSpacing: `0.56px`,
    lineHeight: `20px`,
    textTransform: `none`,
});

const ShowMoreArrow = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontSize: `16px`,
    fontWeight: `bold`,
    transform: `rotate(90deg)`,
});

// Category data
const categoryData = {
    birds: {
        title: 'BIRDS',
        image: AnimalBirdsImage,
        viewers: '330 viewers',
        followers: '12k Followers',
        tags: ['#BirdsOnABranch', '#StreamFlying']
    },
    mammals: {
        title: 'MAMMALS',
        image: AnimalMammalImage,
        viewers: '20K viewers',
        followers: '15k Followers',
        tags: ['#TigersOnHunt', '#Fierce']
    },
    mammals2: {
        title: 'MAMMALS',
        image: AnimalMammalsImage,
        viewers: '203 viewers',
        followers: '8k Followers',
        tags: ['#MammalsOfIndia', '#CaringCreature']
    },
    plants: {
        title: 'PLANTS AND BOTANY',
        image: PlantsAndBotanyImage,
        viewers: '5K viewers',
        followers: '9k Followers',
        tags: ['#PlantsOfBharat', '#Patterns']
    }
};

function CategoryProfilePage() {
    const { category } = useParams();
    const [currentTVIndex, setCurrentTVIndex] = useState(1);
    const tvImages = [Live1Image, Live2Image, Live3Image];

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTVIndex((prev) => (prev + 1) % tvImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [tvImages.length]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    const categoryInfo = categoryData[category] || categoryData.birds;

    return (
        <ProfileContainer>
            {/* Header */}
            <Header />

            {/* Profile Section */}
            <ProfileSection>
                <ProfileContent>
                    <ProfileImage src={categoryInfo.image} alt={categoryInfo.title} />
                    <ProfileInfo>
                        <ProfileTitle>{categoryInfo.title}</ProfileTitle>
                        <ProfileStats>
                            <ProfileStat>{categoryInfo.viewers}</ProfileStat>
                            <StatDot />
                            <ProfileStat>{categoryInfo.followers}</ProfileStat>
                        </ProfileStats>
                        <ProfileTags>
                            {categoryInfo.tags.map((tag, index) => (
                                <ProfileTag key={index}>{tag}</ProfileTag>
                            ))}
                        </ProfileTags>
                        <FollowButton customStyle={true}>Follow</FollowButton>
                    </ProfileInfo>
                </ProfileContent>
            </ProfileSection>

            {/* Live on Junglore Section */}
            <LiveSection>
                <LiveTitle>LIVE ON JUNGLORE</LiveTitle>
                <LiveCardsContainer>
                    <LiveCard>
                        <LiveVideo>
                            <LiveVideoImage src={Live1Image} alt="Wildlife Live Stream 1" />
                            <LiveBadge>LIVE</LiveBadge>
                            <ViewerCount>238 viewers</ViewerCount>
                        </LiveVideo>
                        <LiveInfo>
                            <LiveVideoTitle>Inside India's Wildlife Corridors</LiveVideoTitle>
                            <LiveChannel>NatureScope</LiveChannel>
                            <LiveCategory>Conservation</LiveCategory>
                        </LiveInfo>
                        <LiveTags>
                            <LiveTag>#HabitatProtection</LiveTag>
                            <LiveTag>#EcoPolicy</LiveTag>
                        </LiveTags>
                        <LiveAvatar src={PodcastAvatar} alt="Channel Avatar" />
                    </LiveCard>

                    <LiveCard>
                        <LiveVideo>
                            <LiveVideoImage src={Live2Image} alt="Wildlife Live Stream 2" />
                            <LiveBadge>LIVE</LiveBadge>
                            <ViewerCount>342 viewers</ViewerCount>
                        </LiveVideo>
                        <LiveInfo>
                            <LiveVideoTitle>Safari Adventure Chronicles</LiveVideoTitle>
                            <LiveChannel>WildScope</LiveChannel>
                            <LiveCategory>Adventure</LiveCategory>
                        </LiveInfo>
                        <LiveTags>
                            <LiveTag>#SafariLife</LiveTag>
                            <LiveTag>#Wildlife</LiveTag>
                        </LiveTags>
                        <LiveAvatar src={PodcastAvatar} alt="Channel Avatar" />
                    </LiveCard>

                    <LiveCard>
                        <LiveVideo>
                            <LiveVideoImage src={Live3Image} alt="Wildlife Live Stream 3" />
                            <LiveBadge>LIVE</LiveBadge>
                            <ViewerCount>156 viewers</ViewerCount>
                        </LiveVideo>
                        <LiveInfo>
                            <LiveVideoTitle>Predator Behavior Study</LiveVideoTitle>
                            <LiveChannel>WildResearch</LiveChannel>
                            <LiveCategory>Research</LiveCategory>
                        </LiveInfo>
                        <LiveTags>
                            <LiveTag>#Research</LiveTag>
                            <LiveTag>#Predators</LiveTag>
                        </LiveTags>
                        <LiveAvatar src={PodcastAvatar} alt="Channel Avatar" />
                    </LiveCard>
                </LiveCardsContainer>

                <ShowMoreContainer>
                    <ShowMoreLine />
                    <ShowMoreButton>
                        <ShowMoreText>SHOW MORE</ShowMoreText>
                        <ShowMoreArrow>›</ShowMoreArrow>
                    </ShowMoreButton>
                    <ShowMoreLine />
                </ShowMoreContainer>
            </LiveSection>

            {/* Footer */}
            <Footer />
        </ProfileContainer>
    );
}

export default CategoryProfilePage; 