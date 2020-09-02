import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import WF from '../waveform';
import { sleep } from '../utils';
import Block from './Block';
import Metronome from './Metronome';
import { Translate } from 'react-i18nify';

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    height: 200px;

    .timeline-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35px;
        font-size: 12px;
        border-bottom: 1px solid #000;
        color: rgba(255, 255, 255, 0.5);
        background-color: rgba(0, 0, 0, 0.3);

        .timeline-header-left {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                display: flex;
                padding: 0 10px;
                height: 100%;
                border-right: 1px solid #000;

                .name {
                    display: flex;
                    align-items: center;
                    margin-right: 10px;
                }

                .value {
                    display: flex;
                    align-items: center;

                    input[type='checkbox'] {
                        outline: none;
                    }

                    input[type='range'] {
                        height: 3px;
                        width: 100px;
                        outline: none;
                        appearance: none;
                        background-color: rgba(255, 255, 255, 0.2);
                    }

                    select {
                        outline: none;
                    }
                }
            }
        }

        .timeline-header-right {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 15px;
            border-left: 1px solid #000;
        }
    }

    .timeline-body {
        position: relative;
        flex: 1;

        .waveform {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            user-select: none;
            pointer-events: none;
        }
    }
`;

let wf = null;
const Waveform = React.memo(
    ({ options, player, setDecodeing, setFileSize, setChannelNum, setRender }) => {
        const $waveform = React.createRef();

        useEffect(() => {
            if (wf) wf.destroy();

            wf = new WF({
                container: $waveform.current,
                mediaElement: player.template.$video,
                backgroundColor: 'rgb(20, 23, 38)',
                waveColor: 'rgba(255, 255, 255, 0.1)',
                progressColor: 'rgba(255, 255, 255, 0.5)',
                gridColor: 'rgba(255, 255, 255, 0.05)',
                rulerColor: 'rgba(255, 255, 255, 0.5)',
            });

            wf.on('render', setRender);
            wf.on('decodeing', setDecodeing);
            wf.on('fileSize', setFileSize);
            wf.on('audiobuffer', (audiobuffer) => setChannelNum(audiobuffer.numberOfChannels));
            sleep(1000).then(() => wf.load(options.videoUrl));
        }, [player, $waveform, options.videoUrl, setDecodeing, setFileSize, setChannelNum, setRender]);
        return <div className="waveform" ref={$waveform} />;
    },
    (prevProps, nextProps) => prevProps.options.videoUrl === nextProps.options.videoUrl,
);

export default function (props) {
    const [decodeing, setDecodeing] = useState(0);
    const [fileSize, setFileSize] = useState(0);
    const [channelNum, setChannelNum] = useState(1);
    const [metronome, setMetronome] = useState(false);
    const [autoAlign, setAutoAlign] = useState(true);
    const [render, setRender] = useState({
        padding: 5,
        duration: 10,
        gridNum: 110,
        beginTime: 0,
    });

    return (
        <Footer>
            <div className="timeline-header">
                <div className="timeline-header-left">
                    <div className="item">
                        <div className="name">
                            <Translate value="audio-waveform" />
                        </div>
                        <div className="value">
                            <input
                                defaultChecked={true}
                                type="checkbox"
                                onChange={(event) => {
                                    if (!wf) return;
                                    wf.setOptions({
                                        wave: event.target.checked,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="file-size" />
                        </div>
                        <div className="value" style={{ color: '#FF5722' }}>
                            {((fileSize || 0) / 1024 / 1024).toFixed(2)} M
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="decoding-progress" />
                        </div>
                        <div className="value" style={{ color: '#FF5722' }}>
                            {((decodeing || 0) * 100).toFixed(2)}%
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="render-channel" />
                        </div>
                        <div className="value">
                            <select
                                defaultValue={0}
                                onChange={(event) => {
                                    if (!wf) return;
                                    wf.changeChannel(Number(event.target.value || 0));
                                }}
                            >
                                {Array(channelNum)
                                    .fill()
                                    .map((_, index) => (
                                        <option key={index} value={index}>
                                            {index + 1}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="auto-align" />
                        </div>
                        <div className="value">
                            <input
                                checked={autoAlign}
                                type="checkbox"
                                onChange={() => {
                                    if (!wf) return;
                                    setAutoAlign(!autoAlign);
                                }}
                            />
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="unit-duration" />
                        </div>
                        <div className="value">
                            <input
                                defaultValue="10"
                                type="range"
                                min="5"
                                max="20"
                                step="1"
                                onChange={(event) => {
                                    if (!wf) return;
                                    wf.setOptions({
                                        duration: Number(event.target.value || 10),
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="height-zoom" />
                        </div>
                        <div className="value">
                            <input
                                defaultValue="1"
                                type="range"
                                min="0.1"
                                max="2"
                                step="0.1"
                                onChange={(event) => {
                                    if (!wf) return;
                                    wf.setOptions({
                                        waveScale: Number(event.target.value || 1),
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <Translate value="space-metronome" />
                        </div>
                        <div className="value">
                            {metronome ? (
                                <span style={{ color: '#4CAF50' }}>ON</span>
                            ) : (
                                <span style={{ color: '#FF5722' }}>OFF</span>
                            )}
                        </div>
                    </div>
                    <div className="item">
                        <div
                            style={{ cursor: 'pointer' }}
                            className="value"
                            onClick={() => {
                                if (!wf) return;
                                wf.exportImage();
                            }}
                        >
                            <Translate value="export-image" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="timeline-body">
                {props.player ? (
                    <Waveform
                        {...props}
                        setDecodeing={setDecodeing}
                        setFileSize={setFileSize}
                        setChannelNum={setChannelNum}
                        setRender={setRender}
                    />
                ) : null}
                <Metronome {...props} render={render} metronome={metronome} setMetronome={setMetronome} />
                <Block {...props} render={render} autoAlign={autoAlign} />
            </div>
        </Footer>
    );
}
