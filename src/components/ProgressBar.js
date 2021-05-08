import React from 'react';
import styled from 'styled-components';

const Style = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    height: 3px;

    .inner {
        height: 100%;
        background-color: #f00;
    }
`;

export default function Component({ processing }) {
    return (
        <Style>
            <div className="inner" style={{ width: `${processing}%` }}></div>
        </Style>
    );
}
