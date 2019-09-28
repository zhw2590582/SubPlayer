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
    $subs = React.createRef();
    sub = null;
    subIsDroging = false;
    subLeftStart = 0;
    subLeftDiff = 0;

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

    subOnMouseDown(item, event) {
        const isPause = this.props.art.pause;
        this.sub = item;
        this.subIsDroging = true;
        this.subLeftStart = event.pageX;
        if (!isPause) {
            this.props.art.pause = true;
        }
    }

    subOnMouseMove(item, event) {
        if (this.subIsDroging && this.sub === item) {
            const diffLength = event.pageX - this.subLeftStart;
            const index = this.state.subtitles.indexOf(item);
            const $sub = this.$subs.current.children[index];
            $sub.style.transform = `translate(${diffLength}px)`;
            this.subLeftDiff = diffLength / this.props.grid / 10;
        }
    }

    componentDidMount() {
        document.addEventListener('mouseup', () => {
            if (this.subIsDroging && this.sub) {
                const item = this.sub;
                this.sub = null;
                this.subIsDroging = false;
                this.subLeftStart = 0;
                const index = this.state.subtitles.indexOf(item);
                const $sub = this.$subs.current.children[index];
                $sub.style.transform = `translate(0)`;
                item.startTime += this.subLeftDiff;
                item.endTime += this.subLeftDiff;
                this.props.updateSubtitle(item.index, item);
            }
        });
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
                <Inner ref={this.$subs}>
                    {subtitles.map(item => {
                        return (
                            <Sub
                                key={item.index}
                                onClick={() => this.onClick(item)}
                                onMouseDown={event => this.subOnMouseDown(item, event)}
                                onMouseMove={event => this.subOnMouseMove(item, event)}
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
