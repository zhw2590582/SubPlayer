import React from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';

const Player = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70%;
    width: 100%;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
`;

export default React.memo(
    function({ options, setPlayer, setCurrentTime }) {
        return (
            <Player>
                <ArtplayerComponent
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    option={{
                        url: options.videoUrl,
                        loop: true,
                        autoSize: true,
                        aspectRatio: true,
                        playbackRate: true,
                        fullscreen: true,
                        fullscreenWeb: true,
                        miniProgressBar: true,
                        subtitle: {
                            url: options.subtitleUrl,
                        },
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
                            preload: 'auto',
                        },
                    }}
                    getInstance={art => {
                        setPlayer(art);

                        (function loop() {
                            window.requestAnimationFrame(() => {
                                if (art.playing) {
                                    setCurrentTime(art.currentTime);
                                }
                                loop();
                            });
                        })();

                        art.on('seek', () => {
                            setCurrentTime(art.currentTime);
                        });

                        art.option.controls = [
                            {
                                position: 'right',
                                html: '0.5X',
                                click: function() {
                                    art.playbackRate = 0.5;
                                },
                            },
                            {
                                position: 'right',
                                html: '1X',
                                click: function() {
                                    art.playbackRate = 1;
                                },
                            },
                            {
                                position: 'right',
                                html: '1.5X',
                                click: function() {
                                    art.playbackRate = 1.5;
                                },
                            },
                            {
                                position: 'right',
                                html: '2X',
                                click: function() {
                                    art.playbackRate = 2;
                                },
                            }
                        ]
                    }}
                />
            </Player>
        );
    },
    () => true,
);
