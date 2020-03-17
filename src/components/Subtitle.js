import React from 'react';
import styled from 'styled-components';
import { unescapeHTML } from '../utils';
import { Table } from 'react-virtualized';
import { timeToSecond, secondToTime } from '../utils';

const Subtitle = styled.div`
    .ReactVirtualized__Table {
        font-size: 12px;
        .ReactVirtualized__Table__Grid {
            outline: none;
        }
        .ReactVirtualized__Table__row {
            transition: all 0.2s ease;
            &.odd {
                background-color: rgb(35, 40, 64);
            }
            &.highlight {
                background-color: #2196f3;
            }
            &.illegal {
                background-color: #c75123;
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 100%;
                padding: 10px 5px;
                border-bottom: 1px solid #000;
            }
        }

        .input,
        .textarea {
            border: none;
            width: 100%;
            color: #fff;
            font-size: 12px;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            resize: none;
        }

        .input {
            height: 25px;
            line-height: 25px;
            cursor: col-resize;
            user-select: none;
        }

        .textarea {
            padding: 5px;
            height: 100%;
            line-height: 1.5;
        }

        .operation {
            i {
                font-size: 12px;
                cursor: pointer;
            }
        }
    }
`;

export default function({
    player,
    subtitles,
    addSubtitle,
    currentIndex,
    updateSubtitle,
    removeSubtitle,
    checkSubtitleIllegal,
}) {
    let isDroging = false;
    let lastPageX = 0;
    let lastSub = null;
    let lastKey = '';
    let lastValue = '';

    function onMouseDown(event, sub, key) {
        isDroging = true;
        lastPageX = event.pageX;
        lastSub = sub;
        lastKey = key;
    }

    function onMouseMove(event, sub, key) {
        if (isDroging) {
            const time = Number(((event.pageX - lastPageX) / 10).toFixed(3));
            lastValue = secondToTime(timeToSecond(sub[key]) + time);
        }
    }

    document.addEventListener('mouseup', () => {
        if (isDroging) {
            updateSubtitle(lastSub, lastKey, lastValue);
            isDroging = false;
            lastPageX = 0;
            lastSub = null;
            lastKey = '';
            lastValue = '';
        }
    });

    return (
        <Subtitle>
            <Table
                headerHeight={40}
                width={document.body.clientWidth / 2}
                height={document.body.clientHeight - 220}
                rowHeight={80}
                scrollToIndex={currentIndex}
                rowCount={subtitles.length}
                rowGetter={({ index }) => subtitles[index]}
                headerRowRenderer={() => null}
                rowRenderer={props => {
                    return (
                        <div
                            key={props.key}
                            className={[
                                props.className,
                                props.index % 2 ? 'odd' : '',
                                currentIndex === props.index ? 'highlight' : '',
                                checkSubtitleIllegal(props.rowData) ? 'illegal' : '',
                            ]
                                .join(' ')
                                .trim()}
                            style={props.style}
                            onClick={() => {
                                player.seek = props.rowData.startTime;
                            }}
                        >
                            <div className="row operation" style={{ width: 30 }}>
                                <i
                                    className="icon-trash-empty"
                                    onClick={() => removeSubtitle(props.rowData)}
                                    style={{ marginBottom: 15 }}
                                ></i>
                                <i className="icon-doc-new" onClick={() => addSubtitle(props.index + 1)}></i>
                            </div>
                            <div className="row time" style={{ width: 150 }}>
                                <div
                                    className="input"
                                    onMouseDown={event => onMouseDown(event, props.rowData, 'start')}
                                    onMouseMove={event => onMouseMove(event, props.rowData, 'start')}
                                    style={{ marginBottom: 10 }}
                                >
                                    {props.rowData.start}
                                </div>
                                <div
                                    className="input"
                                    onMouseDown={event => onMouseDown(event, props.rowData, 'end')}
                                    onMouseMove={event => onMouseMove(event, props.rowData, 'end')}
                                >
                                    {props.rowData.end}
                                </div>
                            </div>
                            <div className="row duration" style={{ width: 70 }}>
                                {props.rowData.duration}
                            </div>
                            <div className="row text" style={{ flex: 1 }}>
                                <textarea
                                    maxLength={200}
                                    className="textarea"
                                    value={unescapeHTML(props.rowData.text)}
                                    onChange={event => updateSubtitle(props.rowData, 'text', event.target.value)}
                                />
                            </div>
                        </div>
                    );
                }}
            ></Table>
        </Subtitle>
    );
}
