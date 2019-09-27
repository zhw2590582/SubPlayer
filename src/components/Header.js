import React from 'react';
import styled from 'styled-components';
import { t, Translate } from 'react-i18nify';
import toastr from 'toastr';
import NProgress from 'nprogress';
import { readSubtitleFromFile, urlToArr, vttToUrl, getExt } from '../utils';
import { version } from '../../package.json';

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

        .links {
            margin-right: 20px;
            a {
                color: #ccc;
                text-decoration: none;
                margin-left: 20px;

                &:hover {
                    color: #fff;
                }
            }
        }
    }
`;

const Logo = styled.a`
    color: #fff;
    font-size: 16px;
    text-decoration: none;

    .beta {
        color: #67bf00;
        font-size: 12px;
    }
`;

const Description = styled.span`
    font-size: 13px;
    font-style: italic;
    padding-left: 20px;
    opacity: 0.4;
`;

const Btn = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 10px;
    width: 150px;
    border-left: 1px solid #000;
    cursor: pointer;
    overflow: hidden;
    color: #ccc;
    background-color: rgb(39, 41, 54);
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: rgb(51, 54, 76);
    }

    i {
        margin-right: 5px;
    }
`;

const File = styled.input`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
`;

const Lang = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    color: #ccc;
    background: #1a536d;
    width: 60px;
    padding: 5px 0;
    font-size: 12px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
        margin-right: 5px;
    }

    span {
        display: none;
    }

    &.lang-zh .en {
        display: block;
    }

    &.lang-en .zh {
        display: block;
    }

    &:hover {
        color: #fff;
        background: #03a9f4;
    }
`;

export default class Header extends React.Component {
    $subtitle = React.createRef();
    $video = React.createRef();

    uploadSubtitle() {
        if (this.$subtitle.current && this.$subtitle.current.files[0]) {
            NProgress.start().set(0.5);
            const file = this.$subtitle.current.files[0];
            const type = getExt(file.name);
            if (['vtt', 'srt', 'ass'].includes(type)) {
                readSubtitleFromFile(file, type)
                    .then(data => {
                        const subtitleUrl = vttToUrl(data);
                        urlToArr(subtitleUrl).then(subtitles => {
                            this.props.updateSubtitles(subtitles, true).then(() => {
                                toastr.success(t('uploadSubtitle'));
                                NProgress.done();
                            });
                        });
                    })
                    .catch(error => {
                        toastr.error(error.message);
                        NProgress.done();
                        throw error;
                    });
            } else {
                NProgress.done();
                toastr.error(t('uploadSubtitleErr'));
            }
        }
    }

    uploadVideo() {
        if (this.$video.current && this.$video.current.files[0]) {
            NProgress.start().set(0.5);
            const file = this.$video.current.files[0];
            const $video = document.createElement('video');
            const canPlayType = $video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                this.props.updateVideoUrl(url);
                toastr.success(t('uploadVideo'));
            } else {
                toastr.error(`${t('uploadVideoErr')}: ${file.type}`);
            }
            NProgress.done();
        }
    }

    render() {
        return (
            <Wrapper>
                <div className="left">
                    <Logo href="./">
                        SubPlayer.js <span className="beta">Beta {version}</span>
                    </Logo>
                    <Description>
                        <Translate value="description" />
                    </Description>
                </div>
                <div className="right">
                    <div className="links">
                        <a href="https://github.com/zhw2590582/SubPlayer">Github</a>
                    </div>
                    <Lang
                        className={`lang-${this.props.lang}`}
                        onClick={() => {
                            this.props.setLocale(this.props.lang === 'zh' ? 'en' : 'zh');
                        }}
                    >
                        <i className="icon-language"></i>
                        <span className="zh">中</span>
                        <span className="en">EN</span>
                    </Lang>
                    <Btn>
                        <i className="icon-upload"></i>
                        <Translate value="btnUploadSubtitle" />
                        <File type="file" name="file" ref={this.$subtitle} onChange={this.uploadSubtitle.bind(this)} />
                    </Btn>
                    <Btn>
                        <i className="icon-upload"></i>
                        <Translate value="btnUploadVideo" />
                        <File type="file" name="file" ref={this.$video} onChange={this.uploadVideo.bind(this)} />
                    </Btn>
                    <Btn onClick={this.props.downloadSubtitles.bind(this)}>
                        <i className="icon-download"></i>
                        <Translate value="btnDownloadSubtitle" />
                    </Btn>
                </div>
            </Wrapper>
        );
    }
}
