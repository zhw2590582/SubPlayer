import React from 'react';
import styled from 'styled-components';
import { secondToTime } from '../utils';

const timelineHeight = 200;
const Wrapper = styled.div`
    position: relative
    display: flex;
    height: ${timelineHeight}px;
    background-color: rgb(28, 32, 34);

    canvas {
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        pointer-events: none;
        transition: all 0.2s ease;
    }
`;

const Line = styled.div`
    position: absolute;
    z-index: 3;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    transition: all 0.2s ease;
    background-color: #f44336;
`;

function drawGrid(ctx, width, beginTime = 0) {
    let ruler = 0;
    const num = 110;
    const height = timelineHeight;
    const gap = width / num;

    ctx.font = '22px Arial';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, gap * 5, height * 2);
    ctx.fillRect(105 * gap, 0, gap * 5, height * 2);
    for (let index = 0; index < num; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(gap * index, 0, 2, height * 2);
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

    for (let index = 0; index < (height / gap) * 2; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, gap * index, width, 2);
    }

    const grid = Number((gap / 2).toFixed(3));
    const padding = grid * 5;
    return {
        grid,
        padding,
    };
}

export default class Timeline extends React.Component {
    state = {
        $canvas: React.createRef(),
        grid: 0,
        padding: 0,
    };

    static getDerivedStateFromProps(props, state) {
        if (state.$canvas.current) {
            const $canvas = state.$canvas.current;
            if (props.mainWidth !== $canvas.width) {
                $canvas.height = timelineHeight * 2;
                $canvas.width = props.mainWidth * 2;
                $canvas.style.height = '100%';
                $canvas.style.width = `${props.mainWidth}px`;
                const ctx = $canvas.getContext('2d');
                const { grid, padding } = drawGrid(ctx, $canvas.width);
                return {
                    grid,
                    padding,
                };
            }
        }
        return null;
    }

    render() {
        const { $canvas, grid, padding } = this.state;
        return (
            <Wrapper>
                <canvas ref={$canvas} />
                <Line
                    style={{
                        transform: `translate(${padding + grid}px)`,
                    }}
                ></Line>
            </Wrapper>
        );
    }
}
