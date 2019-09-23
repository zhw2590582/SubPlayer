import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Main from './Main';

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    #root {
        display: flex;
        flex-direction: column;
        color: #ccc;
        background: rgb(16, 17, 19);
    }
`;

export default function App() {
    return (
        <React.Fragment>
            <GlobalStyle />
            <Header />
            <Main />
        </React.Fragment>
    );
}
