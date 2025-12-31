// import React, { useState } from 'react';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import FaunaBotImage from '../../assets/images/faunabot.png';

// // FaunaBot Chat Interface - Organic Design
// const ChatbotPopup1 = styled("div")({
//     position: `absolute`,
//     bottom: `20px`,
//     right: `30px`,
//     width: `380px`,
//     height: `220px`,
//     zIndex: 10,
//     transform: `translateY(100px)`,
//     opacity: 0,
//     cursor: `pointer`,
//     animation: `slideInBounce 1s ease-out 2s forwards`,
//     transition: `all 0.3s ease`,
//     '&:hover': {
//         transform: `scale(1.02)`,
//         boxShadow: `0 20px 50px rgba(0, 0, 0, 0.3)`,
//     },
//     '@keyframes slideInBounce': {
//         '0%': {
//             transform: `translateY(100px)`,
//             opacity: 0,
//         },
//         '60%': {
//             transform: `translateY(-8px)`,
//             opacity: 1,
//         },
//         '80%': {
//             transform: `translateY(3px)`,
//         },
//         '100%': {
//             transform: `translateY(0px)`,
//             opacity: 1,
//         },
//     },
//     '@media (max-width: 1200px)': {
//         width: `320px`,
//         height: `180px`,
//         right: `25px`,
//         bottom: `15px`,
//     },
//     '@media (max-width: 768px)': {
//         width: `280px`,
//         height: `160px`,
//         right: `20px`,
//         bottom: `10px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `250px`,
//         height: `140px`,
//         right: `10px`,
//         bottom: `5px`,
//     },
// });

// const FaunaBotBackground = styled("div")({
//     position: `absolute`,
//     top: 0,
//     left: 0,
//     width: `100%`,
//     height: `100%`,
//     background: `linear-gradient(135deg, rgba(109, 151, 95, 1) 0%, rgba(138, 171, 130, 1) 30%, rgba(255, 232, 161, 0.9) 100%)`,
//     borderRadius: `25px`,
//     boxShadow: `0 15px 40px rgba(0, 0, 0, 0.2)`,
//     overflow: `hidden`,
//     '&::before': {
//         content: '""',
//         position: `absolute`,
//         top: `60%`,
//         left: `-10%`,
//         width: `120%`,
//         height: `60%`,
//         background: `linear-gradient(to bottom, rgba(255, 232, 161, 0.95) 0%, rgba(255, 232, 161, 1) 100%)`,
//         borderRadius: `50% 50% 0 0`,
//         transform: `rotate(-3deg)`,
//     },
// });

// const Robot2 = styled("img")({
//     position: `absolute`,
//     left: `20px`,
//     top: `15px`,
//     width: `60px`,
//     height: `60px`,
//     borderRadius: `50%`,
//     border: `3px solid rgba(255, 255, 255, 0.9)`,
//     boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15)`,
//     zIndex: 2,
//     animation: `robotFloat 3s ease-in-out infinite`,
//     '@keyframes robotFloat': {
//         '0%, 100%': {
//             transform: `translateY(0px) scale(1)`,
//         },
//         '50%': {
//             transform: `translateY(-4px) scale(1.02)`,
//         },
//     },
//     '@media (max-width: 1200px)': {
//         width: `50px`,
//         height: `50px`,
//         left: `15px`,
//         top: `12px`,
//     },
//     '@media (max-width: 768px)': {
//         width: `45px`,
//         height: `45px`,
//         left: `12px`,
//         top: `10px`,
//     },
//     '@media (max-width: 480px)': {
//         width: `40px`,
//         height: `40px`,
//         left: `10px`,
//         top: `8px`,
//     },
// });

