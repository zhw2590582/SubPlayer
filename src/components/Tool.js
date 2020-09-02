import React, { useEffect } from 'react';
import styled from 'styled-components';
import languages from '../translate/languages';
import { Translate } from 'react-i18nify';

import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';

class SketchExample extends React.Component {
    state = {
        displayColorPicker: false,
        color: this.props.color,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb });
        const { $subtitle } = this.props.player.template;
        $subtitle.style.color = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        this.props.storage.set('color', color.rgb);
    };

    render() {
        const styles = reactCSS({
            default: {
                color: {
                    width: '30px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
                    border: `1px solid rgba(255, 255, 255, 0.5)`,
                },
                swatch: {
                    borderRadius: '5px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '999',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {this.state.displayColorPicker ? (
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose} />
                        <ChromePicker color={this.state.color} onChange={this.handleChange} />
                    </div>
                ) : null}
            </div>
        );
    }
}

const Tool = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 13px;

    .item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);

        .title {
            margin-right: 15px;
        }

        .value {
            display: flex;
            align-items: center;

            select {
                outline: none;
                margin-right: 15px;
            }

            button {
                height: 25px;
                border: none;
                padding: 0 10px;
                margin-right: 15px;
                outline: none;
                cursor: pointer;
                font-size: 12px;
                color: #fff;
                border-radius: 3px;
                background-color: rgb(26, 83, 109);
                transition: all 0.2s ease;
                &:hover {
                    color: #fff;
                    background-color: #2196f3;
                }
                i {
                    margin-right: 5px;
                }
            }

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

            .sub-item {
                display: flex;
                margin-right: 15px;

                .sub-title {
                    display: flex;
                    align-items: center;
                    margin-right: 5px;
                    font-size: 12px;
                    color: #888;
                }

                .sub-value {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
`;

export default function ({ player, storage, language, options, setOption, translateSubtitles, timeOffsetSubtitles }) {
    const fontSize = storage.get('fontSize') || 20;
    const bottom = storage.get('bottom') || 40;
    const color = storage.get('color') || {
        r: '255',
        g: '255',
        b: '255',
        a: '1',
    };

    const onChangeSize = (value) => {
        const { $subtitle } = player.template;
        $subtitle.style.fontSize = `${value}px`;
        storage.set('fontSize', value);
    };

    const onChangeBottom = (value) => {
        const { $subtitle } = player.template;
        $subtitle.style.bottom = `${value}px`;
        storage.set('bottom', value);
    };

    useEffect(() => {
        if (player) {
            const { $subtitle } = player.template;
            $subtitle.style.fontSize = `${fontSize}px`;
            $subtitle.style.bottom = `${bottom}px`;
            $subtitle.style.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        }
    }, [bottom, fontSize, player, storage, color]);

    return (
        <Tool>
            <div className="item">
                <div className="title">
                    <Translate value="google-translate" />
                </div>
                <div className="value">
                    <select
                        value={options.translationLanguage}
                        onChange={(event) => setOption({ translationLanguage: event.target.value })}
                    >
                        {(languages[language] || languages.en).map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => translateSubtitles()}>
                        <Translate value="confirm" />
                    </button>
                </div>
            </div>
            <div className="item">
                <div className="title">
                    <Translate value="time-offset" />
                </div>
                <div className="value">
                    <button onClick={() => timeOffsetSubtitles(-0.1)}>-100ms</button>
                    <button onClick={() => timeOffsetSubtitles(0.1)}>+100ms</button>
                    <button onClick={() => timeOffsetSubtitles(-1)}>-1000ms</button>
                    <button onClick={() => timeOffsetSubtitles(1)}>+1000ms</button>
                </div>
            </div>
            <div className="item">
                <div className="title">
                    <Translate value="subtitle-style" />
                </div>
                <div className="value">
                    <div className="sub-item">
                        <div className="sub-title">
                            <Translate value="subtitle-color" />
                        </div>
                        <div className="sub-value">
                            <SketchExample storage={storage} player={player} color={color} />
                        </div>
                    </div>
                    <div className="sub-item">
                        <div className="sub-title">
                            <Translate value="subtitle-size" />
                        </div>
                        <div className="sub-value">
                            <input
                                defaultValue={fontSize}
                                type="range"
                                min="20"
                                max="50"
                                step="1"
                                onChange={(event) => {
                                    onChangeSize(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="sub-item">
                        <div className="sub-title">
                            <Translate value="subtitle-bottom" />
                        </div>
                        <div className="sub-value">
                            <input
                                defaultValue={bottom}
                                type="range"
                                min="40"
                                max="100"
                                step="1"
                                onChange={(event) => {
                                    onChangeBottom(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Tool>
    );
}
