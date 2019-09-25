import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import toastr from 'toastr';
import { checkTime } from '../utils';

const Wrapper = styled.div`
    flex: 1;
    border-right: 1px solid rgb(36, 41, 45);
    overflow-y: hidden;
    overflow-x: hidden;
    table {
        width: 100%;
        background: #24292d;

        tr {
            background: #1c2022;

            &.odd {
                background: #2e3140;
            }

            &.onhighlight {
                background-color: #2196f3;
            }

            th,
            td {
                text-align: center;
                padding: 10px;
            }

            .input,
            .textarea {
                border: none;
                padding: 5px;
                min-height: 30px;
                font-size: 13px;
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
    }

    .operation {
        display: flex;
        justify-content: center;

        i {
            width: 30px;
            cursor: pointer;
            font-size: 16px;
        }
    }

    .edit {
        display: none;
        width: 100%;
        height: 100%;
    }

    .onedit {
        .noedit {
            display: none;
        }

        .edit {
            display: block;
        }
    }
`;

export default class Subtitle extends React.Component {
    $scrollbars = React.createRef();

    state = {
        lastCurrentIndex: -1,
        editIndex: -1,
        editSubtitle: {},
        $scrollbars: this.$scrollbars,
    };

    static getDerivedStateFromProps(props, state) {
        if (state.$scrollbars.current && props.currentIndex !== state.lastCurrentIndex) {
            const $subtitle = state.$scrollbars.current.container.querySelector('.subtitleTable .onhighlight');
            if ($subtitle) {
                state.$scrollbars.current.scrollTop($subtitle.offsetTop);
            }
        }

        return {
            lastCurrentIndex: props.currentIndex,
        };
    }

    checkSubtitle() {
        const { editIndex, editSubtitle } = this.state;
        if (editIndex !== -1) {
            if (!checkTime(editSubtitle.start)) {
                toastr.error(`Start time format needs to match like: [00:00:00.000]`);
                return false;
            }
            if (!checkTime(editSubtitle.end)) {
                toastr.error(`End time format needs to match like: [00:00:00.000]`);
                return false;
            }
        }
        return true;
    }

    onEdit(index) {
        if (this.checkSubtitle()) {
            this.setState({
                editIndex: index,
                editSubtitle: {
                    ...this.props.subtitles[index],
                },
            });
            this.props.editSubtitle(index);
        }
    }

    onUpdate() {
        if (this.checkSubtitle()) {
            const { editIndex, editSubtitle } = this.state;
            this.props.updateSubtitle(editIndex, {
                ...editSubtitle,
            });
            this.setState({
                editIndex: -1,
                editSubtitle: {},
            });
        }
    }

    onChange(name, value) {
        this.setState({
            editSubtitle: {
                ...this.state.editSubtitle,
                [name]: value,
            },
        });
    }

    onRemove(index) {
        this.props.removeSubtitle(index);
        this.setState({
            editIndex: -1,
            editSubtitle: {},
        });
    }

    render() {
        const { subtitles } = this.props;
        const { editSubtitle } = this.state;
        return (
            <Wrapper>
                <Scrollbars ref={this.$scrollbars} style={{ height: '100%' }}>
                    <table border="0" cellSpacing="1" cellPadding="0" className="subtitleTable">
                        <thead>
                            <tr>
                                <th width="50">#</th>
                                <th width="120">Start</th>
                                <th width="120">End</th>
                                <th width="100">Duration</th>
                                <th>Text</th>
                                <th width="100">Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subtitles.map((item, index) => (
                                <tr
                                    key={index}
                                    className={[
                                        item.$edit ? 'onedit' : '',
                                        index % 2 === 0 ? 'even' : 'odd',
                                        item.$highlight ? 'onhighlight' : '',
                                    ]
                                        .join(' ')
                                        .trim()}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className="noedit">{item.start}</span>
                                        <input
                                            maxLength={20}
                                            className="input edit"
                                            defaultValue={editSubtitle.start}
                                            onChange={e => this.onChange('start', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <span className="noedit">{item.end}</span>
                                        <input
                                            maxLength={20}
                                            className="input edit"
                                            defaultValue={editSubtitle.end}
                                            onChange={e => this.onChange('end', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <span className="noedit">{item.duration}</span>
                                        <input
                                            disabled
                                            maxLength={20}
                                            className="input edit"
                                            defaultValue={editSubtitle.duration}
                                            onChange={e => this.onChange('duration', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <span className="noedit">
                                            {item.text.split(/\r?\n/).map((item, index) => (
                                                <p key={index}>{item}</p>
                                            ))}
                                        </span>
                                        <textarea
                                            maxLength={500}
                                            className="textarea edit"
                                            value={editSubtitle.text}
                                            onChange={e => this.onChange('text', e.target.value)}
                                        />
                                    </td>
                                    <td className="operation">
                                        <i className="icon-pencil noedit" onClick={() => this.onEdit(index)}></i>
                                        <i className="icon-ok edit" onClick={() => this.onUpdate(index)}></i>
                                        <i className="icon-trash-empty" onClick={() => this.onRemove(index)}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Scrollbars>
            </Wrapper>
        );
    }
}
