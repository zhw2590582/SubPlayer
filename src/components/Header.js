import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid rgb(36, 41, 45);
    background-color: rgb(28, 32, 34);

    .left {
        display: flex;
        align-items: center;
        height: 100%;
        padding-left: 20px;
    }

    .right {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const Logo = styled.a`
    color: #fff;
    font-size: 16px;
    text-decoration: none;
`;

const Description = styled.span`
    font-size: 13px;
    font-style: italic;
    padding-left: 20px;
    opacity: 0.4;
`;

const Btn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 10px;
    border-left: 1px solid #000;
    cursor: pointer;
    color: #ccc;
    background-color: rgb(39, 41, 54);

    &:hover {
        color: #fff;
        background-color: rgb(51, 54, 76);
    }

    i {
        margin-right: 5px;
    }
`;

export default function Header() {
    return (
        <Wrapper>
            <div className="left">
                <Logo href="./">SubPlayer.js</Logo>
                <Description>a visual online subtitle maker</Description>
            </div>
            <div className="right">
                <Btn>
                    <i className="icon-upload"></i> Upload Subtitle
                </Btn>
                <Btn>
                    <i className="icon-upload"></i>Upload Video
                </Btn>
                <Btn>
                    <i className="icon-download"></i>Download Subtitle
                </Btn>
            </div>
        </Wrapper>
    );
}
