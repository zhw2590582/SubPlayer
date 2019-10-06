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
    transition: all 0.2s ease;
`;

export default class Waveform extends React.Component {
    state = {
        $waveform: React.createRef(),
        wavesurfer: null,
        videoUrl: '',
    };

    static getDerivedStateFromProps(props, state) {
        if (state.wavesurfer && props.art) {
            state.wavesurfer.seekTo(props.art.currentTime / props.art.duration || 0);
        }

        const $waveform = state.$waveform.current;
        if (props.videoUrl && props.videoUrl.startsWith('blob:') && props.videoUrl !== state.videoUrl && $waveform) {
            if (state.wavesurfer) {
                state.wavesurfer.destroy();
            }

            const wavesurfer = WaveSurfer.create({
                height: 150,
                container: $waveform,
                cursorColor: 'rgba(255, 255, 255, 0)',
                waveColor: 'rgba(255, 255, 255, 0.1)',
                progressColor: 'rgba(255, 255, 255, 0.2)',
            });

            wavesurfer.load(props.videoUrl);

            wavesurfer.on('ready', () => {
                //
            });

            return {
                wavesurfer,
                videoUrl: props.videoUrl,
            };
        }

        return null;
    }

    render() {
        return (
            <Wrapper
                style={{
                    width: this.props.mainWidth - this.props.grid * 10,
                    left: this.props.grid * 5,
                }}
                ref={this.state.$waveform}
            ></Wrapper>
        );
    }
}
