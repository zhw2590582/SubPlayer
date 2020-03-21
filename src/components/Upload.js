import React from 'react';
import styled from 'styled-components';
import NProgress from 'nprogress';
import { notify } from '../utils';
import { getVtt, vttToUrl, getSubFromVttUrl } from '../subtitle';
import { t, Translate } from 'react-i18nify';

const Upload = styled.div`
    .item {
        margin-bottom: 20px;
        .title {
            color: #fff;
            font-size: 14px;
            padding: 5px 10px;
            margin-bottom: 10px;
            border-left: 2px solid #03a9f4;
        }
        .centent {
            padding: 0 10px;
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
            .warning {
                font-size: 12px;
                padding: 5px;
                color: #fff;
                background-color: rgba(199, 81, 35, 0.5);
                border: 1px solid rgba(199, 81, 35, 1);
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
                    setOption({ subtitleUrl, uploadDialog: false });
                    notify(t('open-subtitle-success'));
                } else {
                    notify(t('open-subtitle-error'), 'error');
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
                setOption({ videoUrl: file, uploadDialog: false });
                notify(t('open-video-success'));
            } else {
                const $video = document.createElement('video');
                const canPlayType = $video.canPlayType(file.type);
                if (canPlayType === 'maybe' || canPlayType === 'probably') {
                    const videoUrl = URL.createObjectURL(file);
                    player.url = videoUrl;
                    setOption({ videoUrl: videoUrl, uploadDialog: false });
                    notify(t('open-video-success'));
                } else {
                    notify(t('open-video-error'), 'error');
                }
            }
            NProgress.done();
        }
    }

    return (
        <Upload>
            <div className="item">
                <div className="title">
                    <Translate value="open-subtitle" />
                </div>
                <div className="centent">
                    <div className="upload">
                        <input
                            disabled
                            value={options.subtitleUrl}
                            type="text"
                            className="input"
                            spellCheck="false"
                            onChange={event => openSubtitle(event.target.value)}
                        />
                        <div className="file">
                            <Translate value="open" />
                            <input type="file" onChange={event => openSubtitle(event.target.files[0])} />
                        </div>
                    </div>
                    <div className="info">
                        <Translate value="open-subtitle-supports" />
                    </div>
                </div>
            </div>
            <div className="item">
                <div className="title">
                    <Translate value="open-video" />
                </div>
                <div className="centent">
                    <div className="upload">
                        <input
                            disabled
                            value={options.videoUrl}
                            type="text"
                            className="input"
                            spellCheck="false"
                            onChange={event => openVideo(event.target.value)}
                        />
                        <div className="file">
                            <Translate value="open" />
                            <input type="file" onChange={event => openVideo(event.target.files[0])} />
                        </div>
                    </div>
                    <div className="info">
                        <Translate value="open-video-supports" />
                    </div>
                    <div className="warning">
                        <Translate value="open-video-warning" />
                    </div>
                </div>
            </div>
        </Upload>
    );
}
