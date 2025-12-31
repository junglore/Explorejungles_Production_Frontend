import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';

// Import images
import LivestreamGif from '../../assets/images/community/livestream.gif';
import PodcastAvatar from '../../assets/images/media/podcastcarousal_1.png';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import FollowButton from '../../components/ui/FollowButton';

const LivestreamContainer = styled("div")({
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
});

const MainContent = styled("div")({
    display: `flex`,
    flexDirection: `row`,
    width: `100%`,
    maxWidth: `1440px`,
    margin: `0 auto`,
    padding: `120px 40px 40px`,
    gap: `20px`,
    boxSizing: `border-box`,
    '@media (max-width: 1024px)': {
        flexDirection: `column`,
        padding: `100px 20px 40px`,
    },
});

const VideoSection = styled("div")({
    flex: `1`,
    maxWidth: `876px`,
    display: `flex`,
    flexDirection: `column`,
    gap: `20px`,
});

const VideoPlayer = styled("div")({
    position: `relative`,
    width: `100%`,
    height: `620px`,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    borderRadius: `12px`,
    overflow: `hidden`,
    '@media (max-width: 768px)': {
        height: `400px`,
    },
    '@media (max-width: 480px)': {
        height: `300px`,
    },
});

const LiveVideo = styled("img")({
    width: `100%`,
    height: `100%`,
    objectFit: `cover`,
});

const VideoControls = styled("div")({
    position: `absolute`,
    bottom: `20px`,
    left: `20px`,
    right: `20px`,
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    background: `rgba(0, 0, 0, 0.6)`,
    borderRadius: `8px`,
    padding: `10px 15px`,
    backdropFilter: `blur(10px)`,
});

const PlayControls = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `15px`,
});

// ControlButton component removed - using reusable Button component instead

const VolumeControls = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `10px`,
    color: `rgba(255, 255, 255, 1)`,
});

const StreamInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `15px`,
    padding: `20px`,
    backgroundColor: `rgba(23, 31, 28, 0.6)`,
    borderRadius: `12px`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
});

const StreamHeader = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `15px`,
});

const ChannelAvatar = styled("img")({
    width: `60px`,
    height: `60px`,
    borderRadius: `50%`,
    objectFit: `cover`,
    border: `2px solid rgba(255, 232, 161, 0.3)`,
});

const LiveBadge = styled("div")({
    backgroundColor: `rgba(241, 63, 63, 1)`,
    borderRadius: `4px`,
    padding: `4px 8px`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `12px`,
    textTransform: `uppercase`,
    position: `absolute`,
    top: `20px`,
    left: `20px`,
    zIndex: 2,
});

const ChannelInfo = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `5px`,
    flex: 1,
});

const ChannelName = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `24px`,
    letterSpacing: `0px`,
});

const StreamCategory = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `16px`,
    opacity: 0.8,
});

const ViewerCount = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    opacity: 0.8,
});



const StreamTags = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `8px`,
});

const StreamTag = styled("div")({
    backgroundColor: `rgba(68, 122, 101, 1)`,
    borderRadius: `20px`,
    padding: `6px 12px`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    whiteSpace: `nowrap`,
});

const ChatSection = styled("div")({
    width: `350px`,
    minWidth: `300px`,
    height: `620px`, // Match the video player height
    display: `flex`,
    flexDirection: `column`,
    backgroundColor: `rgba(23, 31, 28, 1)`,
    borderRadius: `12px`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    overflow: `hidden`,
    '@media (max-width: 1024px)': {
        width: `100%`,
        minWidth: `unset`,
        height: `400px`, // Match mobile video height
    },
    '@media (max-width: 768px)': {
        height: `400px`,
    },
    '@media (max-width: 480px)': {
        height: `300px`, // Match small mobile video height
    },
});

const ChatHeader = styled("div")({
    padding: `20px`,
    borderBottom: `1px solid rgba(68, 122, 101, 0.3)`,
    display: `flex`,
    alignItems: `center`,
    gap: `10px`,
});

const ChatIcon = styled("div")({
    width: `16px`,
    height: `16px`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
    borderRadius: `2px`,
});

const ChatTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    flex: 1,
    textAlign: `center`,
});

const ChatMessages = styled("div")({
    flex: 1,
    padding: `20px`,
    display: `flex`,
    flexDirection: `column`,
    gap: `15px`,
    overflowY: `auto`,
    maxHeight: `calc(620px - 120px)`, // Total height minus header and input sections
    '@media (max-width: 1024px)': {
        maxHeight: `calc(400px - 120px)`,
    },
    '@media (max-width: 768px)': {
        maxHeight: `calc(400px - 120px)`,
    },
    '@media (max-width: 480px)': {
        maxHeight: `calc(300px - 120px)`,
    },
});

const ChatMessage = styled("div")({
    display: `flex`,
    flexDirection: `column`,
    gap: `5px`,
});

const MessageAuthor = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `600`,
    fontSize: `12px`,
});