// const ChatWithFaunabot = styled("div")({
//     position: `absolute`,
//     left: `95px`,
//     top: `25px`,
//     color: `rgba(255, 255, 255, 1)`,
//     fontFamily: `"DM Sans", Helvetica`,
//     fontWeight: `700`,
//     fontSize: `16px`,
//     letterSpacing: `1px`,
//     textTransform: `uppercase`,
//     textShadow: `0 2px 8px rgba(0, 0, 0, 0.3)`,
//     zIndex: 2,
//     animation: `fadeInGlow 1s ease-out 2.5s forwards`,
//     opacity: 0,
//     '@keyframes fadeInGlow': {
//         'to': {
//             opacity: 1,
//             textShadow: `0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.3)`,
//         },
//     },
//     '@media (max-width: 1200px)': {
//         left: `80px`,
//         top: `20px`,
//         fontSize: `14px`,
//         letterSpacing: `0.8px`,
//     },
//     '@media (max-width: 768px)': {
//         left: `70px`,
//         top: `18px`,
//         fontSize: `12px`,
//         letterSpacing: `0.6px`,
//     },
//     '@media (max-width: 480px)': {
//         left: `60px`,
//         top: `15px`,
//         fontSize: `10px`,
//         letterSpacing: `0.4px`,
//     },
// });

// const MessageInput = styled("div")({
//     position: `absolute`,
//     bottom: `20px`,
//     left: `20px`,
//     right: `20px`,
//     height: `45px`,
//     backgroundColor: `rgba(255, 255, 255, 0.95)`,
//     borderRadius: `22px`,
//     border: `1px solid rgba(138, 171, 130, 0.3)`,
//     display: `flex`,
//     alignItems: `center`,
//     padding: `0 20px`,
//     boxShadow: `0 4px 15px rgba(0, 0, 0, 0.1)`,
//     zIndex: 2,
//     transition: `all 0.3s ease`,
//     cursor: `pointer`,
//     '&:hover': {
//         backgroundColor: `rgba(255, 255, 255, 1)`,
//         borderColor: `rgba(138, 171, 130, 0.6)`,
//         boxShadow: `0 6px 20px rgba(0, 0, 0, 0.15)`,
//         transform: `translateY(-2px)`,
//     },
//     '@media (max-width: 1200px)': {
//         height: `40px`,
//         padding: `0 15px`,
//         bottom: `15px`,
//         left: `15px`,
//         right: `15px`,
//     },
//     '@media (max-width: 768px)': {
//         height: `35px`,
//         padding: `0 12px`,
//         bottom: `12px`,
//         left: `12px`,
//         right: `12px`,
//     },
//     '@media (max-width: 480px)': {
//         height: `30px`,
//         padding: `0 10px`,
//         bottom: `10px`,
//         left: `10px`,
//         right: `10px`,
//     },
// });

// const SendAMessage = styled("input")({
//     flex: 1,
//     border: `none`,
//     outline: `none`,
//     backgroundColor: `transparent`,
//     color: `rgba(68, 122, 101, 1)`,
//     fontFamily: `"DM Sans", Helvetica`,
//     fontWeight: `500`,
//     fontSize: `14px`,
//     letterSpacing: `0.3px`,
//     '&::placeholder': {
//         color: `rgba(68, 122, 101, 0.6)`,
//         fontWeight: `400`,
//     },
//     '&:focus': {
//         color: `rgba(68, 122, 101, 1)`,
//     },
//     '@media (max-width: 768px)': {
//         fontSize: `12px`,
//         letterSpacing: `0.2px`,
//     },
//     '@media (max-width: 480px)': {
//         fontSize: `10px`,
//         letterSpacing: `0.1px`,
//     },
// });

// const SendButton = styled("div")(({ hasMessage }) => ({
//     width: `24px`,
//     height: `24px`,
//     backgroundColor: hasMessage ? `rgba(109, 151, 95, 1)` : `rgba(109, 151, 95, 0.7)`,
//     borderRadius: `50%`,
//     display: `flex`,
//     alignItems: `center`,
//     justifyContent: `center`,
//     cursor: hasMessage ? `pointer` : `default`,
//     transition: `all 0.3s ease`,
//     position: `relative`,
//     transform: hasMessage ? `scale(1)` : `scale(0.9)`,
//     '&::after': {
//         content: '""',
//         width: `0`,
//         height: `0`,
//         borderLeft: `6px solid rgba(255, 255, 255, 1)`,
//         borderTop: `4px solid transparent`,
//         borderBottom: `4px solid transparent`,
//         marginLeft: `2px`,
//         opacity: hasMessage ? 1 : 0.7,
//     },
//     '&:hover': {
//         backgroundColor: hasMessage ? `rgba(138, 171, 130, 1)` : `rgba(109, 151, 95, 0.8)`,
//         transform: hasMessage ? `scale(1.1) rotate(15deg)` : `scale(0.95)`,
//         boxShadow: hasMessage ? `0 4px 12px rgba(109, 151, 95, 0.4)` : `none`,
//     },
//     '&:active': {
//         transform: hasMessage ? `scale(1.05) rotate(10deg)` : `scale(0.85)`,
//     },
// }));

