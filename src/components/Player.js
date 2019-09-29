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
    border-bottom: 1px solid rgb(36, 41, 45);

    .artplayer-video-player .artplayer-subtitle {
        background-color: rgba(0, 0, 0, 0.5);
    }
`;

export default class Player extends React.Component {
    state = {
        art: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (state.art) {
            const videoUrl = state.art.template.$video.src;
            const subtitleUrl = state.art.template.$track.src;
            if (props.videoUrl !== videoUrl) {
                state.art.player.switchUrl(props.videoUrl);
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

                                art.once('video:canplay', () => {
                                    art.player.currentTime = 1;
                                    updateCurrentTime(art.currentTime);
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
