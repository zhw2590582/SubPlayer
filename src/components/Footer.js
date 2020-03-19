import React, { useEffect } from 'react';
import styled from 'styled-components';
import WF from '../waveform';

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    height: 200px;

    .timeline-header {
        display: flex;
        align-items: center;
        height: 35px;
        padding: 0 10px;
        font-size: 12px;
        border-bottom: 1px solid #000;
        background-color: #232740;

        .item {
            display: flex;
            margin-right: 20px;

            .name {
                color: rgba(255, 255, 255, 0.5);
                margin-right: 10px;
            }

            .value {
                display: flex;
                align-items: center;

                input {
                    height: 3px;
                    width: 100px;
                    outline: none;
                    appearance: none;
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }
    }

    .timeline-body {
        flex: 1;

        .waveform {
            width: 100%;
            height: 100%;
        }
    }
`;

let wf = null;
const Waveform = React.memo(
    ({ options, player }) => {
        const $waveform = React.createRef();

        useEffect(() => {
            if (wf) wf.destroy();
            wf = new WF({
                wave: options.useAudioWaveform,
                container: $waveform.current,
                mediaElement: player.template.$video,
            });
        }, [player, $waveform, options.videoUrl, options.useAudioWaveform]);

        return <div className="waveform" ref={$waveform} />;
    },
    (prevProps, nextProps) => {
        const prevOptions = prevProps.options;
        const nextOptions = nextProps.options;
        return (
            prevOptions.videoUrl === nextOptions.videoUrl &&
            prevOptions.useAudioWaveform === nextOptions.useAudioWaveform
        );
    },
);

export default function(props) {
    return (
        <Footer>
            <div className="timeline-header">
                <div className="item">
                    <div className="name">解码进度:</div>
                    <div className="value">0%</div>
                </div>
                <div className="item">
                    <div className="name">单位时长:</div>
                    <div className="value">
                        <input defaultValue="10" type="range" min="5" max="20" step="1" />
                    </div>
                </div>
                <div className="item">
                    <div className="name">高度缩放:</div>
                    <div className="value">
                        <input
                            defaultValue="1"
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            disabled={!props.options.useAudioWaveform}
                        />
                    </div>
                </div>
            </div>
            <div className="timeline-body">{props.player ? <Waveform {...props} /> : null}</div>
        </Footer>
    );
}
