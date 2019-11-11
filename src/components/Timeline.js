import React from 'react';
import styled from 'styled-components';
import Blocks from './Blocks';
import WFPlayer from 'wfplayer/src';
import { t } from 'react-i18nify';
import toastr from 'toastr';

const timelineHeight = 150;
const Wrapper = styled.div`
    position: relative;
    display: flex;
    height: ${timelineHeight}px;
    width: 100%;
    background-color: rgb(28, 32, 34);
    border-top: 1px solid rgb(10, 10, 10);
`;

const Waveform = styled.div`
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
`;

export default class Timeline extends React.Component {
    state = {
        $waveform: React.createRef(),
        grid: 0,
        padding: 0,
        beginTime: 0,
    };

    static getDerivedStateFromProps(props) {
        return {
            beginTime: Math.floor(props.currentTime / 10) * 10,
        };
    }

    componentDidUpdate() {
        if (this.props.art && !this.wf) {
            this.initWFPlayer();
            this.props.art.on('switch', () => {
                this.initWFPlayer();
            });
        }
    }

    wf = null;
    $waveform = React.createRef();
    initWFPlayer() {
        const { art } = this.props;
        const { $video } = art.template;
        if ($video.src) {
            if (this.wf) {
                this.wf.destroy();
            }

            this.wf = new WFPlayer({
                container: this.$waveform.current,
                waveColor: 'rgba(255, 255, 255, 0.1)',
                progressColor: 'rgba(255, 255, 255, 0.3)',
                cors: true,
            });

            art.on('seek', () => {
                this.wf.seek(art.currentTime);
            });

            const updateState = () => {
                const { drawer, options } = this.wf;
                this.setState({
                    grid: drawer.gridGap / options.pixelRatio,
                    padding: (drawer.gridGap * 5) / options.pixelRatio,
                });
            };

            updateState();
            this.wf.on('resize', () => {
                updateState();
            });

            this.wf.on('decodeing', value => {
                if (value && value >= 1) {
                    toastr.success(t('waveformBuildEnd'));
                }
            });

            this.wf.load($video);
        }
    }

    render() {
        return (
            <Wrapper>
                <Waveform ref={this.$waveform} />
                {this.state.grid ? <Blocks {...this.props} {...this.state} /> : null}
            </Wrapper>
        );
    }
}
