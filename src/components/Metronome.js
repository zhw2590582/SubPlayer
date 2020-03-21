import React, { useEffect, useCallback } from 'react';
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

export default function({ metronome }) {
    const onKeyDown = useCallback(
        event => {
            if (metronome) {
                const tag = document.activeElement.tagName.toUpperCase();
                const editable = document.activeElement.getAttribute('contenteditable');
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                        console.log('23333');
                    }
                }
            }
        },
        [metronome],
    );

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return <Metronome>Metronome</Metronome>;
}
