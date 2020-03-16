import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
        line-height: 1.5;
        height: 100%;
        overflow: hidden;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #ccc;
        background: #1f2133;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #666;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
    }
`;

export default function() {
    const [subtitles, setSubtitles] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [options, setOptions] = useState({
        videoUrl: '/sample.mp4',
        subtitleUrl: '/sample.vtt',
        audioWaveform: false,
    });

    const setOption = (key, value) => {
        setOptions({
            ...options,
            [key]: value,
        });
    };

    const props = {
        options,
        subtitles,
        setOption,
        setOptions,
        currentTime,
        setSubtitles,
        setCurrentTime,
    };

    return (
        <React.Fragment>
            <GlobalStyle />
            <Header {...props} />
            <Main {...props} />
            <Footer {...props} />
        </React.Fragment>
    );
}
