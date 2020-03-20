import React from 'react';
import styled from 'styled-components';
import i18n from '../i18n';
import Upload from './Upload';
import Help from './Help';
import Donate from './Donate';
import Dialog from './Dialog';
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
    font-size: 22px;
    height: 100%;
    cursor: pointer;
    padding: 0 15px;
    color: rgba(255, 255, 255, 1);
    transition: all 0.2s ease 0s;
    border-right: 1px solid rgb(0, 0, 0);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
    text-decoration: none;

    &:hover {
        background-color: #2196f3;
    }
`;

const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    height: 100%;
    cursor: pointer;
    padding: 0 25px;
    color: rgba(255, 255, 255, 1);
    transition: all 0.2s ease 0s;
    border-right: 1px solid rgb(0, 0, 0);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);

    &:hover {
        background-color: #2196f3;
    }

    i {
        margin-right: 5px;
    }
`;

const I18n = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    height: 100%;
    padding: 0 10px;
    color: rgba(255, 255, 255, 1);
    border-left: 1px solid rgb(0, 0, 0);
    background-color: rgb(26, 83, 109);

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
                <Logo href="/">
                    <i className="icon-cc"></i>
                </Logo>
                <Menu onClick={() => props.setOption({ uploadDialog: true })}>
                    <i className="icon-upload"></i> Open
                </Menu>
                <Menu onClick={() => downloadFile(vttToUrl(subToVtt(props.subtitles)), `${Date.now()}.vtt`)}>
                    <i className="icon-download"></i> Save
                </Menu>
                <Menu onClick={() => props.undoSubtitles()}>
                    <i className="icon-ccw"></i> Undo
                </Menu>
                <Menu
                    onClick={() => {
                        if (window.confirm('This step cannot be rolled back. Are you sure ?')) {
                            props.cleanSubtitles();
                        }
                    }}
                >
                    <i className="icon-trash-empty"></i> Clear
                </Menu>
                <Menu onClick={() => props.setOption({ helpDialog: true })}>
                    <i className="icon-help-circled"></i> Help
                </Menu>
                <Menu onClick={() => props.setOption({ donateDialog: true })}>
                    <i className="icon-money"></i> Donate
                </Menu>
                <Menu onClick={() => window.open('https://github.com/zhw2590582/SubPlayer')}>
                    <i className="icon-github"></i> Github
                </Menu>
            </Left>
            <Right>
                <I18n>
                    <i className="icon-language"></i>
                    <select value={props.language} onChange={event => props.updateLang(event.target.value)}>
                        {Object.keys(i18n).map(key => (
                            <option key={key} value={key}>
                                {key.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </I18n>
            </Right>
            {props.options.uploadDialog ? (
                <Dialog title="Open" onClose={() => props.setOption({ uploadDialog: false })}>
                    <Upload {...props} />
                </Dialog>
            ) : null}
            {props.options.helpDialog ? (
                <Dialog title="Help" onClose={() => props.setOption({ helpDialog: false })}>
                    <Help {...props} />
                </Dialog>
            ) : null}
            {props.options.donateDialog ? (
                <Dialog title="Donate" onClose={() => props.setOption({ donateDialog: false })}>
                    <Donate {...props} />
                </Dialog>
            ) : null}
        </Header>
    );
}
