import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-i18nify';

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
                <Translate value="help-info" />
            </p>
            <p>
                <Translate value="help-issue" />
            </p>
            <p>
                <a href="https://github.com/zhw2590582/SubPlayer/issues">
                    https://github.com/zhw2590582/SubPlayer/issues
                </a>
            </p>
            <p>
                <Translate value="help-email" />
            </p>
            <p>
                <a href="mailto:laozhaochaguan@gmail.com">laozhaochaguan@gmail.com</a>
            </p>
        </Help>
    );
}