const MessageText = styled("div")({
    color: `rgba(255, 232, 161, 0.9)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `12px`,
    lineHeight: `1.4`,
});

const ChatInput = styled("div")({
    padding: `20px`,
    borderTop: `1px solid rgba(68, 122, 101, 0.3)`,
    display: `flex`,
    gap: `10px`,
    alignItems: `center`,
});

const MessageInput = styled("input")({
    flex: 1,
    backgroundColor: `transparent`,
    border: `1px solid rgba(68, 122, 101, 0.5)`,
    borderRadius: `6px`,
    padding: `12px`,
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `DM Sans`,
    fontSize: `12px`,
    '&::placeholder': {
        color: `rgba(255, 255, 255, 0.5)`,
    },
    '&:focus': {
        outline: `none`,
        borderColor: `rgba(68, 122, 101, 1)`,
    },
});

// SendButton component removed - using reusable Button component instead

const AboutSection = styled("div")({
    padding: `20px`,
    backgroundColor: `rgba(23, 31, 28, 0.6)`,
    borderRadius: `12px`,
    border: `1px solid rgba(68, 122, 101, 0.3)`,
    marginTop: `20px`,
});

const AboutTitle = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `20px`,
    marginBottom: `15px`,
});

const AboutText = styled("div")({
    color: `rgba(255, 232, 161, 0.9)`,
    fontFamily: `DM Sans`,
    fontWeight: `400`,
    fontSize: `14px`,
    lineHeight: `1.6`,
});

const FollowerCount = styled("div")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `16px`,
    marginTop: `15px`,
});

function LivestreamPage() {
    const { streamId } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [message, setMessage] = useState('');

    // Mock data based on stream ID
    const getStreamData = (id) => {
        const streams = {
            'tv1': {
                title: 'Inside India\'s Wildlife Corridors',
                channel: 'NATURESCOPE',
                category: 'CONSERVATION',
                viewers: '20K viewers',
                tags: ['#HabitatProtection', '#EcoPolicy'],
                followers: '3.1K Followers',
                description: 'Welcome to The Tracker, your audio compass through the wild world of knowledge. Powered by our ever-evolving knowledge engine, this podcast traces the footsteps of explorers, scientists, conservationists, and curious minds as they uncover hidden patterns in nature, wildlife, and human behavior.'
            },
            'tv2': {
                title: 'Safari Adventure Chronicles',
                channel: 'WILDSCOPE',
                category: 'ADVENTURE',
                viewers: '15K viewers',
                tags: ['#SafariLife', '#Wildlife'],
                followers: '2.8K Followers',
                description: 'Join us on epic safari adventures as we explore the untamed wilderness and document incredible wildlife encounters.'
            },
            'tv3': {
                title: 'Predator Behavior Study',
                channel: 'WILDRESEARCH',
                category: 'RESEARCH',
                viewers: '8K viewers',
                tags: ['#Research', '#Predators'],
                followers: '1.9K Followers',
                description: 'Scientific exploration of predator behavior patterns in their natural habitats.'
            }
        };
        return streams[id] || streams['tv1'];
    };

    const streamData = getStreamData(streamId);

    const mockMessages = [
        { author: 'NatureLover23', text: 'Amazing footage! Thanks for sharing this.' },
        { author: 'WildlifeWatcher', text: 'The audio quality is so crisp, feels like I\'m there!' },
        { author: 'ConservationistJoe', text: 'This is exactly the kind of content we need more of' },
        { author: 'SafariExplorer', text: 'Have you seen the new tiger cubs in Ranthambore?' },
        { author: 'EcoWarrior', text: 'What camera setup are you using for this stream?' },
    ];

    const handleSendMessage = () => {
        if (message.trim()) {
            // Handle sending message
            setMessage('');
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <LivestreamContainer>
            <Header />

            <MainContent>
                <VideoSection>
                    <VideoPlayer>
                        <LiveBadge>LIVE</LiveBadge>
                        <LiveVideo src={LivestreamGif} alt="Live Stream" />
                        <VideoControls>
                            <PlayControls>
                                <Button variant="ghost" size="small" onClick={togglePlay}>
                                    {isPlaying ? '⏸️' : '▶️'}
                                </Button>
                                <Button variant="ghost" size="small">⏮️</Button>
                                <Button variant="ghost" size="small">⏭️</Button>
                            </PlayControls>
                            <VolumeControls>
                                <Button variant="ghost" size="small">🔊</Button>
                                <Button variant="ghost" size="small">⚙️</Button>
                                <Button variant="ghost" size="small">⛶</Button>
                            </VolumeControls>
                        </VideoControls>
                    </VideoPlayer>

                    <StreamInfo>
                        <StreamHeader>
                            <ChannelAvatar src={PodcastAvatar} alt="Channel Avatar" />
                            <ChannelInfo>
                                <ChannelName>{streamData.channel}</ChannelName>
                                <StreamCategory>{streamData.category}</StreamCategory>
                                <ViewerCount>{streamData.viewers}</ViewerCount>
                            </ChannelInfo>
                            <FollowButton customStyle={true} />
                        </StreamHeader>

                        <StreamTags>
                            {streamData.tags.map((tag, index) => (
                                <StreamTag key={index}>{tag}</StreamTag>
                            ))}
                        </StreamTags>
                    </StreamInfo>

                    <AboutSection>
                        <AboutTitle>ABOUT {streamData.channel}</AboutTitle>
                        <FollowerCount>{streamData.followers}</FollowerCount>
                        <AboutText>{streamData.description}</AboutText>
                    </AboutSection>
                </VideoSection>

                <ChatSection>
                    <ChatHeader>
                        <ChatIcon />
                        <ChatTitle>STREAM CHAT</ChatTitle>
                    </ChatHeader>

                    <ChatMessages>
                        {mockMessages.map((msg, index) => (
                            <ChatMessage key={index}>
                                <MessageAuthor>{msg.author}</MessageAuthor>
                                <MessageText>{msg.text}</MessageText>
                            </ChatMessage>
                        ))}
                    </ChatMessages>

                    <ChatInput>
                        <Input
                            type="text"
                            placeholder="Send a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            variant="outlined"
                            size="medium"
                            fullWidth
                        />
                        <Button variant="primary" size="small" onClick={handleSendMessage}>
                            ➤
                        </Button>
                    </ChatInput>
                </ChatSection>
            </MainContent>

            <Footer />
        </LivestreamContainer>
    );
}

export default LivestreamPage; 