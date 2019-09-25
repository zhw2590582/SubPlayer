import React from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';
import 'artplayer-react/dist/artplayer-react.css';

const Wrapper = styled.div`
    flex: 1;
`;

const VideoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70%;
    padding: 20px;
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
            const videoUrl = state.art.option.url;
            const subtitleUrl = state.art.template.$track.src;
            if (props.videoUrl !== videoUrl) {
                state.art.player.switchUrl(props.videoUrl);
            }
            if (props.subtitleUrl !== subtitleUrl) {
                state.art.template.$subtitle.innerHTML = '';
                state.art.subtitle.init(props.subtitleUrl);
            }
        }
        return null;
    }

    render() {
        return (
            <Wrapper>
                <VideoWrapper>
                    {this.props.videoUrl && this.props.subtitleUrl ? (
                        <ArtplayerComponent
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            option={{
                                url: this.props.videoUrl,
                                subtitle: {
                                    url: this.props.subtitleUrl,
                                },
                            }}
                            getInstance={art => {
                                art.on('video:timeupdate', () => {
                                    this.props.updateCurrentTime(art.currentTime);
                                });

                                this.setState({
                                    art,
                                });
                            }}
                        />
                    ) : null}
                </VideoWrapper>
            </Wrapper>
        );
    }
}
