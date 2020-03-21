import React from 'react';
import styled from 'styled-components';

const Metronome = styled.div`
    position: absolute;
    z-index: 8;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
`;

export default function(props) {
    return <Metronome>Metronome</Metronome>;
}
