import React, { useState, useMemo, useCallback, useEffect } from 'react';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Sub from '../subtitle/sub';
import { secondToTime, notify } from '../utils';
import { getSubFromVttUrl, vttToUrlUseWorker } from '../subtitle';
import Storage from '../utils/storage';
import equal from 'fast-deep-equal';
import { ToastContainer } from 'react-toastify';

const storage = new Storage();
const worker = new Worker(vttToUrlUseWorker());

export default function() {
    // Player instance
    const [player, setPlayer] = useState(null);

    // Subtitle currently playing index
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Subtitle currently playing time
    const [currentTime, setCurrentTime] = useState(0);

    // All subtitles
    const [subtitles, setSubtitles] = useState([]);

    // All options
    const [options, setOptions] = useState({
        videoUrl: '/sample.mp4',
        subtitleUrl: '/sample.vtt',
        uploadDialog: false,
        useAudioWaveform: false,
    });

    // Update an option
    const setOption = useCallback(
        (key, value) => {
            setOptions({
                ...options,
                [key]: value,
            });
        },
        [options, setOptions],
    );

    // Only way to update all subtitles
    const updateSubtitles = useCallback(
        subs => {
            if (!equal(subs, subtitles)) {
                setSubtitles(subs);

                // Save to storage
                storage.set('subtitles', subs);

                // Convert subtitles to vtt url
                worker.postMessage(subs);
            }
        },
        [setSubtitles, subtitles],
    );

    // Initialize subtitles from url or storage
    const initSubtitles = useCallback(async () => {
        const storageSubtitles = storage.get('subtitles');
        if (storageSubtitles) {
            updateSubtitles(storageSubtitles.map(item => new Sub(item.start, item.end, item.text)));
        } else {
            const subs = await getSubFromVttUrl(options.subtitleUrl);
            updateSubtitles(subs);
        }
    }, [options.subtitleUrl, updateSubtitles]);

    // Run only once
    useEffect(() => {
        if (!initSubtitles.init) {
            initSubtitles.init = true;
            initSubtitles();
        }

        if (player && !player.init) {
            player.init = true;
            worker.onmessage = event => {
                player.subtitle.switch(event.data);
            };
        }
    }, [initSubtitles, player]);

    // Update current index from current time
    useMemo(() => {
        setCurrentIndex(
            subtitles.findIndex(item => {
                return item.startTime <= currentTime && item.endTime >= currentTime;
            }),
        );
    }, [subtitles, currentTime, setCurrentIndex]);

    // Detect if the subtitle exists
    const checkSub = useCallback(sub => subtitles.includes(sub), [subtitles]);

    // Check if subtitle is legal
    const checkSubtitleIllegal = useCallback(
        sub => {
            if (!checkSub(sub)) return;
            const index = subtitles.indexOf(sub);
            const previous = subtitles[index - 1];
            return (previous && sub.startTime < previous.endTime) || !sub.check;
        },
        [checkSub, subtitles],
    );

    // Update a single subtitle
    const updateSubtitle = useCallback(
        (sub, key, value) => {
            if (!checkSub(sub)) return;
            const index = subtitles.indexOf(sub);
            const subs = [...subtitles];
            const { clone } = sub;
            clone[key] = value;
            subs[index] = clone;
            updateSubtitles(subs);
        },
        [checkSub, subtitles, updateSubtitles],
    );

    // Delete a subtitle
    const removeSubtitle = useCallback(
        sub => {
            if (!checkSub(sub)) return;
            if (subtitles.length === 1) {
                return notify('Please keep at least one subtitle', 'error');
            }
            const index = subtitles.indexOf(sub);
            const subs = [...subtitles];
            subs.splice(index, 1);
            updateSubtitles(subs);
        },
        [checkSub, subtitles, updateSubtitles],
    );

    // Add a subtitle
    const addSubtitle = useCallback(
        index => {
            const subs = [...subtitles];
            const previous = subtitles[index - 1];
            const start = previous ? secondToTime(previous.endTime + 0.001) : '00:00:00.001';
            const end = previous ? secondToTime(previous.endTime + 1.001) : '00:00:01.001';
            const sub = new Sub(start, end, '[Subtitle Text]');
            subs.splice(index, 0, sub);
            updateSubtitles(subs);
            setCurrentIndex(index);
        },
        [subtitles, updateSubtitles],
    );

    // Merge two subtitles
    const mergeSubtitle = useCallback(
        sub => {
            if (!checkSub(sub)) return;
            const index = subtitles.indexOf(sub);
            const next = subtitles[index + 1];
            if (!checkSub(next)) return;
            const merge = new Sub(sub.start, next.end, sub.text + '\n' + next.text);
            const subs = [...subtitles];
            subs[index] = merge;
            subs.splice(index + 1, 1);
            updateSubtitles(subs);
        },
        [checkSub, subtitles, updateSubtitles],
    );

    // Remove all subtitles
    const removeSubtitles = useCallback(() => {
        updateSubtitles([new Sub('00:00:00.000', '00:00:01.000', '[Subtitle Text]')]);
    }, [updateSubtitles]);

    const props = {
        player,
        options,
        subtitles,
        setPlayer,
        setOptions,
        currentIndex,
        currentTime,
        setCurrentIndex,
        setCurrentTime,
        updateSubtitles,
        checkSub,
        setOption,
        addSubtitle,
        mergeSubtitle,
        removeSubtitle,
        removeSubtitles,
        updateSubtitle,
        checkSubtitleIllegal,
    };

    return (
        <React.Fragment>
            <GlobalStyle />
            <Header {...props} />
            <Main {...props} />
            <Footer {...props} />
            <ToastContainer />
        </React.Fragment>
    );
}
