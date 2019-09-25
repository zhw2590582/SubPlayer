import React from 'react';
import styled from 'styled-components';
import toastr from 'toastr';
import NProgress from 'nprogress';
import { readSubtitleFromFile, urlToArr, vttToUrl } from '../utils';

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
    border-left: 1px solid #000;
    cursor: pointer;
    overflow: hidden;
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

export default class Header extends React.Component {
    $subtitle = React.createRef();
    $video = React.createRef();

    uploadSubtitle() {
        if (this.$subtitle.current && this.$subtitle.current.files[0]) {
            NProgress.start();
            const file = this.$subtitle.current.files[0];
            const type = file.name
                .split('.')
                .pop()
                .toLowerCase();
            if (type === 'vtt' || type === 'srt' || type === 'ass') {
                readSubtitleFromFile(file, type)
                    .then(data => {
                        const subtitleUrl = vttToUrl(data);
                        this.props.updateSubtitleUrl(subtitleUrl);
                        urlToArr(subtitleUrl).then(subtitles => {
                            this.props.updateSubtitles(subtitles);
                            NProgress.done();
                        });
                    })
                    .catch(error => {
                        toastr.error(error.message);
                        NProgress.done();
                        throw error;
                    });
            } else {
                NProgress.done();
                toastr.error('Only the following subtitle formats are supported: .vtt, .srt, .ass');
            }
        }
    }

    uploadVideo() {
        if (this.$video.current && this.$video.current.files[0]) {
            NProgress.start();
            const file = this.$video.current.files[0];
            const $video = document.createElement('video');
            const canPlayType = $video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                this.props.updateVideoUrl(url);
            } else {
                toastr.error(`This video format is not supported: ${file.type}`);
            }
            NProgress.done();
        }
    }

    render() {
        return (
            <Wrapper>
                <div className="left">
                    <Logo href="./">SubPlayer.js</Logo>
                    <Description>Online Subtitle Maker</Description>
                </div>
                <div className="right">
                    <div className="links">
                        <a href="https://github.com/zhw2590582/SubPlayer">Github</a>
                    </div>
                    <Btn>
                        <i className="icon-upload"></i> Upload Subtitle
                        <File type="file" name="file" ref={this.$subtitle} onChange={this.uploadSubtitle.bind(this)} />
                    </Btn>
                    <Btn>
                        <i className="icon-upload"></i>Upload Video
                        <File type="file" name="file" ref={this.$video} onChange={this.uploadVideo.bind(this)} />
                    </Btn>
                    <Btn onClick={this.props.downloadSubtitles.bind(this)}>
                        <i className="icon-download"></i>Download Subtitle
                    </Btn>
                </div>
            </Wrapper>
        );
    }
}
