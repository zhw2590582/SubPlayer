import React from 'react';
import styled from 'styled-components';
import Player from './Player';
import Tool from './Tool';

const Main = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    flex: 1;
`;

const Left = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 40%;
    border-right: 1px solid #000;
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
`;

export default function() {
    return (
        <Main>
            <Left>
                <Player />
                <Tool />
            </Left>
            <Right>Right</Right>
        </Main>
    );
}
