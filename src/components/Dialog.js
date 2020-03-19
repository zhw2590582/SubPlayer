import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Dialog = styled.div`
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);

    .inner {
        min-height: 100px;
        background-color: #1f2133;
        opacity: 0;
        margin-top: -10px;
        transition: all 0.2s ease 0s;

        &.active {
            opacity: 1;
            margin-top: 0;
        }
    }
`;

export default function(props) {
    const [activeName, setActiveName] = useState('');

    useEffect(() => {
        setTimeout(() => setActiveName('active'), 200);
    }, []);

    return (
        <Dialog onClick={() => props.onClose()}>
            <div
                style={{ width: props.width || 500 }}
                className={`inner ${activeName}`}
                onClick={event => event.stopPropagation()}
            >
                {props.children}
            </div>
        </Dialog>
    );
}
