import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    flex: 1;
    border-right: 1px solid rgb(36, 41, 45);
    overflow-y: auto;
    table {
        width: 100%;
        background: #24292d;

        th,
        td {
            background: #1c2022;
            text-align: center;
            padding: 10px 0;
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
`;

export default class Subtitle extends React.Component {
    state = {};

    render() {
        const { subtitles, onRemove } = this.props;
        return (
            <Wrapper>
                <table border="0" cellSpacing="1" cellPadding="0">
                    <thead>
                        <tr>
                            <th width="50">#</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Duration</th>
                            <th>Text</th>
                            <th width="100">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subtitles.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.start}</td>
                                <td>{item.end}</td>
                                <td>{item.duration}</td>
                                <td>{item.text}</td>
                                <td className="operation">
                                    <i className="icon-edit"></i>
                                    <i className="icon-trash-empty" onClick={() => onRemove(index)}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Wrapper>
        );
    }
}
