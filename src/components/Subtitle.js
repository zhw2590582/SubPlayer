import React, { useEffect } from 'react';
import styled from 'styled-components';
import dequal from 'fast-deep-equal';
import { getSubFromVttUrl } from '../subtitle';
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
    }
`;

export default React.memo(
    function({ options, subtitles, setSubtitles }) {
        useEffect(() => {
            async function getSubs() {
                const subs = await getSubFromVttUrl(options.subtitleUrl);
                setSubtitles(subs);
            }
            getSubs();
        });

        function onChange(sub, key, value) {
            sub[key] = value;
            setSubtitles(subtitles);
        }

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
                                <div className="row" style={{ width: 40 }}>
                                    {props.index + 1}
                                </div>
                                <div className="row" style={{ width: 150 }}>
                                    <input
                                        maxLength={20}
                                        className="input"
                                        value={props.rowData.start}
                                        onChange={event => onChange(props.rowData, 'start', event.target.value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <div />
                                    <input
                                        maxLength={20}
                                        className="input"
                                        value={props.rowData.end}
                                        onChange={event => onChange(props.rowData, 'end', event.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ width: 50 }}>
                                    {props.rowData.duration}
                                </div>
                                <div className="row" style={{ flex: 1 }}>
                                    <textarea
                                        maxLength={200}
                                        className="textarea"
                                        value={unescapeHTML(props.rowData.text)}
                                        onChange={event => onChange(props.rowData, 'text', event.target.value)}
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
        console.log(dequal(prevProps.subtitles, nextProps.subtitles));
        return (
            dequal(prevProps.subtitles, nextProps.subtitles) &&
            dequal(prevProps.options.subtitleUrl, nextProps.options.subtitleUrl)
        );
    },
);
