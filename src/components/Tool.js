import React, { useState } from 'react';
import styled from 'styled-components';
import languages from '../translate/languages';
import { Translate } from 'react-i18nify';

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

        .value {
            display: flex;
            align-items: center;
            select {
                outline: none;
                margin-left: 15px;
            }
            button {
                height: 25px;
                border: none;
                padding: 0 10px;
                margin-left: 15px;
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
        }
    }
`;

export default function ({ language, options, setOption, translateSubtitles, timeOffsetSubtitles }) {
    const [offset, setOffset] = useState(0);
    function handleTimeOffsetChange(e) {
        e.preventDefault();
        timeOffsetSubtitles(Number(offset));
        console.log('change', offset);
    }
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
                    &nbsp;
                    <input
                        name="offsetTime"
                        type="number"
                        onChange={(e) => {
                            setOffset(e.target.value);
                        }}
                    />
                    &nbsp;
                    <label htmlFor="offsetTime"> seconds </label>
                    &nbsp;
                    <button onClick={handleTimeOffsetChange}>change</button>
                </div>
            </div>
        </Tool>
    );
}
