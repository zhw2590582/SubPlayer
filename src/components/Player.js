import React, { useEffect } from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';

const Player = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #000;
`;

export default React.memo(
    function({ options, player, setPlayer, setCurrentTime }) {
        useEffect(() => {
            if (player) {
                if (player.url !== options.videoUrl) {
                    player.url = options.videoUrl;
                }

                if (player.subtitle.url !== options.subtitleUrl) {
                    player.subtitle.switch(options.subtitleUrl);
                }
            }
        });

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
                        subtitle: {
                            url: options.subtitleUrl,
                        },
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
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
                    }}
                />
            </Player>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.options.videoUrl === nextProps.options.videoUrl &&
            prevProps.options.subtitleUrl === nextProps.options.subtitleUrl
        );
    },
);
