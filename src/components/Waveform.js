import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    z-index: 3;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    transition: all 0.2s ease;
`;

export default class Waveform extends React.Component {
    state = {
        $waveform: React.createRef(),
        wavesurfer: null,
        videoUrl: '',
    };

    static getDerivedStateFromProps(props, state) {
        const $waveform = state.$waveform.current;
        if (props.videoUrl && props.videoUrl !== state.videoUrl && $waveform) {
            if (state.wavesurfer) {
                state.wavesurfer.destroy();
            }

            const wavesurfer = WaveSurfer.create({
                container: $waveform,
                height: 150,
                cursorColor: 'rgba(255, 255, 255, 0)',
                waveColor: 'rgba(255, 255, 255, 0.2)',
                progressColor: 'rgba(255, 255, 255, 0.5)',
            });

            wavesurfer.load(props.videoUrl);

            setTimeout(() => {
                wavesurfer.seekTo(0.5);
            }, 1000);

            return {
                wavesurfer,
                videoUrl: props.videoUrl,
            };
        }

        return null;
    }

    render() {
        return <Wrapper ref={this.state.$waveform}></Wrapper>;
    }
}
