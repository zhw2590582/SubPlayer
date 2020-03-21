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

    .dialog-inner {
        min-height: 200px;
        background-color: #1f2133;
        border-radius: 3px;
        overflow: hidden;
        opacity: 0;
        margin-top: -10px;
        transition: all 0.2s ease 0s;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);

        .dialog-title {
            position: relative;
            border-bottom: 1px solid #000;
            background-color: #2a2c3c;
            text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .dialog-cancel {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            opacity: 0.5;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }

        &.dialog-active {
            opacity: 1;
            margin-top: 0;
        }
    }
`;

export default function(props) {
    const [activeName, setActiveName] = useState('');

    useEffect(() => {
        setTimeout(() => setActiveName('dialog-active'), 100);
    }, []);

    return (
        <Dialog onClick={() => props.onClose()}>
            <div
                style={{ width: props.width || 500 }}
                className={`dialog-inner ${activeName}`}
                onClick={event => event.stopPropagation()}
            >
                <div className="dialog-title">
                    {props.title || 'Title'}{' '}
                    <i className="dialog-cancel icon-cancel" onClick={() => props.onClose()}></i>
                </div>
                <div className="dialog-content">{props.children}</div>
            </div>
        </Dialog>
    );
}
