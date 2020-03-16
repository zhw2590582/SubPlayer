import React, { useState } from 'react';
import styled from 'styled-components';

const Upload = styled.div`
    position: fixed;
    z-index: 9;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
`;

const Inner = styled.div`
    width: 500px;
    background-color: #1f2133;

    .item {
        padding: 10px 0;
        .title {
            color: #fff;
            font-size: 14px;
            padding: 5px 10px;
            border-left: 2px solid #03a9f4;
        }
        .centent {
            padding: 15px 10px;
            .upload {
                position: relative;
                margin-bottom: 10px;
                .input {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    outline: none;
                    border: none;
                    color: #fff;
                    background-color: #363952;
                }
                .file {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    line-height: 1;
                    height: 100%;
                    width: 100px;
                    color: #fff;
                    background-color: rgb(9, 113, 241);

                    input {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                    }
                }
            }
            .info {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                margin-bottom: 10px;
            }
            .option {
                font-size: 12px;
                label {
                    margin-right: 20px;
                    input {
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        height: 40px;
        cursor: pointer;
        background-color: rgb(9, 113, 241);
        transition: all 0.2s ease 0s;

        &:hover {
            background-color: rgb(91, 148, 255);
        }
    }
`;

export default function({ setUpload }) {
    const [videoUrl] = useState('/sample.mp4');
    const [subtitleUrl] = useState('/sample.vtt');

    return (
        <Upload onClick={() => setUpload(false)}>
            <Inner onClick={event => event.stopPropagation()}>
                <div className="item">
                    <div className="title">Upload Subtitle</div>
                    <div className="centent">
                        <div className="upload">
                            <input
                                defaultValue={subtitleUrl}
                                type="text"
                                className="input"
                                spellCheck="false"
                                placeholder="Upload from remote address or local file"
                            />
                            <div className="file">
                                Open
                                <input type="file" />
                            </div>
                        </div>
                        <div className="info">Supports opening subtitles in vtt, srt and ass formats</div>
                        <div className="option">
                            <label>
                                <input type="checkbox" value="" />
                                Remove blank lines
                            </label>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="title">Upload Video</div>
                    <div className="centent">
                        <div className="upload">
                            <input
                                defaultValue={videoUrl}
                                type="text"
                                className="input"
                                spellCheck="false"
                                placeholder="Upload from remote address or local file"
                            />
                            <div className="file">
                                Open
                                <input type="file" />
                            </div>
                        </div>
                        <div className="info">Supports opening mp4, webm and ogg video</div>
                        <div className="option">
                            <label>
                                <input type="checkbox" value="" />
                                Generate audio waveform graph
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bottom">Confirm</div>
            </Inner>
        </Upload>
    );
}