// function FaunaBot() {
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     const handleFaunaBotClick = () => {
//         navigate('/chatbot');
//     };

//     const handleSendMessage = (e) => {
//         e.stopPropagation(); // Prevent triggering the main click handler
//         if (message.trim()) {
//             console.log('Sending message:', message);
//             // Here you would typically send the message to your chatbot API
//             setMessage('');
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSendMessage(e);
//         }
//     };

//     const handleInputClick = (e) => {
//         e.stopPropagation(); // Prevent triggering the main click handler
//     };

//     return (
//         <ChatbotPopup1 onClick={handleFaunaBotClick}>
//             <FaunaBotBackground />
//             <Robot2 src={FaunaBotImage} alt="FaunaBot Robot" />
//             <ChatWithFaunabot>
//                 CHAT WITH FAUNABOT
//             </ChatWithFaunabot>
//             <MessageInput onClick={handleInputClick}>
//                 <SendAMessage
//                     type="text"
//                     placeholder="Send a message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     onClick={handleInputClick}
//                 />
//                 <SendButton hasMessage={message.trim().length > 0} onClick={handleSendMessage} />
//             </MessageInput>
//         </ChatbotPopup1>
//     );
// }

// export default FaunaBot; 




import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import FaunaBotImage from '../../assets/images/faunabot.png';

// Floating Chat Button Container
const FloatingChatContainer = styled("div")({
    position: `fixed`,
    bottom: `30px`,
    right: `30px`,
    zIndex: 1000,
    '@media (max-width: 768px)': {
        bottom: `20px`,
        right: `20px`,
    },
    '@media (max-width: 480px)': {
        bottom: `15px`,
        right: `15px`,
    },
});

// Floating Chat Button (Collapsed State)
const FloatingChatButton = styled("div")(({ isExpanded }) => ({
    width: `60px`,
    height: `60px`,
    backgroundColor: `rgba(109, 151, 95, 1)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
    transition: `all 0.3s ease`,
    transform: isExpanded ? `scale(0.9)` : `scale(1)`,
    opacity: isExpanded ? 0 : 1,
    visibility: isExpanded ? 'hidden' : 'visible',
    animation: `floatAnimation 3s ease-in-out infinite`,
    '&:hover': {
        backgroundColor: `rgba(138, 171, 130, 1)`,
        transform: `scale(1.1)`,
        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.3)`,
    },
    '&:active': {
        transform: `scale(1.05)`,
    },
    '@keyframes floatAnimation': {
        '0%, 100%': {
            transform: `translateY(0px)`,
        },
        '50%': {
            transform: `translateY(-8px)`,
        },
    },
    '@media (max-width: 768px)': {
        width: `55px`,
        height: `55px`,
    },
    '@media (max-width: 480px)': {
        width: `50px`,
        height: `50px`,
    },
}));

const FloatingBotImage = styled("img")({
    width: `35px`,
    height: `35px`,
    borderRadius: `50%`,
    border: `2px solid rgba(255, 255, 255, 0.9)`,
    '@media (max-width: 768px)': {
        width: `30px`,
        height: `30px`,
    },
    '@media (max-width: 480px)': {
        width: `28px`,
        height: `28px`,
    },
});

// Expanded Chat Interface
const ChatInterface = styled("div")(({ isExpanded }) => ({
    position: `absolute`,
    bottom: `0px`,
    right: `0px`,
    width: `380px`,
    height: `480px`,
    backgroundColor: `rgba(255, 255, 255, 1)`,
    borderRadius: `20px`,
    boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3)`,
    overflow: `hidden`,
    transform: isExpanded ? `scale(1) translateY(0)` : `scale(0.8) translateY(50px)`,
    opacity: isExpanded ? 1 : 0,
    visibility: isExpanded ? 'visible' : 'hidden',
    transition: `all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
    transformOrigin: `bottom right`,
    '@media (max-width: 768px)': {
        width: `320px`,
        height: `420px`,
    },
    '@media (max-width: 480px)': {
        width: `calc(100vw - 30px)`,
        height: `400px`,
        right: `-15px`,
        bottom: `-15px`,
        borderRadius: `15px`,
    },
}));

