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

    .artplayer-video-player .artplayer-subtitle p {
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
            const currentTime = state.art.currentTime;
            if (props.videoUrl !== videoUrl) {
                state.art.player.switchUrl(props.videoUrl);
                URL.revokeObjectURL(videoUrl);
            }
            if (props.subtitleUrl !== subtitleUrl) {
                state.art.subtitle.init(props.subtitleUrl);
            }
            if (!state.art.playing && props.currentTime !== currentTime) {
                state.art.currentTime = props.currentTime;
            }
        }
        return null;
    }

    render() {
        return (
            <Wrapper>
                <VideoBox>
                    {this.props.videoUrl ? (
                        <ArtplayerComponent
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            option={{
                                url: this.props.videoUrl,
                                loop: true,
                                subtitle: {
                                    url: this.props.subtitleUrl,
                                },
                            }}
                            getInstance={art => {
                                art.on('video:timeupdate', () => {
                                    if (art.playing) {
                                        this.props.updateCurrentTime(art.currentTime);
                                    }
                                });

                                this.setState({
                                    art,
                                });

                                this.props.getArt(art);
                            }}
                        />
                    ) : null}
                </VideoBox>
                <Toolset {...this.props} />
            </Wrapper>
        );
    }
}
