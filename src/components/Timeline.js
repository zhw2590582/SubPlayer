import React from 'react';
import styled from 'styled-components';
import { secondToTime } from '../utils';

const Wrapper = styled.div`
    display: flex;
    height: 200px;
    border-top: 1px solid rgb(36, 41, 45);
    background-color: rgb(28, 32, 34);
`;

function drawGrid(ctx, width, beginTime = 0) {
    let timeIndex = 0;
    const num = 110;
    const height = 200;
    const pre = width / num;
    ctx.font = '12px';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let index = 0; index < num; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(pre * index, 0, 1, height);
        if (index % 10 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(pre * index, 0, 1, 7);
        } else if (index % 5 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(pre * index, 0, 1, 15);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(secondToTime(beginTime + timeIndex++).split('.')[0], pre * index - 20, 30);
        }
    }

    for (let index = 0; index < height / pre; index++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, pre * index, width, 1);
    }
}

export default class Timeline extends React.Component {
    state = {
        $canvas: React.createRef(),
    };

    static getDerivedStateFromProps(props, state) {
        if (state.$canvas.current) {
            const $canvas = state.$canvas.current;
            if (props.mainWidth !== $canvas.width) {
                $canvas.width = props.mainWidth;
                const ctx = $canvas.getContext('2d');
                drawGrid(ctx, $canvas.width);
            }
        }
        return null;
    }

    render() {
        return (
            <Wrapper>
                <canvas width="200" height="200" ref={this.state.$canvas} />
            </Wrapper>
        );
    }
}
