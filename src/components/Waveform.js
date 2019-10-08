import React from 'react';
import styled from 'styled-components';
import wavesurfer from '../utils/wavesurfer';
import { debounce } from '../utils';
import { t } from 'react-i18nify';
import toastr from 'toastr';

const timelineHeight = 150;
const Canvas = styled.canvas`
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
    videoUrl = '';
    mainWidth = 0;
    canvasData = [];
    canvasIndex = 0;
    $waveform = React.createRef();
    getCanvasDataDebounce = debounce(this.getCanvasData.bind(this), 500);

    async getCanvasData() {
        toastr.warning(t('waveformBuildStart'));
        const canvasData = await wavesurfer({
            height: timelineHeight * 2,
            videoUrl: this.props.videoUrl,
            minPxPerSec: this.props.grid * 20,
            maxCanvasWidth: (this.props.mainWidth - this.props.grid * 10) * 2,
        });
        if (canvasData.length) {
            this.canvasData = canvasData;
            const $waveform = this.$waveform.current;
            const ctx = $waveform.getContext('2d');
            ctx.clearRect(0, 0, $waveform.width, $waveform.height);
            ctx.putImageData(this.canvasData[this.canvasIndex], this.props.grid * 10, 0);
            toastr.success(t('waveformBuildEnd'));
        }
    }

    drawWaveform() {
        const $waveform = this.$waveform.current;
        if (!$waveform || !this.props.videoUrl) return;
        if (this.props.mainWidth !== this.mainWidth) {
            this.mainWidth = this.props.mainWidth;
            this.getCanvasDataDebounce();
        }

        if (this.props.videoUrl !== this.videoUrl) {
            this.videoUrl = this.props.videoUrl;
            this.getCanvasDataDebounce();
        }

        const index = Math.floor(this.props.currentTime / 10);
        if (index !== this.canvasIndex && this.canvasData[index]) {
            this.canvasIndex = index;
            const ctx = $waveform.getContext('2d');
            ctx.clearRect(0, 0, $waveform.width, $waveform.height);
            ctx.putImageData(this.canvasData[index], this.props.grid * 10, 0);
        }
    }

    componentDidMount() {
        this.drawWaveform();
    }

    componentDidUpdate() {
        this.drawWaveform();
    }

    componentWillUnmount() {
        wavesurfer.destroy();
        this.canvasData = [];
    }

    render() {
        const { mainWidth } = this.props;
        return (
            <Canvas
                height={timelineHeight * 2}
                width={mainWidth * 2}
                style={{
                    width: mainWidth,
                }}
                ref={this.$waveform}
            ></Canvas>
        );
    }
}
