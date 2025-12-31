import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import Header from '../components/common/Header.jsx';
import FaunaBotImage from '../assets/images/faunabot.png';

const ChatbotContainer = styled("div")({
    backgroundColor: `rgba(30, 45, 39, 1)`,
    width: `100vw`,
    height: `100vh`,
    display: `flex`,
    flexDirection: `column`,
    overflow: `hidden`,
});

const ChatArea = styled("div")({
    flex: 1,
    display: `flex`,
    flexDirection: `column`,
    marginTop: `120px`, // Account for header height
    padding: `40px 20px 20px 20px`,
    maxWidth: `1000px`,
    margin: `120px auto 0 auto`,
    width: `100%`,
    boxSizing: `border-box`,
});

const ChatHeader = styled("div")({
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    position: `relative`,
    padding: `20px 0`,
    borderBottom: `1px solid rgba(138, 171, 130, 0.3)`,
    marginBottom: `20px`,
});

const ChatTitle = styled("h1")({
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `700`,
    fontSize: `32px`,
    margin: `0`,
    textAlign: `center`,
});

const ChatMessages = styled("div")({
    flex: 1,
    overflowY: `auto`,
    padding: `30px 0`,
    display: `flex`,
    flexDirection: `column`,
    gap: `20px`,
    maxHeight: `calc(100vh - 400px)`,
    minHeight: `300px`,
    '&::-webkit-scrollbar': {
        width: `8px`,
    },
    '&::-webkit-scrollbar-track': {
        background: `rgba(138, 171, 130, 0.1)`,
        borderRadius: `4px`,
    },
    '&::-webkit-scrollbar-thumb': {
        background: `rgba(138, 171, 130, 0.5)`,
        borderRadius: `4px`,
    },
});

const MessageBubble = styled("div")(({ isBot }) => ({
    display: `flex`,
    alignItems: `flex-start`,
    gap: `12px`,
    flexDirection: isBot ? `row` : `row-reverse`,
    maxWidth: `80%`,
    alignSelf: isBot ? `flex-start` : `flex-end`,
}));

