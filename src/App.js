import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Table from './Table';
import Timeline from './Timeline';
import Player from './Player';

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #ccc;
        background: rgb(16, 17, 19);
    }

    .main {
        display: flex;
    }
`;

export default function App() {
    return (
        <React.Fragment>
            <GlobalStyle />
            <Header />
            <div className="main">
                <Table />
                <Player />
            </div>
            <Timeline />
        </React.Fragment>
    );
}
