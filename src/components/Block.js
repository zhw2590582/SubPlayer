import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import { notify, secondToTime, getKeyCode } from '../utils';
import { t, Translate } from 'react-i18nify';

const Block = styled.div`
    position: absolute;
    z-index: 9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .contextmenu {
        position: absolute;
        z-index: 4;
        left: 0;
        top: 0;
        pointer-events: all;

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
        pointer-events: all;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
        background-color: rgba(255, 255, 255, 0.2);
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        border-right: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        &.sub-highlight {
            background-color: rgba(33, 150, 243, 0.5);
            border-left: 1px solid rgba(33, 150, 243, 0.5);
            border-right: 1px solid rgba(33, 150, 243, 0.5);
        }

        &.sub-illegal {
            background-color: rgba(199, 81, 35, 0.5);
        }

        .sub-handle {
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

        .sub-text {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            word-break: break-all;
            width: 100%;
            height: 100%;
            padding: 0 20px;
            p {
                margin: 5px 0;
                line-height: 1;
            }
        }
    }
`;

function getCurrentSubs(subs, beginTime, duration) {
    return subs.filter((item) => {
        return (
            (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
            (item.endTime >= beginTime && item.endTime <= beginTime + duration) ||
            (item.startTime < beginTime && item.endTime > beginTime + duration)
        );
    });
}

function magnetically(time, closeTime) {
    if (!closeTime) return time;
    if (time > closeTime - 0.1 && closeTime + 0.1 > time) {
        return closeTime;
    }
    return time;
}

let lastTarget = null;
let lastSub = null;
let lastType = '';
let lastX = 0;
let lastIndex = -1;
let lastWidth = 0;
let lastDiffX = 0;
let isDroging = false;

export default React.memo(
    function ({
        player,
        subtitles,
        render,
        currentTime,
        checkSubtitle,
        removeSubtitle,
        addSubtitle,
        hasSubtitle,
        mergeSubtitle,
        updateSubtitle,
    }) {
        const [contextMenu, setContextMenu] = useState(false);
        const [contextMenuX, setContextMenuX] = useState(0);
        const [contextMenuY, setContextMenuY] = useState(0);

        const $blockRef = React.createRef();
        const $contextMenuRef = React.createRef();
        const $subsRef = React.createRef();
        const currentSubs = getCurrentSubs(subtitles, render.beginTime, render.duration);
        const gridGap = document.body.clientWidth / render.gridNum;
        const currentIndex = currentSubs.findIndex(
            (item) => item.startTime <= currentTime && item.endTime > currentTime,
        );

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
            (event) => {
                if (event.composedPath) {
                    const composedPath = event.composedPath() || [];
                    if (composedPath.includes($contextMenuRef.current)) {
                        setContextMenu(false);
                    }
                }
            },
            [$contextMenuRef, setContextMenu],
        );

        const onMouseDown = (sub, event, type) => {
            isDroging = true;
            lastSub = sub;
            lastType = type;
            lastX = event.pageX;
            lastIndex = currentSubs.indexOf(sub);
            lastTarget = $subsRef.current.children[lastIndex];
            lastWidth = parseFloat(lastTarget.style.width);
        };

        const onDocumentMouseMove = useCallback((event) => {
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
                const startTime = magnetically(lastSub.startTime + timeDiff, previou ? previou.endTime : 0);
                const endTime = magnetically(lastSub.endTime + timeDiff, next ? next.startTime : 0);
                const width = (endTime - startTime) * 10 * gridGap;

                if ((previou && endTime < previou.startTime) || (next && startTime > next.endTime)) {
                    notify(t('parameter-error'), 'error');
                } else {
                    if (lastType === 'left') {
                        if (startTime >= 0 && startTime < lastSub.endTime) {
                            const start = secondToTime(startTime);
                            updateSubtitle(lastSub, 'start', start);
                            player.seek = startTime;
                        } else {
                            lastTarget.style.width = `${width}px`;
                            notify(t('parameter-error'), 'error');
                        }
                    } else if (lastType === 'right') {
                        if (endTime >= 0 && endTime > lastSub.startTime) {
                            const end = secondToTime(endTime);
                            updateSubtitle(lastSub, 'end', end);
                            player.seek = startTime;
                        } else {
                            lastTarget.style.width = `${width}px`;
                            notify(t('parameter-error'), 'error');
                        }
                    } else {
                        if (startTime > 0 && endTime > 0 && endTime > startTime) {
                            const start = secondToTime(startTime);
                            const end = secondToTime(endTime);
                            updateSubtitle(lastSub, {
                                start,
                                end,
                            });
                            player.seek = startTime;
                        } else {
                            lastTarget.style.width = `${width}px`;
                            notify(t('parameter-error'), 'error');
                        }
                    }
                }

                lastTarget.style.transform = `translate(0)`;
            }

            lastType = '';
            lastX = 0;
            lastWidth = 0;
            lastDiffX = 0;
            isDroging = false;
        }, [gridGap, hasSubtitle, player, subtitles, updateSubtitle]);

        const onKeyDown = useCallback(
            (event) => {
                const sub = currentSubs[lastIndex];
                if (sub && lastTarget) {
                    const keyCode = getKeyCode(event);
                    switch (keyCode) {
                        case 37:
                            updateSubtitle(sub, {
                                start: secondToTime(sub.startTime - 0.1),
                                end: secondToTime(sub.endTime - 0.1),
                            });
                            player.seek = sub.startTime - 0.1;
                            break;
                        case 39:
                            updateSubtitle(sub, {
                                start: secondToTime(sub.startTime + 0.1),
                                end: secondToTime(sub.endTime + 0.1),
                            });
                            player.seek = sub.startTime + 0.1;
                            break;
                        case 8:
                        case 46:
                            removeSubtitle(sub);
                            break;
                        default:
                            break;
                    }
                }
            },
            [currentSubs, player, removeSubtitle, updateSubtitle],
        );

        useEffect(() => {
            document.addEventListener('click', onDocumentClick);
            document.addEventListener('mousemove', onDocumentMouseMove);
            document.addEventListener('mouseup', onDocumentMouseUp);
            window.addEventListener('keydown', onKeyDown);
            return () => {
                document.removeEventListener('click', onDocumentClick);
                document.removeEventListener('mousemove', onDocumentMouseMove);
                document.removeEventListener('mouseup', onDocumentMouseUp);
                window.removeEventListener('keydown', onKeyDown);
            };
        }, [onDocumentClick, onDocumentMouseMove, onDocumentMouseUp, onKeyDown]);

        return (
            <Block ref={$blockRef}>
                <div ref={$subsRef}>
                    {currentSubs.map((sub, key) => {
                        return (
                            <div
                                className={[
                                    'sub-item',
                                    key === currentIndex ? 'sub-highlight' : '',
                                    checkSubtitle(sub) ? 'sub-illegal' : '',
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
                                onContextMenu={(event) => onContextMenu(sub, event)}
                            >
                                <div
                                    className="sub-handle"
                                    style={{
                                        left: 0,
                                        width: gridGap,
                                    }}
                                    onMouseDown={(event) => onMouseDown(sub, event, 'left')}
                                ></div>
                                <div className="sub-text" onMouseDown={(event) => onMouseDown(sub, event)}>
                                    {sub.text.split(/\r?\n/).map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                                <div
                                    className="sub-handle"
                                    style={{
                                        right: 0,
                                        width: gridGap,
                                    }}
                                    onMouseDown={(event) => onMouseDown(sub, event, 'right')}
                                ></div>
                            </div>
                        );
                    })}
                </div>
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
                        <Translate value="delete" />
                    </div>
                    <div
                        className="contextmenu-item"
                        onClick={() => {
                            addSubtitle(hasSubtitle(lastSub) + 1);
                            setContextMenu(false);
                        }}
                    >
                        <Translate value="insert" />
                    </div>
                    <div
                        className="contextmenu-item"
                        onClick={() => {
                            mergeSubtitle(lastSub);
                            setContextMenu(false);
                        }}
                    >
                        <Translate value="merge" />
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
