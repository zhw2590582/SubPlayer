import React from 'react';
import styled from 'styled-components';
import { version } from '../../package.json';
import i18n from '../i18n';

const Header = styled.div`
    position: relative;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    background-color: #30324a;
    border-bottom: 1px solid #000;
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

const Logo = styled.a`
    font-size: 14px;
    line-height: 1;
    padding: 0 10px;
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    margin-right: 10px;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
`;

const Ver = styled.span`
    margin-left: 10px;
    font-size: 12px;
    color: rgb(103, 191, 0);
`;

const Desc = styled.span`
    font-size: 12px;
    line-height: 1;
    color: rgba(255, 255, 255, 0.5);
`;

const Menu = styled.div`
    font-size: 12px;
    line-height: 1;
    padding: 7px 10px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 2px;
    color: rgba(255, 255, 255, 1);
    background-color: rgb(9, 113, 241);
    transition: all 0.2s ease 0s;

    &:hover {
        background-color: rgb(91, 148, 255);
    }

    i {
        margin-right: 5px;
    }
`;

const I18n = styled.div`
    display: flex;
    color: #fff;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    border-left: 1px solid #1f2133;
    background-color: rgb(26, 83, 109);

    i {
        margin-right: 5px;
    }

    select {
        outline: none;
    }
`;

export default function() {
    return (
        <Header>
            <Left>
                <Logo href="/">
                    SubPlayer<Ver>{version}</Ver>
                </Logo>
                <Desc>A Online Subtitle Editor: vtt、srt、ass</Desc>
            </Left>
            <Right>
                <Menu>
                    <i className="icon-upload"></i>Open
                </Menu>
                <Menu>
                    <i className="icon-download"></i>Save
                </Menu>
                <I18n>
                    <i className="icon-language"></i>
                    <select>
                        {Object.keys(i18n).map(key => (
                            <option key={key} value={key}>
                                {key.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </I18n>
            </Right>
        </Header>
    );
}
