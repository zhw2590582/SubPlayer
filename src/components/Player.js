import React from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';
import Toolset from './Toolset';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const VideoBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70%;
    padding: 10px;
    border-bottom: 1px solid rgb(10, 10, 10);

    .artplayer-video-player .artplayer-subtitle {
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.5);
    }
`;

export default class Player extends React.Component {
    state = {
        art: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (state.art) {
            const $video = state.art.template.$video;
            const $track = state.art.template.$track;
            const videoUrl = $video.src;
            const subtitleUrl = $track ? $track.src : '';
            if (props.videoUrl !== videoUrl) {
                const file = document.querySelector('.uploadVideo').files[0];
                state.art.player.switchUrl(props.videoUrl, file ? file.name : '');
                URL.revokeObjectURL(videoUrl);
            }

            if (props.subtitleUrl !== subtitleUrl) {
                state.art.subtitle.init(props.subtitleUrl);
                URL.revokeObjectURL(subtitleUrl);
            }
        }
        return null;
    }

    render() {
        const { videoUrl, subtitleUrl, updateCurrentTime, getArt } = this.props;
        return (
            <Wrapper>
                <VideoBox>
                    {videoUrl ? (
                        <ArtplayerComponent
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            option={{
                                url: videoUrl,
                                loop: true,
                                lang: 'en',
                                autoSize: true,
                                subtitle: {
                                    url: subtitleUrl,
                                },
                                moreVideoAttr: {
                                    crossOrigin: 'anonymous',
                                },
                            }}
                            getInstance={art => {
                                (function loop() {
                                    window.requestAnimationFrame(() => {
                                        if (art.playing) {
                                            updateCurrentTime(art.currentTime);
                                        }
                                        loop();
                                    });
                                })();

                                art.on('ready', () => {
                                    setTimeout(() => {
                                        art.player.seek = 1;
                                    }, 1000);
                                });

                                art.on('seek', () => {
                                    updateCurrentTime(art.currentTime);
                                });

                                this.setState({
                                    art,
                                });

                                getArt(art);
                            }}
                        />
                    ) : null}
                </VideoBox>
                <Toolset {...this.props} />
            </Wrapper>
        );
    }
}
