import React, { useState, useMemo } from 'react';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Sub from '../subtitle/sub';
import { secondToTime } from '../utils';
import { getSubFromVttUrl } from '../subtitle';

export default function() {
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [subtitles, setSubtitles] = useState([]);
    const [options, setOptions] = useState({
        videoUrl: '/sample.mp4',
        subtitleUrl: '/sample.vtt',
        uploadDialog: false,
        downloadDialog: false,
        audioWaveform: false,
        mainHeight: 100,
        mainWidth: 100,
    });

    useMemo(async () => {
        setSubtitles(await getSubFromVttUrl(options.subtitleUrl));
    }, [setSubtitles, options.subtitleUrl]);

    const setOption = (key, value) => {
        setOptions({
            ...options,
            [key]: value,
        });
    };

    const updateSubtitle = (sub, key, value) => {
        const index = subtitles.indexOf(sub);
        const subs = [...subtitles];
        const { clone } = sub;
        clone[key] = value;
        subs[index] = clone;
        setSubtitles(subs);
    };

    const removeSubtitle = sub => {
        const index = subtitles.indexOf(sub);
        const subs = [...subtitles];
        subs.splice(index, 1);
        setSubtitles(subs);
    };

    const addSubtitle = index => {
        const subs = [...subtitles];
        const previous = subtitles[index - 1];
        const start = previous ? secondToTime(previous.endTime + 0.001) : '00:00:00.001';
        const end = previous ? secondToTime(previous.endTime + 1.001) : '00:00:01.001';
        const sub = new Sub(start, end, '');
        subs.splice(index, 0, sub);
        setSubtitles(subs);
    };

    const props = {
        player,
        options,
        subtitles,
        setPlayer,
        setOption,
        setOptions,
        addSubtitle,
        currentTime,
        setSubtitles,
        removeSubtitle,
        setCurrentTime,
        updateSubtitle,
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
