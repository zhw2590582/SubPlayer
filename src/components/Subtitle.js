import React from 'react';
import styled from 'styled-components';
import { unescapeHTML } from '../utils';
import { Table } from 'react-virtualized';

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
                color: #fff;
                background-color: #2196f3;
                text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
            }
            &.illegal {
                color: #fff;
                background-color: #c75123;
                text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
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
            padding: 5px;
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
        }

        .textarea {
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

export default function({ subtitles, updateSubtitle, removeSubtitle, addSubtitle }) {
    return (
        <Subtitle>
            <Table
                headerHeight={40}
                width={document.body.clientWidth / 2}
                height={document.body.clientHeight - 220}
                rowHeight={80}
                scrollToIndex={1}
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
                                props.rowData.highlight ? 'highlight' : '',
                                // checkSubtitleIllegal(props.rowData) ? 'illegal' : '',
                            ]
                                .join(' ')
                                .trim()}
                            style={props.style}
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
                                <input
                                    maxLength={20}
                                    className="input"
                                    value={props.rowData.start}
                                    onChange={event => updateSubtitle(props.rowData, 'start', event.target.value)}
                                    style={{ marginBottom: 10 }}
                                />
                                <div />
                                <input
                                    maxLength={20}
                                    className="input"
                                    value={props.rowData.end}
                                    onChange={event => updateSubtitle(props.rowData, 'end', event.target.value)}
                                />
                            </div>
                            <div className="row duration" style={{ width: 50 }}>
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
