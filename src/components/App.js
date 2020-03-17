import React, { useState } from 'react';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

export default function() {
    const [player, setPlayer] = useState(null);
    const [subtitles, setSubtitles] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

    const [options, setOptions] = useState({
        videoUrl: '/sample.mp4',
        subtitleUrl: '/sample.vtt',
        uploadDialog: false,
        downloadDialog: false,
        audioWaveform: false,
    });

    const setOption = (key, value) => {
        setOptions({
            ...options,
            [key]: value,
        });
    };

    const props = {
        player,
        options,
        subtitles,
        setPlayer,
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
