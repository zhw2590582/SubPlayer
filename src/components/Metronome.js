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

    .metronome {
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        background-color: rgba(76, 175, 80, 0.5);
        border-left: 1px solid rgba(76, 175, 80, 0.8);
        border-right: 1px solid rgba(76, 175, 80, 0.8);
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
    const [startTime, setStartTime] = useState(0);
    const gridGap = document.body.clientWidth / render.gridNum;
    const $metronomeRef = React.createRef();

    const onKeyDown = useCallback(
        event => {
            if (metronome) {
                const keyCode = getKeyCode(event);
                if (keyCode === 32) {
                    event.preventDefault();
                    if (!startTime) {
                        setStartTime(currentTime);
                    }

                    if (startTime && currentTime > startTime) {
                        const index = findIndex(subtitles, startTime) + 1;
                        const start = secondToTime(startTime);
                        const end = secondToTime(currentTime);
                        addSubtitle(index, new Sub(start, end, t('subtitle-text')));
                        setStartTime(0);
                    }
                }
            }
        },
        [addSubtitle, currentTime, metronome, startTime, subtitles],
    );

    const onMouseDown = useCallback(
        event => {
            const clickTime = (event.pageX - render.padding * gridGap) / gridGap / 10 + render.beginTime;
            player.seek = clickTime;
            isDroging = true;
            setMetronome(true);
        },
        [render, gridGap, player, setMetronome],
    );

    const onMouseMove = useCallback(event => {
        //
    }, []);

    const onDocumentMouseUp = useCallback(event => {
        isDroging = false;
    }, []);

    const onDocumentClick = useCallback(
        event => {
            console.log(event);
            if (event.composedPath) {
                const composedPath = event.composedPath() || [];
                if (player.playing && composedPath.includes($metronomeRef.current)) {
                    setMetronome(true);
                } else {
                    setMetronome(false);
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
            {startTime ? (
                <div
                    className="metronome"
                    style={{
                        left: render.padding * gridGap + (startTime - render.beginTime) * gridGap * 10,
                        width: (currentTime - startTime) * gridGap * 10,
                    }}
                ></div>
            ) : null}
        </Metronome>
    );
}
