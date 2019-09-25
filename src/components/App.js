import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import { debounce, arrToVtt, vttToUrl, notice, readSubtitleFromUrl, urlToArr } from '../utils';

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #ccc;
        background: rgb(16, 17, 19);
    }

    .notice {
        position: fixed;
        z-index: 99;
        top: 10px;
        left: 50%;
        transform: translate(-50%);
        font-size: 13px;
        color: #fff;
        background: #e0271a;
        padding: 7px 20px;
        border-radius: 3px;

        &.success {
            background: rgb(18, 206, 67);
        }
    }
`;

const Main = styled.div`
    display: flex;
`;

let defaultVideoUrl = 'https://zhw2590582.github.io/assets-cdn/video/one-more-time-one-more-chance-480p.mp4';
let defaultSubtitleUrl = 'https://zhw2590582.github.io/assets-cdn/subtitle/one-more-time-one-more-chance.srt';
export default class App extends React.Component {
    state = {
        mainHeight: 100,
        videoUrl: '',
        subtitleUrl: '',
        subtitles: [],
    };

    componentDidMount() {
        this.uddateMainHeight();

        const resizeDebounce = debounce(() => {
            this.uddateMainHeight();
        }, 500);

        window.addEventListener('resize', resizeDebounce);

        const locationUrl = new URL(window.location.href);
        const subtitleUrl = decodeURIComponent(locationUrl.searchParams.get('subtitle') || '') || defaultSubtitleUrl;
        const videoUrl = decodeURIComponent(locationUrl.searchParams.get('video') || '') || defaultVideoUrl;

        readSubtitleFromUrl(subtitleUrl)
            .then(data => {
                const subtitleUrl = vttToUrl(data);
                this.updateSubtitleUrl(subtitleUrl);
                this.updateVideoUrl(videoUrl);
                urlToArr(subtitleUrl).then(subtitles => {
                    this.updateSubtitles(subtitles);
                });
            })
            .catch(error => {
                notice(error.message);
                throw error;
            });
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
        this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
    }

    editSubtitle(index) {
        const subtitles = this.state.subtitles.slice().map(item => {
            item.$edit = false;
            return item;
        });
        subtitles[index].$edit = true;
        this.setState({
            subtitles,
        });
    }

    updateSubtitle(index, subtitle) {
        const subtitles = this.state.subtitles.slice().map(item => {
            item.$edit = false;
            return item;
        });
        subtitles[index] = subtitle;
        this.setState({
            subtitles,
        });
        this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
    }

    updateVideoUrl(videoUrl) {
        this.setState(
            {
                videoUrl,
            },
            () => {
                notice('Update video successfully', true);
            },
        );
    }

    updateSubtitleUrl(subtitleUrl) {
        this.setState(
            {
                subtitleUrl,
            },
            () => {
                notice('Update subtitles successfully', true);
            },
        );
    }

    updateSubtitles(subtitles) {
        this.setState(
            {
                subtitles,
            },
            () => {
                notice('Update subtitles successfully', true);
            },
        );
    }

    render() {
        const functions = {
            ...this.state,
            removeSubtitle: this.removeSubtitle.bind(this),
            editSubtitle: this.editSubtitle.bind(this),
            updateSubtitle: this.updateSubtitle.bind(this),
            updateSubtitles: this.updateSubtitles.bind(this),
            updateVideoUrl: this.updateVideoUrl.bind(this),
            updateSubtitleUrl: this.updateSubtitleUrl.bind(this),
        };

        return (
            <React.Fragment>
                <GlobalStyle />
                <Header {...functions} />
                <Main
                    style={{
                        height: `${this.state.mainHeight}px`,
                    }}
                >
                    <Subtitle {...functions} />
                    <Player {...functions} />
                </Main>
                <Timeline {...functions} />
            </React.Fragment>
        );
    }
}
