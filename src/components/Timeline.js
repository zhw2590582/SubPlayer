import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    height: 200px;
    border-top: 1px solid rgb(36, 41, 45);
    background-color: rgb(28, 32, 34);
`;

function drawGrid(ctx, width) {
    const num = 100;
    const height = 200;
    const pre = width / num;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let index = 0; index < num; index++) {
        ctx.fillRect(pre * index, 0, 1, height);
    }

    for (let index = 0; index < height / pre; index++) {
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
                ctx.clearRect(0, 0, $canvas.width, $canvas.height);
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
