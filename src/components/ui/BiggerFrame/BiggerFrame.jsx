import React from 'react';
import { styled } from '@mui/material/styles';

const BiggerFrameContainer = styled("div")({
    display: `flex`,
    position: `relative`,
    isolation: `isolate`,
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: `20px`,
    boxSizing: `border-box`,
    width: `100%`,
    height: `100%`,
});

const FrameContent = styled("div")({
    textAlign: `center`,
    whiteSpace: `pre-wrap`,
    fontSynthesis: `none`,
    color: `rgba(255, 232, 161, 1)`,
    fontStyle: `normal`,
    fontFamily: `DM Sans`,
    fontWeight: `700`,
    fontSize: `24px`,
    letterSpacing: `0.5618497729301453px`,
    textDecoration: `none`,
    lineHeight: `30px`,
    textTransform: `none`,
});

const BiggerFrame = ({ children, ...props }) => {
    return (
        <BiggerFrameContainer {...props}>
            <FrameContent>
                {children}
            </FrameContent>
        </BiggerFrameContainer>
    );
};

export default BiggerFrame; 