// Chat Header
const ChatHeader = styled("div")({
    background: `linear-gradient(135deg, rgba(109, 151, 95, 1) 0%, rgba(138, 171, 130, 1) 100%)`,
    padding: `20px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    position: `relative`,
    '&::before': {
        content: '""',
        position: `absolute`,
        bottom: `0`,
        left: `0`,
        right: `0`,
        height: `2px`,
        background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
    },
});

const ChatHeaderContent = styled("div")({
    display: `flex`,
    alignItems: `center`,
    gap: `12px`,
});

const ChatBotImage = styled("img")({
    width: `45px`,
    height: `45px`,
    borderRadius: `50%`,
    border: `3px solid rgba(255, 255, 255, 0.9)`,
    animation: `robotFloat 3s ease-in-out infinite`,
    '@keyframes robotFloat': {
        '0%, 100%': {
            transform: `translateY(0px)`,
        },
        '50%': {
            transform: `translateY(-3px)`,
        },
    },
});

const ChatTitle = styled("div")({
    color: `rgba(255, 255, 255, 1)`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `700`,
    fontSize: `16px`,
    letterSpacing: `0.5px`,
    textTransform: `uppercase`,
});

const CloseButton = styled("div")({
    width: `30px`,
    height: `30px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(255, 255, 255, 0.2)`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    position: `relative`,
    '&:hover': {
        backgroundColor: `rgba(255, 255, 255, 0.3)`,
        transform: `rotate(90deg)`,
    },
    '&::before, &::after': {
        content: '""',
        position: `absolute`,
        width: `14px`,
        height: `2px`,
        backgroundColor: `white`,
        borderRadius: `1px`,
    },
    '&::before': {
        transform: `rotate(45deg)`,
    },
    '&::after': {
        transform: `rotate(-45deg)`,
    },
});

// Chat Body
const ChatBody = styled("div")({
    height: `calc(100% - 160px)`, // Increased from 140px to 160px
    padding: `20px`,
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    backgroundColor: `rgba(249, 251, 248, 1)`,
    textAlign: `center`,
});

const WelcomeMessage = styled("div")({
    color: `rgba(68, 122, 101, 1)`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `500`,
    fontSize: `16px`,
    lineHeight: `24px`,
    marginBottom: `20px`,
    '@media (max-width: 480px)': {
        fontSize: `14px`,
        lineHeight: `20px`,
    },
});

const ChatToPageButton = styled("div")({
    backgroundColor: `rgba(109, 151, 95, 1)`,
    color: `white`,
    padding: `12px 24px`,
    borderRadius: `25px`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `600`,
    fontSize: `14px`,
    letterSpacing: `0.5px`,
    textTransform: `uppercase`,
    cursor: `pointer`,
    transition: `all 0.3s ease`,
    '&:hover': {
        backgroundColor: `rgba(138, 171, 130, 1)`,
        transform: `translateY(-2px)`,
        boxShadow: `0 8px 20px rgba(109, 151, 95, 0.3)`,
    },
    '&:active': {
        transform: `translateY(0px)`,
    },
});

// Chat Input Area
const ChatInputArea = styled("div")({
    padding: `15px 20px 20px 20px`, // Reduced top padding from 20px to 15px
    borderTop: `1px solid rgba(68, 122, 101, 0.1)`,
    backgroundColor: `white`,
});

const MessageInput = styled("div")({
    height: `45px`,
    backgroundColor: `rgba(249, 251, 248, 1)`,
    borderRadius: `22px`,
    border: `1px solid rgba(138, 171, 130, 0.3)`,
    display: `flex`,
    alignItems: `center`,
    padding: `0 20px`,
    transition: `all 0.3s ease`,
    '&:hover': {
        borderColor: `rgba(138, 171, 130, 0.6)`,
    },
    '&:focus-within': {
        borderColor: `rgba(109, 151, 95, 1)`,
        backgroundColor: `white`,
        boxShadow: `0 0 0 3px rgba(109, 151, 95, 0.1)`,
    },
});

const SendAMessage = styled("input")({
    flex: 1,
    border: `none`,
    outline: `none`,
    backgroundColor: `transparent`,
    color: `rgba(68, 122, 101, 1)`,
    fontFamily: `"DM Sans", Helvetica`,
    fontWeight: `500`,
    fontSize: `14px`,
    letterSpacing: `0.3px`,
    '&::placeholder': {
        color: `rgba(68, 122, 101, 0.6)`,
        fontWeight: `400`,
    },
});

const SendButton = styled("div")(({ hasMessage }) => ({
    width: `28px`,
    height: `28px`,
    backgroundColor: hasMessage ? `rgba(109, 151, 95, 1)` : `rgba(109, 151, 95, 0.7)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    cursor: hasMessage ? `pointer` : `default`,
    transition: `all 0.3s ease`,
    transform: hasMessage ? `scale(1)` : `scale(0.9)`,
    '&::after': {
        content: '""',
        width: `0`,
        height: `0`,
        borderLeft: `6px solid rgba(255, 255, 255, 1)`,
        borderTop: `4px solid transparent`,
        borderBottom: `4px solid transparent`,
        marginLeft: `2px`,
        opacity: hasMessage ? 1 : 0.7,
    },
    '&:hover': {
        backgroundColor: hasMessage ? `rgba(138, 171, 130, 1)` : `rgba(109, 151, 95, 0.8)`,
        transform: hasMessage ? `scale(1.1)` : `scale(0.95)`,
    },
}));

