import React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import escape from 'lodash/escape';

const Block = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .padding {
        position: absolute;
        z-index: 99;
        top: 0;
        bottom: 0;
        height: 100%;
        user-select: none;
        pointer-events: none;
    }

    .sub-item {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        color: #fff;
        font-size: 13px;
        cursor: move;
        user-select: none;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
        background-color: rgba(255, 255, 255, 0.2);
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        border-right: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        &.highlight {
            background-color: rgba(33, 150, 243, 0.5);
            border-left: 1px solid rgba(33, 150, 243, 0.5);
            border-right: 1px solid rgba(33, 150, 243, 0.5);
        }

        &.illegal {
            background-color: rgba(199, 81, 35, 0.5);
        }

        .handle {
            position: absolute;
            top: 0;
            bottom: 0;
            height: 100%;
            cursor: col-resize;
            user-select: none;
            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }

        .text {
            padding: 0 20px;
            p {
                margin: 5px 0;
            }
        }
    }
`;

function getCurrentSubs(subs, beginTime, duration) {
    return subs.filter(item => {
        return (
            (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
            (item.endTime >= beginTime && item.endTime <= beginTime + duration)
        );
    });
}

export default React.memo(
    function({ subtitles, render, currentTime, checkSubtitleIllegal }) {
        const currentSubs = getCurrentSubs(subtitles, render.beginTime, render.duration);
        const gridGap = document.body.clientWidth / render.gridNum;
        const currentIndex = currentSubs.findIndex(item => item.startTime <= currentTime && item.endTime > currentTime);
        return (
            <Block>
                <div
                    className="padding"
                    style={{
                        left: 0,
                        width: render.padding * gridGap,
                    }}
                ></div>
                {currentSubs.map((sub, key) => {
                    return (
                        <div
                            className={[
                                'sub-item',
                                key === currentIndex ? 'highlight' : '',
                                checkSubtitleIllegal(sub) ? 'illegal' : '',
                            ]
                                .join(' ')
                                .trim()}
                            key={key}
                            style={{
                                left: render.padding * gridGap + (sub.startTime - render.beginTime) * gridGap * 10,
                                width: (sub.endTime - sub.startTime) * gridGap * 10,
                            }}
                        >
                            <div
                                className="handle"
                                style={{
                                    left: 0,
                                    width: gridGap,
                                }}
                            ></div>
                            <div className="text">
                                {sub.text.split(/\r?\n/).map((line, index) => (
                                    <p key={index}>{escape(line)}</p>
                                ))}
                            </div>
                            <div
                                className="handle"
                                style={{
                                    right: 0,
                                    width: gridGap,
                                }}
                            ></div>
                        </div>
                    );
                })}
                <div
                    className="padding"
                    style={{
                        right: 0,
                        width: render.padding * gridGap,
                    }}
                ></div>
            </Block>
        );
    },
    (prevProps, nextProps) => {
        return (
            isEqual(prevProps.subtitles, nextProps.subtitles) &&
            isEqual(prevProps.render, nextProps.render) &&
            prevProps.currentTime === nextProps.currentTime
        );
    },
);
