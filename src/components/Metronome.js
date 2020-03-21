import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import Sub from '../subtitle/sub';
import { secondToTime, getKeyCode } from '../utils';
import { t } from 'react-i18nify';

const Metronome = styled.div`
    position: absolute;
    z-index: 8;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;

    .templet {
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        background-color: rgba(76, 175, 80, 0.5);
        border-left: 1px solid rgba(76, 175, 80, 0.8);
        border-right: 1px solid rgba(76, 175, 80, 0.8);
        user-select: none;
        pointer-events: none;
    }
`;

function findIndex(subs, startTime) {
    return subs.findIndex((item, index) => {
        return (
            (startTime >= item.endTime && !subs[index + 1]) ||
            (item.startTime <= startTime && item.endTime > startTime) ||
            (startTime >= item.endTime && subs[index + 1] && startTime < subs[index + 1].startTime)
        );
    });
}

let isDroging = false;
export default function({ render, metronome, currentTime, subtitles, addSubtitle, player, setMetronome }) {
    const [metronomeStartTime, setMetronomeStartTime] = useState(0);
    const [drogStartTime, setDrogStartTime] = useState(0);
    const [drogEndTime, setDrogEndTime] = useState(0);

    const gridGap = document.body.clientWidth / render.gridNum;
    const $metronomeRef = React.createRef();

    const onKeyDown = useCallback(
        event => {
            if (metronome) {
                const keyCode = getKeyCode(event);
                if (keyCode === 32) {
                    event.preventDefault();

                    if (!metronomeStartTime) {
                        setMetronomeStartTime(currentTime);
                    }

                    if (metronomeStartTime && metronome && currentTime - metronomeStartTime >= 0.2) {
                        const index = findIndex(subtitles, metronomeStartTime) + 1;
                        const start = secondToTime(metronomeStartTime);
                        const end = secondToTime(currentTime);
                        addSubtitle(index, new Sub(start, end, t('subtitle-text')));
                        setMetronomeStartTime(0);
                    }
                }
            }
        },
        [addSubtitle, currentTime, metronome, metronomeStartTime, subtitles],
    );

    const getEventTime = useCallback(
        event => {
            return (event.pageX - render.padding * gridGap) / gridGap / 10 + render.beginTime;
        },
        [gridGap, render],
    );

    const onMouseDown = useCallback(
        event => {
            const clickTime = getEventTime(event);
            player.seek = clickTime;
            isDroging = true;
            setDrogStartTime(clickTime);
        },
        [getEventTime, player],
    );

    const onMouseMove = useCallback(
        event => {
            if (isDroging) {
                player.pause = true;
                setDrogEndTime(getEventTime(event));
            }
        },
        [setDrogEndTime, getEventTime, player],
    );

    const onDocumentMouseUp = useCallback(() => {
        if (isDroging) {
            setMetronome(false);
            setMetronomeStartTime(0);
            if (drogStartTime && drogEndTime && drogEndTime - drogStartTime >= 0.2) {
                const index = findIndex(subtitles, drogStartTime) + 1;
                const start = secondToTime(drogStartTime);
                const end = secondToTime(drogEndTime);
                addSubtitle(index, new Sub(start, end, t('subtitle-text')));
            }
        }
        isDroging = false;
        setDrogStartTime(0);
        setDrogEndTime(0);
    }, [addSubtitle, drogEndTime, drogStartTime, setMetronome, subtitles]);

    const onDocumentClick = useCallback(
        event => {
            if (event.composedPath) {
                const composedPath = event.composedPath() || [];
                if (player.playing && composedPath.includes($metronomeRef.current)) {
                    setMetronome(true);
                    isDroging = false;
                    setDrogStartTime(0);
                    setDrogEndTime(0);
                } else {
                    setMetronome(false);
                    setMetronomeStartTime(0);
                }
            }
        },
        [player, $metronomeRef, setMetronome],
    );

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('mouseup', onDocumentMouseUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onDocumentClick);
            document.removeEventListener('mouseup', onDocumentMouseUp);
        };
    }, [onKeyDown, onDocumentClick, onDocumentMouseUp]);

    return (
        <Metronome onMouseDown={onMouseDown} onMouseMove={onMouseMove} ref={$metronomeRef}>
            {player && player.playing && metronomeStartTime && metronome && currentTime > metronomeStartTime ? (
                <div
                    className="templet"
                    style={{
                        left: render.padding * gridGap + (metronomeStartTime - render.beginTime) * gridGap * 10,
                        width: (currentTime - metronomeStartTime) * gridGap * 10,
                    }}
                ></div>
            ) : null}
            {player && !player.playing && drogStartTime && drogEndTime && drogEndTime > drogStartTime ? (
                <div
                    className="templet"
                    style={{
                        left: render.padding * gridGap + (drogStartTime - render.beginTime) * gridGap * 10,
                        width: (drogEndTime - drogStartTime) * gridGap * 10,
                    }}
                ></div>
            ) : null}
        </Metronome>
    );
}
