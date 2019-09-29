import React from 'react';
import styled from 'styled-components';
import { t, Translate } from 'react-i18nify';
import toastr from 'toastr';
import { checkTime, timeToSecond, escapeHTML, unescapeHTML } from '../utils';
import { Table } from 'react-virtualized';
import Sub from '../utils/sub';

const Wrapper = styled.div`
    flex: 1;
    border-right: 1px solid rgb(10, 10, 10);
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
                background-color: #2196f3;
            }

            &.overlapping {
                background-color: #c75123;
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

    .operation {
        display: flex;
        justify-content: center;

        i {
            width: 25px;
            cursor: pointer;
            font-size: 16px;
        }
    }

    .edit {
        display: none;
        width: 100%;
        height: 100%;
    }

    .editing {
        .noedit {
            display: none;
        }

        .edit {
            display: block;
        }
    }
`;

export default class Subtitle extends React.Component {
    state = {
        index: -1,
        subtitle: {},
    };

    check() {
        const { index, subtitle } = this.state;
        const { subtitles } = this.props;
        const startTime = timeToSecond(subtitle.start);
        const endTime = timeToSecond(subtitle.end);
        const previous = subtitles[index - 1];

        if (index !== -1) {
            if (!checkTime(subtitle.start)) {
                toastr.error(t('startTime'));
                return false;
            }

            if (!checkTime(subtitle.end)) {
                toastr.error(t('endTime'));
                return false;
            }

            if (startTime >= endTime) {
                toastr.error(t('greater'));
                return false;
            }

            if (previous && startTime < previous.endTime) {
                toastr.warning(t('overlaps'));
            }
        }
        return true;
    }

    onEdit(sub) {
        const index = this.props.subtitles.indexOf(sub);
        this.setState({
            index: index,
            subtitle: new Sub(sub.start, sub.end, sub.text),
        });
        this.props.editSubtitle(sub);
    }

    onUpdate() {
        if (this.check()) {
            const { index, subtitle } = this.state;
            this.props.updateSubtitle(index, subtitle);
            this.setState({
                index: -1,
                subtitle: {},
            });
        }
    }

    onChange(name, value) {
        this.setState({
            subtitle: {
                ...this.state.subtitle,
                [name]: value,
            },
        });
    }

    onRemove(sub) {
        this.props.removeSubtitle(sub);
        this.setState({
            index: -1,
            subtitle: {},
        });
    }

    render() {
        const { subtitle } = this.state;
        const { subtitles, mainHeight, mainWidth, currentIndex, checkOverlapping } = this.props;
        return (
            <Wrapper>
                <Table
                    headerHeight={40}
                    width={mainWidth / 2}
                    height={mainHeight}
                    rowHeight={60}
                    scrollToIndex={currentIndex}
                    rowCount={subtitles.length}
                    rowGetter={({ index }) => subtitles[index]}
                    headerRowRenderer={() => {
                        return (
                            <div className="ReactVirtualized__Table__headerRow">
                                <div className="row" style={{ width: 50 }} width="50">
                                    #
                                </div>
                                <div className="row" style={{ width: 100 }} width="120">
                                    <Translate value="start" />
                                </div>
                                <div className="row" style={{ width: 100 }} width="120">
                                    <Translate value="end" />
                                </div>
                                <div className="row" style={{ width: 100 }} width="100">
                                    <Translate value="duration" />
                                </div>
                                <div className="row" style={{ flex: 1 }}>
                                    <Translate value="text" />
                                </div>
                                <div className="row" style={{ width: 90 }} width="100">
                                    <Translate value="operation" />
                                </div>
                            </div>
                        );
                    }}
                    rowRenderer={props => {
                        return (
                            <div
                                key={props.key}
                                className={[
                                    props.className,
                                    props.index % 2 ? 'odd' : '',
                                    props.rowData.editing ? 'editing' : '',
                                    props.rowData.highlight ? 'highlight' : '',
                                    checkOverlapping(props.rowData) ? 'overlapping' : '',
                                ]
                                    .join(' ')
                                    .trim()}
                                style={props.style}
                            >
                                <div className="row" style={{ width: 50 }}>
                                    {props.index + 1}
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <span className="noedit">{props.rowData.start}</span>
                                    <input
                                        maxLength={20}
                                        className="input edit"
                                        defaultValue={subtitle.start}
                                        onChange={e => this.onChange('start', e.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <span className="noedit">{props.rowData.end}</span>
                                    <input
                                        maxLength={20}
                                        className="input edit"
                                        defaultValue={subtitle.end}
                                        onChange={e => this.onChange('end', e.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ width: 100 }}>
                                    <span className="noedit">{props.rowData.duration}</span>
                                    <input
                                        disabled
                                        maxLength={20}
                                        className="input edit"
                                        defaultValue={subtitle.duration}
                                        onChange={e => this.onChange('duration', e.target.value)}
                                    />
                                </div>
                                <div className="row" style={{ flex: 1 }}>
                                    <span className="noedit">
                                        {props.rowData.text.split(/\r?\n/).map((item, index) => (
                                            <p key={index}>{escapeHTML(item)}</p>
                                        ))}
                                    </span>
                                    <textarea
                                        maxLength={100}
                                        className="textarea edit"
                                        value={unescapeHTML(subtitle.text || '')}
                                        onChange={e => this.onChange('text', e.target.value)}
                                    />
                                </div>
                                <div className="row operation" style={{ width: 90 }}>
                                    <i className="icon-pencil noedit" onClick={() => this.onEdit(props.rowData)}></i>
                                    <i className="icon-ok edit" onClick={() => this.onUpdate(props.rowData)}></i>
                                    <i className="icon-trash-empty" onClick={() => this.onRemove(props.rowData)}></i>
                                </div>
                            </div>
                        );
                    }}
                ></Table>
            </Wrapper>
        );
    }
}
