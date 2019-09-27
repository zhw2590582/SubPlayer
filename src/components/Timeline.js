import React from 'react';
import styled from 'styled-components';
import { secondToTime } from '../utils';

const Wrapper = styled.div`
    position: relative
    display: flex;
    height: 200px;
    background-color: rgb(28, 32, 34);

    canvas {
        position: absolute;
        z-index: 5;
        left: 0;
        top: 0;
        pointer-events: none;
    }
`;

function drawGrid(ctx, width, beginTime = 0) {
    let timeIndex = 0;
    const num = 110;
    const height = 200;
    const pre = width / num;
    ctx.font = '22px Arial';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let index = 0; index < num; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(pre * index, 0, 2, height * 2);
        if (index % 10 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            if (index) {
                ctx.fillRect(pre * index, 0, 2, 15);
            }
        } else if (index % 5 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(pre * index, 0, 2, 30);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(secondToTime(beginTime + timeIndex++).split('.')[0], pre * index - 42, 60);
        }
    }

    for (let index = 0; index < (height / pre) * 2; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, pre * index, width, 2);
    }

    return pre;
}

export default class Timeline extends React.Component {
    state = {
        $canvas: React.createRef(),
    };

    static getDerivedStateFromProps(props, state) {
        if (state.$canvas.current) {
            const $canvas = state.$canvas.current;
            if (props.mainWidth !== $canvas.width) {
                $canvas.height = 200 * 2;
                $canvas.width = props.mainWidth * 2;
                $canvas.style.height = '200px';
                $canvas.style.width = `${props.mainWidth}px`;
                const ctx = $canvas.getContext('2d');
                drawGrid(ctx, $canvas.width);
            }
        }
        return null;
    }

    render() {
        return (
            <Wrapper>
                <canvas ref={this.state.$canvas} />
            </Wrapper>
        );
    }
}