// Notification Badge (optional - for new messages)
const NotificationBadge = styled("div")({
    position: `absolute`,
    top: `-5px`,
    right: `-5px`,
    width: `20px`,
    height: `20px`,
    backgroundColor: `rgba(220, 53, 69, 1)`,
    borderRadius: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    color: `white`,
    fontSize: `12px`,
    fontWeight: `600`,
    animation: `pulse 2s infinite`,
    '@keyframes pulse': {
        '0%': {
            transform: `scale(1)`,
            opacity: 1,
        },
        '50%': {
            transform: `scale(1.1)`,
            opacity: 0.8,
        },
        '100%': {
            transform: `scale(1)`,
            opacity: 1,
        },
    },
});

function FaunaBot() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');
    const [hasNotification] = useState(true); // You can control this based on new messages
    const navigate = useNavigate();

    const toggleChat = () => {
        setIsExpanded(!isExpanded);
    };

    const handleChatbotPage = () => {
        navigate('/chatbot');
        setIsExpanded(false);
    };

    const handleSendMessage = (e) => {
        e.stopPropagation();
        if (message.trim()) {
            console.log('Sending message:', message);
            // Here you would typically send the message to your chatbot API
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    return (
        <FloatingChatContainer>
            {/* Floating Chat Button */}
            <FloatingChatButton isExpanded={isExpanded} onClick={toggleChat}>
                <FloatingBotImage src={FaunaBotImage} alt="FaunaBot" />
                {hasNotification && !isExpanded && (
                    <NotificationBadge>!</NotificationBadge>
                )}
            </FloatingChatButton>

            {/* Expanded Chat Interface */}
            <ChatInterface isExpanded={isExpanded}>
                {/* Chat Header */}
                <ChatHeader>
                    <ChatHeaderContent>
                        <ChatBotImage src={FaunaBotImage} alt="FaunaBot" />
                        <ChatTitle>Chat with FaunaBot</ChatTitle>
                    </ChatHeaderContent>
                    <CloseButton onClick={toggleChat} />
                </ChatHeader>

                {/* Chat Body */}
                <ChatBody>
                    <WelcomeMessage>
                        Hi there! 👋 I'm FaunaBot, your wildlife companion. 
                        I'm here to help you learn about animals, conservation, and nature!
                        <br /><br />
                        Click below to start a full conversation with me.
                    </WelcomeMessage>
                    <ChatToPageButton onClick={handleChatbotPage}>
                        Start Full Chat
                    </ChatToPageButton>
                </ChatBody>

                {/* Chat Input */}
                <ChatInputArea>
                    <MessageInput onClick={handleInputClick}>
                        <SendAMessage
                            type="text"
                            placeholder="Send a quick message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onClick={handleInputClick}
                        />
                        <SendButton hasMessage={message.trim().length > 0} onClick={handleSendMessage} />
                    </MessageInput>
                </ChatInputArea>
            </ChatInterface>
        </FloatingChatContainer>
    );
}

export default FaunaBot; 