import React from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';

const Player = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #000;
    opacity: 0;
`;

let lastArt = null;
export default function({ videoUrl = '/sample.mp4', subtitleUrl = '/sample.vtt' }) {
    return (
        <Player>
            {videoUrl ? (
                <ArtplayerComponent
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    option={{
                        url: videoUrl,
                        poster: '/sample.jpg',
                        loop: true,
                        autoSize: true,
                        subtitle: {
                            url: subtitleUrl,
                        },
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
                        },
                    }}
                    getInstance={art => {
                        lastArt = art;
                        (function loop() {
                            window.requestAnimationFrame(() => {
                                if (art.playing) {
                                    //
                                }
                                loop();
                            });
                        })();

                        art.on('seek', () => {
                            //
                        });
                    }}
                />
            ) : null}
        </Player>
    );
}
