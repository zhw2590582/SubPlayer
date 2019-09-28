import React from 'react';
import styled from 'styled-components';
import dequal from 'dequal';
import { escapeHTML } from '../utils';

const Wrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`;

const Inner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const Sub = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: move;
    user-select: none;
    padding: 0 10px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.2);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }

    &.highlight {
        background-color: rgba(33, 150, 243, 0.5);
        border-left: 1px solid rgba(33, 150, 243, 0.5);
        border-right: 1px solid rgba(33, 150, 243, 0.5);
    }

    &.overlapping {
        background-color: #c75123;
    }

    p {
        line-height: 1.5;
        margin: 0;
    }
`;

const Handle = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    cursor: col-resize;
    user-select: none;
`;

function findMatchedSubtitles(subtitles, beginTime) {
    return subtitles.filter(item => {
        return (
            (item.startTime >= beginTime && item.startTime <= beginTime + 10) ||
            (item.endTime >= beginTime && item.endTime <= beginTime + 10)
        );
    });
}

export default class Blocks extends React.Component {
    state = {
        subtitles: [],
    };

    static getDerivedStateFromProps(props, state) {
        const subtitles = findMatchedSubtitles(props.subtitles, props.beginTime);
        return dequal(subtitles, state.subtitles)
            ? null
            : {
                  subtitles,
              };
    }

    onClick(item) {
        const { art, highlightSubtitle, updateCurrentIndex } = this.props;
        if (!art.playing) {
            highlightSubtitle(item.index);
            updateCurrentIndex(item.index);
        }
    }

    render() {
        const { padding, grid, beginTime } = this.props;
        const { subtitles } = this.state;
        return (
            <Wrapper
                style={{
                    paddingLeft: padding,
                    paddingRight: padding,
                }}
            >
                <Inner>
                    {subtitles.map(item => {
                        return (
                            <Sub
                                key={item.index}
                                onClick={() => this.onClick(item)}
                                className={[
                                    item.editing ? 'editing' : '',
                                    item.highlight ? 'highlight' : '',
                                    item.overlapping ? 'overlapping' : '',
                                ]
                                    .join(' ')
                                    .trim()}
                                style={{
                                    left: (item.startTime - beginTime) * grid * 10,
                                    width: item.duration * grid * 10,
                                }}
                            >
                                <Handle
                                    style={{
                                        left: 0,
                                        width: grid,
                                    }}
                                />
                                {item.text.split(/\r?\n/).map((item, index) => (
                                    <p key={index}>{escapeHTML(item)}</p>
                                ))}
                                <Handle
                                    style={{
                                        right: 0,
                                        width: grid,
                                    }}
                                />
                            </Sub>
                        );
                    })}
                </Inner>
            </Wrapper>
        );
    }
}
