import React from 'react';
import styled from 'styled-components';
import i18n from '../i18n';
import Upload from './Upload';
import { downloadFile } from '../utils';
import { vttToUrl, subToVtt } from '../subtitle';

const Header = styled.div`
    position: relative;
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    background-color: #1f2133;
    border-bottom: 1px solid rgb(0, 0, 0);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 1;
    height: 100%;
    padding: 0 15px;
    margin-right: 15px;
    color: rgba(255, 255, 255, 0.8);
    border-right: 1px solid rgb(0, 0, 0);
    text-decoration: none;
`;

const Menu = styled.div`
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    padding: 5px 15px;
    margin-right: 15px;
    border-radius: 3px;
    color: rgba(255, 255, 255, 0.8);
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease 0s;

    &:hover {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(255, 255, 255, 0.2);
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
    background-color: rgb(9, 113, 241);

    i {
        margin-right: 5px;
    }

    select {
        outline: none;
    }
`;

export default function(props) {
    return (
        <Header>
            <Left>
                <Logo href="/">SubPlayer</Logo>
                <Menu onClick={() => props.setOption('uploadDialog', true)}>Open</Menu>
                <Menu onClick={() => downloadFile(vttToUrl(subToVtt(props.subtitles)), `${Date.now()}.vtt`)}>Save</Menu>
            </Left>
            <Right>
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
            <Upload {...props} />
        </Header>
    );
}
