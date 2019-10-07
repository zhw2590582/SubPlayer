import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
`;

export default class Waveform extends React.Component {
    state = {
        $waveform: React.createRef(),
        wavesurfer: null,
        videoUrl: '',
        mainWidth: 0,
    };

    static getDerivedStateFromProps(props, state) {
        const $waveform = state.$waveform.current;
        if (!$waveform || !props.videoUrl) return null;

        function drawWaveform() {
            if (state.wavesurfer) {
                state.wavesurfer.destroy();
            }

            const wavesurfer = WaveSurfer.create({
                height: 150,
                fillParent: false,
                responsive: true,
                minPxPerSec: props.grid * 10,
                container: $waveform,
                cursorColor: 'rgba(255, 255, 255, 0)',
                waveColor: 'rgba(255, 255, 255, 0.1)',
                progressColor: 'rgba(255, 255, 255, 0.1)',
            });

            wavesurfer.load(props.videoUrl);

            return {
                wavesurfer,
                videoUrl: props.videoUrl,
                mainWidth: props.mainWidth,
            };
        }

        // if (state.wavesurfer && props.art) {
        //     state.wavesurfer.seekTo(props.art.currentTime / props.art.duration || 0);
        // }

        if (props.mainWidth !== state.mainWidth) {
            return drawWaveform();
        }

        if (props.videoUrl !== state.videoUrl) {
            return drawWaveform();
        }

        return null;
    }

    render() {
        const left = -(Math.floor(this.props.currentTime / 10) * this.props.grid * 100) + this.props.grid * 5;
        return (
            <Wrapper
                style={{
                    transform: `translate(${left}px)`,
                }}
                ref={this.state.$waveform}
            ></Wrapper>
        );
    }
}
