import React from 'react';
import styled from 'styled-components';
import NProgress from 'nprogress';
import { notify } from '../utils';
import { getVtt, vttToUrl, getSubFromVttUrl } from '../subtitle';

const Upload = styled.div`
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
                    background-color: #2196f3;

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
                margin-bottom: 10px;
                label {
                    margin-right: 20px;
                    input {
                        margin-right: 5px;
                    }
                }
            }
            .warning {
                font-size: 12px;
                padding: 5px;
                color: #fff;
                background-color: #c75123;
            }
        }
    }
`;

export default function({ player, options, setOption, updateSubtitles }) {
    async function openSubtitle(file) {
        if (file) {
            NProgress.start().set(0.5);
            try {
                const vttText = await getVtt(file);
                if (vttText) {
                    const subtitleUrl = vttToUrl(vttText);
                    updateSubtitles(await getSubFromVttUrl(subtitleUrl));
                    player.subtitle.switch(subtitleUrl);
                    setOption('subtitleUrl', subtitleUrl);
                    notify('Open subtitles successfully');
                } else {
                    notify('Failed to open subtitles', 'error');
                }
            } catch (error) {
                notify(error.message, 'error');
            }
            NProgress.done();
        }
    }

    function openVideo(file) {
        if (file) {
            NProgress.start().set(0.5);
            if (typeof file === 'string') {
                player.url = file;
                setOption('videoUrl', file);
                notify('Open video successfully');
            } else {
                const $video = document.createElement('video');
                const canPlayType = $video.canPlayType(file.type);
                if (canPlayType === 'maybe' || canPlayType === 'probably') {
                    const videoUrl = URL.createObjectURL(file);
                    player.url = videoUrl;
                    setOption('videoUrl', videoUrl);
                    notify('Open video successfully');
                } else {
                    notify('Does not support playing the file', 'error');
                }
            }
            NProgress.done();
        }
    }

    return (
        <Upload>
            <div className="item">
                <div className="title">Open Subtitle</div>
                <div className="centent">
                    <div className="upload">
                        <input
                            value={options.subtitleUrl}
                            type="text"
                            className="input"
                            spellCheck="false"
                            placeholder="Open from remote address or local file"
                            onChange={event => openSubtitle(event.target.value)}
                        />
                        <div className="file">
                            Open
                            <input type="file" onChange={event => openSubtitle(event.target.files[0])} />
                        </div>
                    </div>
                    <div className="info">Supports opening subtitles in vtt, srt and ass formats</div>
                </div>
            </div>
            <div className="item">
                <div className="title">Open Video</div>
                <div className="centent">
                    <div className="upload">
                        <input
                            value={options.videoUrl}
                            type="text"
                            className="input"
                            spellCheck="false"
                            placeholder="Open from remote address or local file"
                            onChange={event => openVideo(event.target.value)}
                        />
                        <div className="file">
                            Open
                            <input type="file" onChange={event => openVideo(event.target.files[0])} />
                        </div>
                    </div>
                    <div className="info">Supports opening mp4, webm and ogg video</div>
                    <div className="option">
                        <label>
                            <input
                                checked={options.useAudioWaveform}
                                type="checkbox"
                                onChange={event => setOption('useAudioWaveform', event.target.checked)}
                            />
                            Generate audio waveform graph
                        </label>
                    </div>
                    <div className="warning">
                        When creating an audio waveform graph, The browser may be blocked for a short time due to audio
                        decoding, the larger the file, the more obvious it is.
                    </div>
                </div>
            </div>
        </Upload>
    );
}
