import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import escape from 'lodash/escape';
import { notify, secondToTime } from '../utils';

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

    .contextmenu {
        position: absolute;
        z-index: 4;
        left: 0;
        top: 0;

        .contextmenu-item {
            height: 30px;
            padding: 0 10px;
            line-height: 30px;
            cursor: pointer;
            font-size: 12px;
            color: #ccc;
            user-select: none;
            background-color: rgba(0, 0, 0, 0.75);
            transition: all 0.2s ease;
            &:hover {
                color: #fff;
                background-color: #2196f3;
            }
        }
    }

    .sub-item {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
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
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
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

let lastTarget = null;
let lastSub = null;
let lastType = '';
let lastX = 0;
let lastWidth = 0;
let lastDiffX = 0;
let isDroging = false;

export default React.memo(
    function({
        player,
        subtitles,
        render,
        currentTime,
        checkSubtitleIllegal,
        removeSubtitle,
        addSubtitle,
        hasSubtitle,
        mergeSubtitle,
        updateSubtitle,
    }) {
        const [contextMenu, setContextMenu] = useState(false);
        const [contextMenuX, setContextMenuX] = useState(0);
        const [contextMenuY, setContextMenuY] = useState(0);

        const $contextMenuRef = React.createRef();
        const $subsRef = React.createRef();
        const currentSubs = getCurrentSubs(subtitles, render.beginTime, render.duration);
        const gridGap = document.body.clientWidth / render.gridNum;
        const currentIndex = currentSubs.findIndex(item => item.startTime <= currentTime && item.endTime > currentTime);

        const onContextMenu = (sub, event) => {
            lastSub = sub;
            event.preventDefault();
            const $subs = event.target;
            const subsTop = $subs.getBoundingClientRect().top;
            const $contextMenu = $contextMenuRef.current;
            const top =
                event.pageY + $contextMenu.clientHeight > document.body.clientHeight
                    ? document.body.clientHeight - $contextMenu.clientHeight - subsTop
                    : event.pageY - subsTop;
            const left =
                event.pageX + $contextMenu.clientWidth > document.body.clientWidth
                    ? document.body.clientWidth - $contextMenu.clientWidth
                    : event.pageX;
            setContextMenuX(left);
            setContextMenuY(top);
            setContextMenu(true);
        };

        const onDocumentClick = useCallback(
            event => {
                if (event.composedPath && event.composedPath().indexOf($contextMenuRef.current) < 0) {
                    setContextMenu(false);
                }
            },
            [$contextMenuRef, setContextMenu],
        );

        const onMouseDown = (sub, event, type) => {
            isDroging = true;
            lastSub = sub;
            lastType = type;
            lastX = event.pageX;
            const index = currentSubs.indexOf(sub);
            lastTarget = $subsRef.current.children[index];
            lastWidth = parseFloat(lastTarget.style.width);
        };

        const onDocumentMouseMove = useCallback(event => {
            if (isDroging && lastTarget) {
                lastDiffX = event.pageX - lastX;
                if (lastType === 'left') {
                    lastTarget.style.width = `${lastWidth - lastDiffX}px`;
                    lastTarget.style.transform = `translate(${lastDiffX}px)`;
                } else if (lastType === 'right') {
                    lastTarget.style.width = `${lastWidth + lastDiffX}px`;
                } else {
                    lastTarget.style.transform = `translate(${lastDiffX}px)`;
                }
            }
        }, []);

        const onDocumentMouseUp = useCallback(() => {
            if (isDroging && lastTarget && lastDiffX) {
                const timeDiff = lastDiffX / gridGap / 10;
                const index = hasSubtitle(lastSub);
                const previou = subtitles[index - 1];
                const next = subtitles[index + 1];
                const startTime = lastSub.startTime + timeDiff;
                const endTime = lastSub.endTime + timeDiff;

                if ((previou && endTime < previou.startTime) || (next && startTime > next.endTime)) {
                    notify('操作错误', 'error');
                } else {
                    if (lastType === 'left') {
                        if (startTime >= 0 && startTime < lastSub.endTime) {
                            const start = secondToTime(startTime);
                            updateSubtitle(lastSub, 'start', start);
                        } else {
                            lastTarget.style.width = `${lastWidth}px`;
                            notify('移动错误了', 'error');
                        }
                    } else if (lastType === 'right') {
                        if (endTime >= 0 && endTime > lastSub.startTime) {
                            const end = secondToTime(endTime);
                            updateSubtitle(lastSub, 'end', end);
                        } else {
                            lastTarget.style.width = `${lastWidth}px`;
                            notify('移动错误了', 'error');
                        }
                    } else {
                        if (startTime > 0 && endTime > 0 && endTime > startTime) {
                            const start = secondToTime(startTime);
                            const end = secondToTime(endTime);
                            updateSubtitle(lastSub, {
                                start,
                                end,
                            });
                        } else {
                            lastTarget.style.width = `${lastWidth}px`;
                            notify('移动错误了', 'error');
                        }
                    }
                }

                player.seek = startTime;
                lastTarget.style.transform = `translate(0)`;
            }

            lastTarget = null;
            lastSub = null;
            lastType = '';
            lastX = 0;
            lastWidth = 0;
            lastDiffX = 0;
            isDroging = false;
        }, [gridGap, hasSubtitle, player, subtitles, updateSubtitle]);

        useEffect(() => {
            document.addEventListener('click', onDocumentClick);
            document.addEventListener('mousemove', onDocumentMouseMove);
            document.addEventListener('mouseup', onDocumentMouseUp);
            return () => {
                document.removeEventListener('click', onDocumentClick);
                document.removeEventListener('mousemove', onDocumentMouseMove);
                document.removeEventListener('mouseup', onDocumentMouseUp);
            };
        }, [onDocumentClick, onDocumentMouseMove, onDocumentMouseUp]);

        return (
            <Block>
                <div
                    className="padding"
                    style={{
                        left: 0,
                        width: render.padding * gridGap,
                    }}
                ></div>
                <div ref={$subsRef}>
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
                                onClick={() => {
                                    setContextMenu(false);
                                    if (player.duration >= sub.startTime) {
                                        player.seek = sub.startTime + 0.001;
                                    }
                                }}
                                onContextMenu={event => onContextMenu(sub, event)}
                            >
                                <div
                                    className="handle"
                                    style={{
                                        left: 0,
                                        width: gridGap,
                                    }}
                                    onMouseDown={event => onMouseDown(sub, event, 'left')}
                                ></div>
                                <div className="text" onMouseDown={event => onMouseDown(sub, event)}>
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
                                    onMouseDown={event => onMouseDown(sub, event, 'right')}
                                ></div>
                            </div>
                        );
                    })}
                </div>
                <div
                    className="padding"
                    style={{
                        right: 0,
                        width: render.padding * gridGap,
                    }}
                ></div>
                <div
                    ref={$contextMenuRef}
                    className="contextmenu"
                    style={{
                        visibility: contextMenu ? 'visible' : 'hidden',
                        left: contextMenuX,
                        top: contextMenuY,
                    }}
                >
                    <div
                        className="contextmenu-item"
                        onClick={() => {
                            removeSubtitle(lastSub);
                            setContextMenu(false);
                        }}
                    >
                        Delete
                    </div>
                    <div
                        className="contextmenu-item"
                        onClick={() => {
                            addSubtitle(hasSubtitle(lastSub) + 1);
                            setContextMenu(false);
                        }}
                    >
                        Insert Next
                    </div>
                    <div
                        className="contextmenu-item"
                        onClick={() => {
                            mergeSubtitle(lastSub);
                            setContextMenu(false);
                        }}
                    >
                        Merge Next
                    </div>
                </div>
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
