import React, { useEffect } from 'react';
import styled from 'styled-components';
import dequal from 'dequal';
import { Translate } from 'react-i18nify';
import { getSubFromVttUrl } from '../subtitle';
import { escapeHTML, unescapeHTML } from '../utils';
import { Table } from 'react-virtualized';

const Subtitle = styled.div`
    .ReactVirtualized__Table {
        font-size: 12px;
        background: #24292d;
        .ReactVirtualized__Table__Grid {
            outline: none;
        }
        .ReactVirtualized__Table__headerRow {
            background: rgb(46, 54, 60);
            border-bottom: 1px solid rgb(10, 10, 10);
            .row {
                padding: 10px 5px;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                text-align: center;
                text-transform: none;
            }
        }
        .ReactVirtualized__Table__row {
            background-color: #1c2022;
            border-bottom: 1px solid rgb(36, 41, 45);
            transition: all 0.2s ease;
            &.odd {
                background-color: rgb(46, 54, 60);
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
                padding: 10px 5px;
                text-align: center;
            }
        }
        .input,
        .textarea {
            border: none;
            padding: 5px;
            min-height: 30px;
            font-size: 12px;
            text-align: center;
            color: #fff;
            background-color: #3a3a3a;
        }
        .textarea {
            resize: vertical;
        }
        p {
            line-height: 1.5;
            margin: 0;
        }
    }
`;

export default React.memo(
    function({ options, subtitles = [], setSubtitles }) {
        useEffect(() => {
            async function getSubs() {
                const subs = await getSubFromVttUrl(options.subtitleUrl);
                setSubtitles(subs);
            }
            getSubs();
        });

        function onChange() {
            //
        }

        return (
            <Subtitle>
                <Table
                    headerHeight={40}
                    width={document.body.clientWidth / 2}
                    height={document.body.clientHeight - 220}
                    rowHeight={60}
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
                                    props.rowData.editing ? 'editing' : '',
                                    props.rowData.highlight ? 'highlight' : '',
                                    // checkSubtitleIllegal(props.rowData) ? 'illegal' : '',
                                ]
                                    .join(' ')
                                    .trim()}
                                style={props.style}
                            >
                                <div className="row" style={{ width: 50 }}>
                                    {props.index + 1}
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <input
                                        maxLength={20}
                                        className="input edit"
                                        value={props.rowData.start}
                                        onChange={event => onChange('start', event.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <input
                                        maxLength={20}
                                        className="input edit"
                                        value={props.rowData.end}
                                        onChange={event => onChange('end', event.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <input
                                        disabled
                                        maxLength={20}
                                        className="input edit"
                                        value={props.rowData.duration}
                                    />
                                </div>
                                <div className="row" style={{ flex: 1 }}>
                                    <textarea
                                        maxLength={100}
                                        className="textarea edit"
                                        value={unescapeHTML(props.rowData.text || '')}
                                        onChange={event => onChange('text', event.target.value)}
                                    />
                                </div>
                            </div>
                        );
                    }}
                ></Table>
            </Subtitle>
        );
    },
    (prevProps, nextProps) => {
        return (
            dequal(prevProps.subtitles, nextProps.subtitles) &&
            prevProps.options.subtitleUrl === nextProps.options.subtitleUrl
        );
    },
);