const Avatar = styled("div")(({ isBot }) => ({
    width: `40px`,
    height: `40px`,
    borderRadius: `50%`,
    background: isBot
        ? `linear-gradient(135deg, rgba(109, 151, 95, 1) 0%, rgba(138, 171, 130, 1) 100%)`
        : `rgba(255, 232, 161, 1)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexShrink: 0,
    backgroundImage: isBot ? `url(${FaunaBotImage})` : 'none',
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    border: `2px solid ${isBot ? 'rgba(255, 232, 161, 0.5)' : 'rgba(138, 171, 130, 0.5)'}`,
}));

const MessageContent = styled("div")(({ isBot }) => ({
    backgroundColor: isBot
        ? `rgba(138, 171, 130, 0.2)`
        : `rgba(255, 232, 161, 0.9)`,
    color: isBot ? `rgba(255, 232, 161, 1)` : `rgba(30, 45, 39, 1)`,
    padding: `12px 16px`,
    borderRadius: isBot ? `20px 20px 20px 5px` : `20px 20px 5px 20px`,
    fontFamily: `"DM Sans", Helvetica`,
    fontSize: `14px`,
    lineHeight: `1.4`,
    maxWidth: `100%`,
    wordWrap: `break-word`,
    border: `1px solid ${isBot ? 'rgba(138, 171, 130, 0.3)' : 'rgba(255, 232, 161, 0.5)'}`,
}));

const TypingIndicator = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
    maxWidth: `80%`,
    alignSelf: `flex-start`,
});

const TypingDots = styled("div")({
    backgroundColor: `rgba(138, 171, 130, 0.2)`,
    padding: `12px 16px`,
    borderRadius: `20px 20px 20px 5px`,
    border: `1px solid rgba(138, 171, 130, 0.3)`,
    '& span': {
        display: `inline-block`,
        width: `8px`,
        height: `8px`,
        borderRadius: `50%`,
        backgroundColor: `rgba(138, 171, 130, 1)`,
        margin: `0 2px`,
        animation: `typing 1.4s infinite ease-in-out`,
        '&:nth-child(1)': { animationDelay: `0s` },
        '&:nth-child(2)': { animationDelay: `0.2s` },
        '&:nth-child(3)': { animationDelay: `0.4s` },
    },
    '@keyframes typing': {
        '0%, 60%, 100%': { transform: `scale(0.8)`, opacity: 0.5 },
        '30%': { transform: `scale(1)`, opacity: 1 },
    },
});

const ChatInput = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `15px`,
    padding: `25px 0`,
    borderTop: `1px solid rgba(138, 171, 130, 0.3)`,
    marginTop: `auto`,
});

const InputContainer = styled("div")({
    flex: 1,
    position: `relative`,
    backgroundColor: `rgba(138, 171, 130, 0.1)`,
    border: `2px solid rgba(138, 171, 130, 0.3)`,
    borderRadius: `25px`,
    padding: `12px 60px 12px 20px`,
    transition: `all 0.3s ease`,
    '&:focus-within': {
        borderColor: `rgba(255, 232, 161, 0.8)`,
        backgroundColor: `rgba(138, 171, 130, 0.15)`,
    },
});

const MessageInput = styled("input")({
    width: `100%`,
    border: `none`,
    outline: `none`,
    background: `transparent`,
    color: `rgba(255, 232, 161, 1)`,
    fontFamily: `"DM Sans", Helvetica`,
    fontSize: `16px`,
    '&::placeholder': {
        color: `rgba(255, 232, 161, 0.6)`,
    },
});

// SendButton component removed - using reusable Button component instead

const SuggestionsContainer = styled("div")({
    display: `flex`,
    flexWrap: `wrap`,
    gap: `15px`,
    marginBottom: `30px`,
    justifyContent: `flex-start`,
});

// SuggestionButton component removed - using reusable Button component instead

// BackButton component removed - using reusable Button component instead

function ChatbotPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm FaunaBot, your wildlife companion. I can help you learn about animals, conservation, safaris, and answer any nature-related questions you have. What would you like to explore today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        "Tell me about African safari animals",
        "What's the best time for wildlife viewing?",
        "How can I help with conservation?"
    ];

    const botResponses = {
        "african": "African safaris offer incredible wildlife diversity! You can see the Big Five (lion, leopard, elephant, buffalo, rhino), plus zebras, giraffes, cheetahs, and hundreds of bird species. Each region has unique animals - East Africa for the Great Migration, Southern Africa for diverse ecosystems.",
        "safari": "The best wildlife viewing times are early morning (6-10 AM) and late afternoon (4-7 PM) when animals are most active. Dry seasons offer better visibility as animals gather around water sources. Each destination has optimal months - would you like specific timing for a particular region?",
        "conservation": "There are many ways to help! Support organizations like WWF or local conservancies, choose eco-friendly tourism, reduce plastic use, adopt sustainable practices, and spread awareness. Even small actions like choosing sustainable products make a difference for wildlife habitats!",
        "photography": "Great safari photography tips: Use fast shutter speeds (1/500s+), bring a telephoto lens (300mm+), shoot in early/late light, focus on the eyes, be patient, respect animal behavior, and always prioritize safety over the perfect shot!",
        "endangered": "Many species need our help - black rhinos, mountain gorillas, snow leopards, vaquita porpoises, and Sumatran orangutans. Climate change, habitat loss, and poaching are major threats. Conservation success stories like humpback whales show recovery is possible!",
        "default": "That's a fascinating question about wildlife! I'd love to help you learn more. Could you be more specific about what aspect of nature or wildlife you're most curious about? I have extensive knowledge about animals, habitats, conservation, and safari experiences."
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const generateBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('african') || lowerMessage.includes('safari') || lowerMessage.includes('big five')) {
            return botResponses.african;
        } else if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('season')) {
            return botResponses.safari;
        } else if (lowerMessage.includes('conservation') || lowerMessage.includes('help') || lowerMessage.includes('protect')) {
            return botResponses.conservation;
        } else if (lowerMessage.includes('photo') || lowerMessage.includes('camera') || lowerMessage.includes('picture')) {
            return botResponses.photography;
        } else if (lowerMessage.includes('endangered') || lowerMessage.includes('extinct') || lowerMessage.includes('rare')) {
            return botResponses.endangered;
        } else {
            return botResponses.default;
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: message.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        // Simulate bot thinking time
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: generateBotResponse(message.trim()),
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion) => {
        setMessage(suggestion);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <ChatbotContainer>
            <Header />

            <ChatArea>
                <ChatHeader>
                    <Button 
                        variant="ghost" 
                        size="small" 
                        onClick={handleBack}
                        style={{ position: 'absolute', left: '0' }}
                    >
                        ←
                    </Button>
                    <ChatTitle>Chat with FaunaBot</ChatTitle>
                </ChatHeader>

                <ChatMessages>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} isBot={msg.isBot}>
                            <Avatar isBot={msg.isBot} />
                            <MessageContent isBot={msg.isBot}>
                                {msg.text}
                            </MessageContent>
                        </MessageBubble>
                    ))}

                    {isTyping && (
                        <TypingIndicator>
                            <Avatar isBot={true} />
                            <TypingDots>
                                <span></span>
                                <span></span>
                                <span></span>
                            </TypingDots>
                        </TypingIndicator>
                    )}
                    <div ref={messagesEndRef} />
                </ChatMessages>

                <SuggestionsContainer>
                    {suggestions.map((suggestion, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="small"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </Button>
                    ))}
                </SuggestionsContainer>

                <ChatInput>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder="Ask FaunaBot about wildlife, safaris, conservation..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            size="medium"
                            fullWidth
                        />
                        <Button
                            variant="primary"
                            size="small"
                            disabled={!message.trim()}
                            onClick={handleSendMessage}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                        >
                            →
                        </Button>
                    </InputContainer>
                </ChatInput>
            </ChatArea>
        </ChatbotContainer>
    );
}

export default ChatbotPage; 