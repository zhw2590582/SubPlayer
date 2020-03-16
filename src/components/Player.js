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

export default function({ video = '/sample.mp4', subtitle = '/sample.vtt', poster = '/sample.jpg' }) {
    return (
        <Player>
            {video ? (
                <ArtplayerComponent
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    option={{
                        url: video,
                        poster,
                        loop: true,
                        autoSize: true,
                        subtitle: {
                            url: subtitle,
                        },
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
                        },
                    }}
                    getInstance={art => {
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
