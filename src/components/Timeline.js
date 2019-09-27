import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    height: 200px;
    border-top: 1px solid rgb(36, 41, 45);
    background-color: rgb(28, 32, 34);
`;

function drawbackground($canvas) {
    console.log($canvas);
}

export default class Timeline extends React.Component {
    $canvas = React.createRef();

    componentDidMount() {
        drawbackground(this.$canvas.current);
    }

    render() {
        return (
            <Wrapper>
                <canvas width={this.props.mainWidth} height={200} ref={this.$canvas} />
            </Wrapper>
        );
    }
}
