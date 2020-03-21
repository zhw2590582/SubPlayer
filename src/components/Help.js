import React from 'react';
import styled from 'styled-components';

const Help = styled.div`
    position: relative;
    padding: 0 20px 20px;
    font-size: 14px;

    a {
        color: #2196f3;
    }
`;

export default function() {
    return (
        <Help>
            <p>
                This editor is suitable for video with small volume and simple subtitle effect. For large file videos or
                more subtitle effect, please use professional desktop software.
            </p>
            <p>You can ask any questions on Github Issue:</p>
            <p>
                <a href="https://github.com/zhw2590582/SubPlayer/issues">
                    https://github.com/zhw2590582/SubPlayer/issues
                </a>
            </p>
            <p>Or contact me via email:</p>
            <p>
                <a href="mailto:laozhaochaguan@gmail.com">laozhaochaguan@gmail.com</a>
            </p>
        </Help>
    );
}
