import React from 'react';
import styled from 'styled-components';
import { secondToTime } from '../utils';

const timelineHeight = 200;
const Wrapper = styled.div`
    position: relative;
    display: flex;
    height: ${timelineHeight}px;
    background-color: rgb(28, 32, 34);
`;

const Canvas = styled.canvas`
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    transition: all 0.2s ease;
`;

const Line = styled.div`
    position: absolute;
    z-index: 3;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    pointer-events: none;
    user-select: none;
    background-color: #f44336;
`;

function drawGrid(ctx, beginTime) {
    let ruler = 0;
    const num = 110;
    const height = ctx.canvas.height;
    const width = ctx.canvas.width;
    const gap = width / num;

    ctx.font = '22px Arial';
    ctx.clearRect(0, 0, width, ctx.canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, gap * 5, height);
    ctx.fillRect(105 * gap, 0, gap * 5, height);
    for (let index = 0; index < num; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(gap * index, 0, 2, height);
        if (index % 10 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            if (index) {
                ctx.fillRect(gap * index, 0, 2, 15);
            }
        } else if (index % 5 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(gap * index, 0, 2, 30);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(secondToTime(beginTime + ruler++).split('.')[0], gap * index - 42, 60);
        }
    }

    for (let index = 0; index < height / gap; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, gap * index, width, 2);
    }

    const grid = Number((gap / 2).toFixed(3));
    const padding = grid * 5;
    return {
        grid,
        padding,
        beginTime,
    };
}

export default class Timeline extends React.Component {
    state = {
        $canvas: React.createRef(),
        grid: 0,
        padding: 0,
        beginTime: 0,
    };

    static getDerivedStateFromProps(props, state) {
        const beginTime = Math.floor(props.currentTime / 10) * 10;
        if (state.$canvas.current) {
            const $canvas = state.$canvas.current;
            const ctx = $canvas.getContext('2d');

            if (props.mainWidth * 2 !== $canvas.width) {
                $canvas.height = timelineHeight * 2;
                $canvas.width = props.mainWidth * 2;
                $canvas.style.height = '100%';
                $canvas.style.width = `${props.mainWidth}px`;
                return drawGrid(ctx, beginTime);
            }

            if (state.beginTime !== beginTime) {
                return drawGrid(ctx, beginTime);
            }
        }
        return null;
    }

    render() {
        const { $canvas, grid, padding } = this.state;
        const { currentTime } = this.props;
        const lineX = padding + (currentTime % 10) * grid * 10;
        return (
            <Wrapper>
                <Canvas ref={$canvas} />
                <Line
                    style={{
                        transform: `translate(${lineX}px)`,
                    }}
                ></Line>
            </Wrapper>
        );
    }
}
