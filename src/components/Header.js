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
    border-bottom: 1px solid rgb(10, 10, 10);
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
        margin-left: 5px;
    }
`;

const Description = styled.span`
    font-size: 12px;
    font-style: italic;
    margin-left: 10px;
    opacity: 0.4;
`;

const Btn = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 170px;
    cursor: pointer;
    overflow: hidden;
    color: #ccc;
    background-color: rgb(46, 54, 60);
    border-left: 1px solid rgb(10, 10, 10);
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: rgb(66, 82, 95);
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

const Lang = styled.select`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    margin-right: 20px;
    color: #ccc;
    border: none;
    background-color: #1a536d;
    width: 45px;
    padding: 4px 0;
    font-size: 12px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: #03a9f4;
    }
`;

export default class Header extends React.Component {
    state = {
        lang: this.props.getLocale() || 'en',
        translators: {
            zh:
                {
                    name: '中', key: 'chinese'
                }
            ,
            en:
                {
                    name: 'EN', key: 'english'
                }
            ,
            es:
                {
                    name: 'ES', key: 'spanish'
                }
            ,
        },
    };
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
                        urlToArr(subtitleUrl)
                            .then(subtitles => {
                                this.props.updateSubtitles(subtitles, true).then(() => {
                                    toastr.success(`${t('uploadSubtitle')}: ${subtitles.length}`);
                                    NProgress.done();
                                });
                            })
                            .catch(error => {
                                toastr.error(error.message);
                                NProgress.done();
                                throw error;
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
                toastr.success(`${t('uploadVideo')}: ${(file.size / 1024 / 1024).toFixed(3)}M`);
            } else {
                toastr.error(`${t('uploadVideoErr')}: ${file.type || 'unknown'}`);
            }
            NProgress.done();
        }
    }

    render() {
        return (
            <Wrapper>
                <div className="left">
                    <Logo href="./">
                        SubPlayer <span className="beta">Beta {version}</span>
                        <Description>
                            <Translate value="description" />
                        </Description>
                    </Logo>
                </div>
                <div className="right">
                    <div className="links">
                        <a href="https://github.com/zhw2590582/SubPlayer">Github</a>
                    </div>
                    <i className="icon-language"></i>
                    <Lang
                        value={this.state.lang}
                        className={`lang-${this.props.lang}`}
                        onChange={event => {
                            this.setState({ lang: event.target.value });
                            this.props.setLocale(event.target.value);
                        }}
                    >
                        {Object.entries(this.state.translators).map(([key, item]) =>
                            <option key={key} value={key}>
                                 {item.name}
                            </option>
                        )}
                    </Lang>
                    <Btn>
                        <i className="icon-upload"></i>
                        <Translate value="btnUploadSubtitle" />
                        <File className="uploadSubtitle" type="file" name="file" ref={this.$subtitle} onChange={() => this.uploadSubtitle()} />
                    </Btn>
                    <Btn>
                        <i className="icon-upload"></i>
                        <Translate value="btnUploadVideo" />
                        <File className="uploadVideo" type="file" name="file" ref={this.$video} onChange={() => this.uploadVideo()} />
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
