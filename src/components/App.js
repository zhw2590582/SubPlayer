import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import { debounce } from '../utils';

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
`;

const Main = styled.div`
    display: flex;
`;

export default class App extends React.Component {
    state = {
        mainHeight: 100,
        subtitles: [
            {
                start: '0:00:01.981',
                end: '0:00:04.682',
                duration: '2.701',
                text: `We're quite content to be the odd browser out.`,
            },
        ],
    };

    componentDidMount() {
        this.uddateMainHeight();

        const resizeDebounce = debounce(() => {
            this.uddateMainHeight();
        }, 500);

        window.addEventListener('resize', resizeDebounce);
    }

    uddateMainHeight() {
        this.setState({
            mainHeight: document.body.clientHeight - 250,
        });
    }

    removeSubtitle(index) {
        const subtitles = this.state.subtitles.slice();
        subtitles.splice(index, 1);
        this.setState({
            subtitles,
        });
    }

    render() {
        return (
            <React.Fragment>
                <GlobalStyle />
                <Header />
                <Main
                    style={{
                        height: `${this.state.mainHeight}px`,
                    }}
                >
                    <Subtitle subtitles={this.state.subtitles} onRemove={this.removeSubtitle.bind(this)} />
                    <Player />
                </Main>
                <Timeline />
            </React.Fragment>
        );
    }
}
