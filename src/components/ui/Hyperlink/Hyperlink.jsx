import React from 'react';
import { styled } from '@mui/material/styles';

const HyperlinkContainer = styled("div")({
    display: `flex`,
    position: `relative`,
    isolation: `isolate`,
    flexDirection: `row`,
    justifyContent: `flex-start`,
    alignItems: `center`,
    padding: `0px`,
    boxSizing: `border-box`,
});

const ClickToExplore = styled("div")({
    textAlign: `left`,
    whiteSpace: `pre-wrap`,
    fontSynthesis: `none`,
    color: `rgba(255, 232, 161, 1)`,
    fontStyle: `italic`,
    fontFamily: `DM Sans`,
    fontWeight: `900`,
    fontSize: `16px`,
    letterSpacing: `0.5618497729301453px`,
    textDecoration: `none`,
    lineHeight: `20px`,
    textTransform: `none`,
    cursor: `pointer`,
    marginRight: `8px`,
});

const Dot = styled("div")({
    width: `8px`,
    height: `8px`,
    borderRadius: `50%`,
    backgroundColor: `rgba(255, 232, 161, 1)`,
});

const Hyperlink = ({ children, ...props }) => {
    return (
        <HyperlinkContainer {...props}>
            <ClickToExplore>
                {`CLICK TO EXPLORE`}
            </ClickToExplore>
            <Dot />
        </HyperlinkContainer>
    );
};

export default Hyperlink; 