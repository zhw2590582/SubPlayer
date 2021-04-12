import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import DT from 'duration-time-conversion';
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
    cursor: ew-resize;
    user-select: none;

    .template {
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

export default function Component({ render, subtitle, newSub, addSub, player, playing }) {
    const [isDroging, setIsDroging] = useState(false);
    const [drogStartTime, setDrogStartTime] = useState(0);
    const [drogEndTime, setDrogEndTime] = useState(0);
    const gridGap = document.body.clientWidth / render.gridNum;

    const getEventTime = useCallback(
        (event) => {
            return (event.pageX - render.padding * gridGap) / gridGap / 10 + render.beginTime;
        },
        [gridGap, render],
    );

    const onMouseDown = useCallback(
        (event) => {
            if (event.button !== 0) return;
            const clickTime = getEventTime(event);
            setIsDroging(true);
            setDrogStartTime(clickTime);
        },
        [getEventTime],
    );

    const onMouseMove = useCallback(
        (event) => {
            if (isDroging) {
                if (playing) player.pause();
                setDrogEndTime(getEventTime(event));
            }
        },
        [isDroging, playing, player, getEventTime],
    );

    const onDocumentMouseUp = useCallback(() => {
        if (isDroging) {
            if (drogStartTime > 0 && drogEndTime > 0 && drogEndTime - drogStartTime >= 0.2) {
                const index = findIndex(subtitle, drogStartTime) + 1;
                const start = DT.d2t(drogStartTime);
                const end = DT.d2t(drogEndTime);
                addSub(
                    index,
                    newSub({
                        start,
                        end,
                        text: t('SUB_TEXT'),
                    }),
                );
            }
        }
        setIsDroging(false);
        setDrogStartTime(0);
        setDrogEndTime(0);
    }, [isDroging, drogStartTime, drogEndTime, subtitle, addSub, newSub]);

    useEffect(() => {
        document.addEventListener('mouseup', onDocumentMouseUp);
        return () => document.removeEventListener('mouseup', onDocumentMouseUp);
    }, [onDocumentMouseUp]);

    return (
        <Metronome onMouseDown={onMouseDown} onMouseMove={onMouseMove}>
            {player && !playing && drogStartTime && drogEndTime && drogEndTime > drogStartTime ? (
                <div
                    className="template"
                    style={{
                        left: render.padding * gridGap + (drogStartTime - render.beginTime) * gridGap * 10,
                        width: (drogEndTime - drogStartTime) * gridGap * 10,
                    }}
                ></div>
            ) : null}
        </Metronome>
    );
}
