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
    height: 400px;
    padding: 20px;

    video {
        height: 100%;
    }
`;

export default class Player extends React.Component {
    option = {
        url: 'https://zhw2590582.github.io/assets-cdn/video/one-more-time-one-more-chance-480p.mp4',
    };

    art = null;

    render() {
        return (
            <Wrapper>
                <VideoWrapper>
                    <ArtplayerComponent
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        option={this.option}
                        getInstance={art => {
                            this.art = art;
                        }}
                    />
                </VideoWrapper>
            </Wrapper>
        );
    }
}
