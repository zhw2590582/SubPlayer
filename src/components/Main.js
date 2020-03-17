import React from 'react';
import styled from 'styled-components';
import Player from './Player';
import Tool from './Tool';
import Subtitle from './Subtitle';

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
    width: 50%;
    border-right: 1px solid #000;
`;

const Right = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
`;

export default function(props) {
    return (
        <Main>
            <Left>
                <Player {...props} />
                <Tool {...props} />
            </Left>
            <Right>
                <Subtitle {...props} />
            </Right>
        </Main>
    );
}
