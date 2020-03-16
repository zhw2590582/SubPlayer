import React, { useState } from 'react';
import styled from 'styled-components';
import toastr from 'toastr';
import { t } from 'react-i18nify';
import NProgress from 'nprogress';
import { readSubtitleFromFile, urlToArr, vttToUrl, getExt } from '../utils';

const Upload = styled.div`
    position: fixed;
    z-index: 9;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
`;

const Inner = styled.div`
    width: 500px;
    background-color: #1f2133;

    .item {
        padding: 10px 0;
        .title {
            color: #fff;
            font-size: 14px;
            padding: 5px 10px;
            border-left: 2px solid #03a9f4;
        }
        .centent {
            padding: 15px 10px;
            .upload {
                position: relative;
                margin-bottom: 10px;
                .input {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    outline: none;
                    border: none;
                    color: #fff;
                    background-color: #363952;
                }
                .file {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    line-height: 1;
                    height: 100%;
                    width: 100px;
                    color: #fff;
                    background-color: rgb(9, 113, 241);

                    input {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                    }
                }
            }
            .info {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                margin-bottom: 10px;
            }
            .option {
                font-size: 12px;
                label {
                    margin-right: 20px;
                    input {
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        height: 40px;
        cursor: pointer;
        background-color: rgb(9, 113, 241);
        transition: all 0.2s ease 0s;

        &:hover {
            background-color: rgb(91, 148, 255);
        }
    }
`;

export default function({ uploadOpen, setUpload, getOption }) {
    const [videoUrl, setVideoUrl] = useState('/sample.mp4');
    const [subtitleUrl, setSubtitleUrl] = useState('/sample.vtt');
    const [removeBlank, setRemoveBlank] = useState(false);
    const [audioWaveform, setAudioWaveform] = useState(false);
    const [subtitles, setSubtitles] = useState([]);

    function loadSubtitle(file) {
        if (file) {
            NProgress.start().set(0.5);
            const type = getExt(file.name);
            if (['vtt', 'srt', 'ass'].includes(type)) {
                readSubtitleFromFile(file, type)
                    .then(data => {
                        const url = vttToUrl(data);
                        urlToArr(url)
                            .then(subs => {
                                setSubtitles(subs);
                                setSubtitleUrl(url);
                                NProgress.done();
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

    function loadVideo(file) {
        if (file) {
            NProgress.start().set(0.5);
            const $video = document.createElement('video');
            const canPlayType = $video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                setVideoUrl(url);
                toastr.success(`${t('uploadVideo')}: ${file.name}`);
            } else {
                toastr.error(`${t('uploadVideoErr')}: ${file.type || 'unknown'}`);
            }
            NProgress.done();
        }
    }

    function confirm() {
        getOption({
            videoUrl,
            subtitleUrl,
            removeBlank,
            audioWaveform,
            subtitles,
        });
        setUpload(false);
    }

    return (
        <Upload onClick={() => setUpload(false)} style={{ display: uploadOpen ? 'flex' : 'none' }}>
            <Inner onClick={event => event.stopPropagation()}>
                <div className="item">
                    <div className="title">Upload Subtitle</div>
                    <div className="centent">
                        <div className="upload">
                            <input
                                value={subtitleUrl}
                                type="text"
                                className="input"
                                spellCheck="false"
                                placeholder="Upload from remote address or local file"
                                onChange={event => setSubtitleUrl(event.target.value)}
                            />
                            <div className="file">
                                Open
                                <input type="file" onChange={event => loadSubtitle(event.target.files[0])} />
                            </div>
                        </div>
                        <div className="info">Supports opening subtitles in vtt, srt and ass formats</div>
                        <div className="option">
                            <label>
                                <input
                                    value={removeBlank}
                                    type="checkbox"
                                    onChange={event => setRemoveBlank(event.target.checked)}
                                />
                                Remove blank lines
                            </label>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="title">Upload Video</div>
                    <div className="centent">
                        <div className="upload">
                            <input
                                value={videoUrl}
                                type="text"
                                className="input"
                                spellCheck="false"
                                placeholder="Upload from remote address or local file"
                                onChange={event => setVideoUrl(event.target.value)}
                            />
                            <div className="file">
                                Open
                                <input type="file" onChange={event => loadVideo(event.target.files[0])} />
                            </div>
                        </div>
                        <div className="info">Supports opening mp4, webm and ogg video</div>
                        <div className="option">
                            <label>
                                <input
                                    value={audioWaveform}
                                    type="checkbox"
                                    onChange={event => setAudioWaveform(event.target.checked)}
                                />
                                Generate audio waveform graph
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bottom" onClick={confirm}>
                    Confirm
                </div>
            </Inner>
        </Upload>
    );
}
