import React from 'react';
import styled from 'styled-components';
import ArtplayerComponent from 'artplayer-react';
import './css/player.css';
import { timeToDuration, durationToTime }  from '../waveform/utils';

const Player = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.2);
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
                            style: {
                                color: '#f9fed6',
                                backgroundColor : 'rgba(0, 0, 0, 0.4)',
                                fontSize: '1.5rem'
                            }
                        },
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
                            preload: 'auto',
                        },
                    }}
                    getInstance={art => {
                        console.log('art',art.currentTime)
                        setPlayer(art);

                        (function loop() {
                            window.requestAnimationFrame(() => {

                                 //console.log('request frame', art.currentTime)
                               // console.log('loop end', window.loopEnd)
                                //console.log('lopp start', window.loopStart)

                                if (window.loopEnd === null && window.loopStart === null){
                                if (art.playing) {
                                    setCurrentTime(art.currentTime);
                                }
                            }

                              
                                if(window.loopEnd !== null){
                               // console.log(timeToDuration(window.loopEnd) )
                               // console.log(durationToTime(window.loopEnd) )
                               // console.log(window.loopEnd) 
                                
                                if(art.currentTime > timeToDuration(window.loopEnd)){
                                    art.currentTime = timeToDuration(window.loopStart);
                                }
                                }
                                loop();
                            });
                        })();

                       
                        art.on('seek', () => {
                            if (window.loopEnd === null && window.loopStart === null){
                                setCurrentTime(art.currentTime);
                            }
                        
                        //    console.log('loop end', window.loopEnd)
                        //         console.log('lopp start', window.loopStart)
                        });
                    }}
                />
            </Player>
        );
    },
    () => true,
);
