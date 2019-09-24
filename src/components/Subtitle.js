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

    .icon-trash-empty {
        cursor: pointer;
        color: #b30303;
        font-size: 16px;
    }
`;

export default function Subtitle({ subtitle }) {
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
                        <th width="70">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {subtitle.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.start}</td>
                            <td>{item.end}</td>
                            <td>{item.duration}</td>
                            <td>{item.text}</td>
                            <td>
                                <i className="icon-trash-empty"></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Wrapper>
    );
}
