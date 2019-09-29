import React from 'react';
import styled from 'styled-components';
import dequal from 'dequal';
import { escapeHTML } from '../utils';
import { t, Translate } from 'react-i18nify';
import toastr from 'toastr';

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
        background-color: rgba(199, 81, 35, 0.5);
    }

    p {
        line-height: 1.5;
        margin: 0;
    }
`;

const SubText = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: move;
    user-select: none;
`;

const Handle = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    cursor: col-resize;
    user-select: none;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const ContextMenu = styled.div`
    position: absolute;
    z-index: 4;
    left: 0;
    top: 0;
`;

const ContextMenuItem = styled.div`
    height: 30px;
    padding: 0 10px;
    line-height: 30px;
    cursor: pointer;
    font-size: 12px;
    color: #ccc;
    background-color: rgba(0, 0, 0, 0.75);
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.9);
    }
`;

export default class Blocks extends React.Component {
    state = {
        subtitles: [],
        contextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
    };

    static getDerivedStateFromProps(props, state) {
        const subtitles = props.subtitles.filter(item => {
            return (
                (item.startTime >= props.beginTime && item.startTime <= props.beginTime + 10) ||
                (item.endTime >= props.beginTime && item.endTime <= props.beginTime + 10)
            );
        });

        return dequal(subtitles, state.subtitles)
            ? null
            : {
                  subtitles,
              };
    }

    type = '';
    sub = null;
    $sub = null;
    leftDiff = 0;
    subWidth = 0;
    leftStart = 0;
    isDroging = false;
    $subs = React.createRef();

    onMouseDown(item, event, type) {
        const { highlightSubtitle, updateCurrentIndex } = this.props;
        const isPause = this.props.art.pause;
        if (!isPause) {
            this.props.art.pause = true;
        } else {
            highlightSubtitle(item);
            updateCurrentIndex(item);
        }
        this.sub = item;
        this.type = type;
        this.isDroging = true;
        this.leftStart = event.pageX;
        const index = this.state.subtitles.indexOf(item);
        this.$sub = this.$subs.current.children[index];
        this.subWidth = parseFloat(this.$sub.style.width);
    }

    onMousemove(event) {
        if (this.isDroging) {
            const diffLength = event.pageX - this.leftStart;
            this.leftDiff = diffLength / this.props.grid / 10;
            if (this.type === 'left') {
                this.$sub.style.width = `${this.subWidth + -diffLength}px`;
                this.$sub.style.transform = `translate(${diffLength}px)`;
            } else if (this.type === 'right') {
                this.$sub.style.width = `${this.subWidth + diffLength}px`;
            } else {
                this.$sub.style.transform = `translate(${diffLength}px)`;
            }
        }
    }

    onMouseup() {
        if (this.isDroging) {
            if (this.leftDiff) {
                const index = this.state.subtitles.indexOf(this.sub);
                if (this.type === 'left') {
                    const startTime = this.sub.startTime + this.leftDiff;
                    if (startTime >= 0 && startTime < this.sub.endTime) {
                        this.sub.startTime += this.leftDiff;
                        this.props.updateSubtitle(index, this.sub);
                    } else {
                        this.$sub.style.width = `${this.subWidth}px`;
                        toastr.warning(t('moveInvalid'));
                    }
                } else if (this.type === 'right') {
                    const endTime = this.sub.endTime + this.leftDiff;
                    if (endTime >= 0 && endTime > this.sub.startTime) {
                        this.sub.endTime += this.leftDiff;
                        this.props.updateSubtitle(index, this.sub);
                    } else {
                        this.$sub.style.width = `${this.subWidth}px`;
                        toastr.warning(t('moveInvalid'));
                    }
                } else {
                    const startTime = this.sub.startTime + this.leftDiff;
                    const endTime = this.sub.endTime + this.leftDiff;
                    if (startTime > 0 && endTime > 0 && endTime > startTime) {
                        this.sub.startTime += this.leftDiff;
                        this.sub.endTime += this.leftDiff;
                        this.props.updateSubtitle(index, this.sub);
                    } else {
                        toastr.warning(t('moveInvalid'));
                    }
                }
                this.$sub.style.transform = `translate(0)`;
            }

            this.type = '';
            this.sub = null;
            this.$sub = null;
            this.leftDiff = 0;
            this.subWidth = 0;
            this.leftStart = 0;
            this.isDroging = false;
        }
    }

