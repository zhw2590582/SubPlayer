import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import toastr from 'toastr';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import { debounce, arrToVtt, vttToUrl, readSubtitleFromUrl, urlToArr, timeToSecond, downloadFile } from '../utils';

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
        currentTime: -1,
        currentIndex: -1,
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
                toastr.error(error.message);
                throw error;
            });
    }

    uddateMainHeight() {
        this.setState({
            mainHeight: document.body.clientHeight - 250,
        });
    }

    removeSubtitle(index) {
        const subtitles = this.state.subtitles;
        subtitles.splice(index, 1);
        this.setState({
            subtitles,
        });
        this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
    }

    editSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.$highlight = false;
            item.$edit = false;
            return item;
        });
        subtitles[index].$edit = true;
        this.setState({
            subtitles,
            currentTime: subtitles[index].startTime + 0.001,
        });
    }

    highlightSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.$highlight = false;
            return item;
        });
        subtitles[index].$highlight = true;
        this.setState({
            subtitles,
        });
    }

    updateSubtitle(index, subtitle) {
        const subtitles = this.state.subtitles.map(item => {
            item.$edit = false;
            return item;
        });
        subtitles[index] = {
            ...subtitle,
            get startTime() {
                return timeToSecond(this.start);
            },
            get endTime() {
                return timeToSecond(this.end);
            },
            get duration() {
                return (this.endTime - this.startTime).toFixed(3);
            },
        };
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
                toastr.success('Update video successfully');
            },
        );
    }

    updateSubtitleUrl(subtitleUrl) {
        this.setState(
            {
                subtitleUrl,
            },
            () => {
                toastr.success('Update subtitles successfully');
            },
        );
    }

    updateSubtitles(subtitles) {
        this.setState({
            subtitles,
        });
    }

    updateCurrentTime(currentTime) {
        const currentIndex = this.state.subtitles.length
            ? this.state.subtitles.findIndex(item => {
                  return item.startTime <= currentTime && item.endTime >= currentTime;
              })
            : -1;
        if (currentIndex !== -1) {
            this.highlightSubtitle(currentIndex);
        }
        this.setState({
            currentIndex,
        });
    }

    downloadSubtitles() {
        downloadFile(vttToUrl(arrToVtt(this.state.subtitles)), `${Date.now()}.vtt`);
    }

    render() {
        const functions = {
            ...this.state,
            removeSubtitle: this.removeSubtitle.bind(this),
            editSubtitle: this.editSubtitle.bind(this),
            highlightSubtitle: this.highlightSubtitle.bind(this),
            updateSubtitle: this.updateSubtitle.bind(this),
            updateSubtitles: this.updateSubtitles.bind(this),
            updateVideoUrl: this.updateVideoUrl.bind(this),
            updateSubtitleUrl: this.updateSubtitleUrl.bind(this),
            updateCurrentTime: this.updateCurrentTime.bind(this),
            downloadSubtitles: this.downloadSubtitles.bind(this),
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
