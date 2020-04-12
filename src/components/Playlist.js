import React from 'react';
import styled from 'styled-components';
import NProgress from 'nprogress';
import {notify} from '../utils';
import {getSubFromVttUrl, getVtt, vttToUrl} from '../subtitle';
import {t, Translate} from 'react-i18nify';

const Playlist = styled.div`
    .playlist-item {
        cursor: pointer;
        padding: 5px;
        border-top: 1px solid #000;
        background-color: #1b1f2f;
        &:nth-child(2n) {
            background-color: rgb(35,40,64);
        }
        &:last-child {
            border-bottom: 1px solid #000;
        }
    }
    .item {
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
export default function ({player, options, setOption, updateSubtitles}) {

    async function openSubtitle(file) {
        if (file) {
            try {
                const vttText = await getVtt(file);
                if (vttText) {
                    const subtitleUrl = vttToUrl(vttText);
                    updateSubtitles(await getSubFromVttUrl(subtitleUrl));
                    player.subtitle.switch(subtitleUrl);
                    notify(t('open-subtitle-success'));
                    return subtitleUrl;
                } else {
                    notify(t('open-subtitle-error'), 'error');
                }
            } catch (error) {
                notify(error.message, 'error');
            }

        }
    }

    function openVideo(file) {
        if (file) {
            if (typeof file === 'string') {
                player.url = file;
                notify(t('open-video-success'));
                return file
            } else {
                const $video = document.createElement('video');
                const canPlayType = $video.canPlayType(file.type);
                if (canPlayType === 'maybe' || canPlayType === 'probably') {
                    const videoUrl = URL.createObjectURL(file);
                    player.url = videoUrl;
                    notify(t('open-video-success'));
                    return videoUrl;
                } else {
                    notify(t('open-video-error'), 'error');
                }
            }
        }
    }

    function itemClick(item) {
        NProgress.start().set(0.5);
        const videoUrl = openVideo(options.apiBaseUrl + item.video);
        const subtitleUrl = openSubtitle(options.apiBaseUrl + item.subtitles);

        setOption({
            playlistDialog: false,
            subtitleUrl: subtitleUrl,
            videoUrl: videoUrl,
        });
        NProgress.done();
    }

    return (
        <Playlist>
            <div className="item">
                <div className="title">
                    <Translate value="open-playlist-item"/>
                </div>
                <div>
                    {options.playlist.map((item) => {
                        return (<div className="playlist-item" key={item.video} onClick={() => itemClick(item)}>
                            <div><Translate value="playlist-video"/>: {item.video}</div>
                            <div><Translate value="playlist-subtitles"/>: {item.subtitles}</div>
                        </div>)
                    })}
                </div>
            </div>
        </Playlist>
    );
}