    $contextMenu = React.createRef();
    onContextMenu(item, event) {
        this.onMouseup();
        event.preventDefault();
        this.sub = item;
        const $subs = this.$subs.current;
        const subsTop = $subs.getBoundingClientRect().top;
        const $contextMenu = this.$contextMenu.current;
        const contextMenuY =
            event.pageY + $contextMenu.clientHeight > document.body.clientHeight
                ? document.body.clientHeight - $contextMenu.clientHeight - subsTop
                : event.pageY - subsTop;
        this.setState({
            contextMenu: true,
            contextMenuX: event.pageX,
            contextMenuY,
        });
    }

    hideContextMenu() {
        this.setState(
            {
                contextMenu: false,
            },
            () => {
                this.sub = null;
            },
        );
    }

    componentDidMount() {
        document.addEventListener('click', event => {
            if (event.composedPath().indexOf(this.$contextMenu.current) < 0) {
                this.hideContextMenu();
            }
        });

        document.addEventListener('mousemove', event => {
            this.onMousemove(event);
        });

        document.addEventListener('mouseup', () => {
            this.onMouseup();
        });
    }

    render() {
        const { subtitles, contextMenu, contextMenuX, contextMenuY } = this.state;
        const {
            padding,
            grid,
            beginTime,
            removeSubtitle,
            insertSubtitle,
            mergeSubtitle,
            checkOverlapping,
        } = this.props;
        return (
            <React.Fragment>
                <Wrapper
                    style={{
                        padding: `0 ${padding}px`,
                    }}
                >
                    <Inner ref={this.$subs}>
                        {subtitles.map((item, index) => {
                            return (
                                <Sub
                                    key={index}
                                    onContextMenu={event => this.onContextMenu(item, event)}
                                    className={[
                                        item.editing ? 'editing' : '',
                                        item.highlight ? 'highlight' : '',
                                        checkOverlapping(item) ? 'overlapping' : '',
                                    ]
                                        .join(' ')
                                        .trim()}
                                    style={{
                                        left: (item.startTime - beginTime) * grid * 10,
                                        width: item.duration * grid * 10,
                                        padding: `0 ${grid}px`,
                                    }}
                                >
                                    <Handle
                                        onMouseDown={event => this.onMouseDown(item, event, 'left')}
                                        style={{
                                            left: 0,
                                            width: grid,
                                        }}
                                    />
                                    <SubText onMouseDown={event => this.onMouseDown(item, event)}>
                                        {item.text.split(/\r?\n/).map((item, index) => (
                                            <p key={index}>{escapeHTML(item)}</p>
                                        ))}
                                    </SubText>
                                    <Handle
                                        onMouseDown={event => this.onMouseDown(item, event, 'right')}
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
                <ContextMenu
                    ref={this.$contextMenu}
                    style={{
                        visibility: contextMenu ? 'visible' : 'hidden',
                        left: contextMenuX,
                        top: contextMenuY,
                    }}
                >
                    <ContextMenuItem
                        onClick={() => {
                            removeSubtitle(this.sub);
                            this.hideContextMenu();
                        }}
                    >
                        <Translate value="deleteLine" />
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            const index = this.props.subtitles.indexOf(this.sub);
                            insertSubtitle(index);
                            this.hideContextMenu();
                        }}
                    >
                        <Translate value="insertBefore" />
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            const index = this.props.subtitles.indexOf(this.sub);
                            insertSubtitle(index + 1);
                            this.hideContextMenu();
                        }}
                    >
                        <Translate value="insertAfter" />
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            mergeSubtitle(this.sub);
                            this.hideContextMenu();
                        }}
                    >
                        <Translate value="mergeNext" />
                    </ContextMenuItem>
                </ContextMenu>
            </React.Fragment>
        );
    }
}
