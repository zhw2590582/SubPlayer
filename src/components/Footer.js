import React from 'react';
import styled from 'styled-components';

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    height: 200px;

    .timeline-header {
        display: flex;
        align-items: center;
        height: 35px;
        color: #fff;
        padding: 0 10px;
        font-size: 12px;
        border-bottom: 1px solid #000;
        background-color: #232740;
    }

    .timeline-body {
        flex: 1;
    }
`;

export default function() {
    return (
        <Footer>
            <div className="timeline-header">时间</div>
            <div className="timeline-body">1</div>
        </Footer>
    );
}
