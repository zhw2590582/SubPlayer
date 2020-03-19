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
        color: #fff;
        padding: 0 10px;
        font-size: 12px;
        border-bottom: 1px solid #000;
        background-color: #232740;
    }

    .timeline-body {
        flex: 1;

        .waveform {
            width: 100%;
            height: 100%;
        }
    }
`;

let lastWf = null;
const Waveform = React.memo(
    ({ options, player }) => {
        const $waveform = React.createRef();

        useEffect(() => {
            if (lastWf) lastWf.destroy();
            lastWf = new WF({
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
            <div className="timeline-header">时间轴</div>
            <div className="timeline-body">{props.player ? <Waveform {...props} /> : null}</div>
        </Footer>
    );
}
