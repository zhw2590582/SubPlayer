import React from 'react';
import styled from 'styled-components';

const Block = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

export default function(props) {
    return <Block>{JSON.stringify(props.render)}</Block>;
}
