import React from 'react';
import styled from 'styled-components';
import ReactFlowPlayer from "react-flow-player";
import ArtplayerComponent from 'artplayer-react';

const Player = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 75%;
    width: 100%;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    & > div {
        width: 49%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .art-video-player, .flowplayer {
        height: 100%!important;
    }
`;
let fPlayer = null
let aPlayer = null

function flowPlayerActive() {
    aPlayer.pause = true
    fPlayer.seekTo(aPlayer.currentTime / 10)
}
function artPlayerActive() {
    fPlayer.stop()
    aPlayer.seek = fPlayer.video.time
}

export default React.memo(
    function({ options, setPlayer, setCurrentTime }) {
        return (
            <Player>
                <ArtplayerComponent
                    style={{
                        width: '49%',
                        height: '100%',
                    }}
                    option={{
                        url: options.videoUrl,
                        loop: false,
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
                        aPlayer = art;

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

                        art.on('play', () => {
                          artPlayerActive()
                        });

                        art.on('video:canplay', function(event) {
                          setTimeout(()=> {
                            let flowPlayerVideo = document.querySelector("#reactFlowPlayer video")
                            if (flowPlayerVideo)
                              flowPlayerVideo.setAttribute('src', event.target.src);
                          }, 500)
                        });
                    }}
                />
                <ReactFlowPlayer
                    playerInitScript="http://releases.flowplayer.org/7.2.1/flowplayer.min.js"
                    playerId="reactFlowPlayer"
                    sources={[
                        {
                          type: "video/webm",
                          src: options.videoUrl
                        }
                    ]}
                    video={{
                        src: options.videoUrl
                    }}
                    speedPlugin={ true }
                    speeds={[1, 5, 10]}
                    onResume={() => { flowPlayerActive() }}
                    getPlayerApi={player => {
                        fPlayer = player
                        fPlayer.on('pause', () => {
                            artPlayerActive()
                        });
                    }}
                />
            </Player>
        );
    },
    () => true,
);
