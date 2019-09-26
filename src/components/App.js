import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import toastr from 'toastr';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import {
    debounce,
    arrToVtt,
    vttToUrl,
    readSubtitleFromUrl,
    urlToArr,
    timeToSecond,
    downloadFile,
    secondToTime,
    clamp,
} from '../utils';

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

    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #666;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
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
        mainWidth: 100,
        videoUrl: '',
        subtitleUrl: '',
        currentTime: -1,
        currentIndex: -1,
        subtitles: [],
    };

    componentDidMount() {
        this.uddateMainSize();

        const resizeDebounce = debounce(() => {
            this.uddateMainSize();
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

    uddateMainSize() {
        this.setState({
            mainHeight: document.body.clientHeight - 250,
            mainWidth: document.body.clientWidth,
        });
    }

    removeSubtitle(index) {
        const subtitles = this.state.subtitles;
        subtitles.splice(index, 1);
        this.setState(
            {
                subtitles,
            },
            () => {
                this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
            },
        );
    }

    editSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        subtitles[index].editing = true;
        this.setState({
            subtitles,
            currentTime: subtitles[index].startTime + 0.001,
        });
    }

    highlightSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            return item;
        });
        subtitles[index].highlight = true;
        this.setState({
            subtitles,
        });
    }

    updateSubtitle(index, subtitle) {
        const subtitles = this.state.subtitles.map(item => {
            item.editing = false;
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
            get overlapping() {
                return subtitles[index - 1] && this.startTime < subtitles[index - 1].endTime;
            },
            get reverse() {
                return this.startTime >= this.endTime;
            },
        };
        this.setState(
            {
                subtitles,
            },
            () => {
                this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
            },
        );
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

    removeEmptySubtitle() {
        const subtitles = this.state.subtitles.filter(item => item.text.trim());
        this.setState(
            {
                subtitles,
            },
            () => {
                this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
            },
        );
    }

    removeAllSubtitle() {
        this.setState(
            {
                subtitles: [],
            },
            () => {
                this.updateSubtitleUrl('');
            },
        );
    }

    addSubtitle(index) {
        const subtitles = this.state.subtitles;
        const previous = subtitles[index - 1];
        subtitles.splice(index, 0, {
            editing: false,
            highlight: false,
            id: index,
            start: previous ? secondToTime(previous.endTime + 0.001) : '00:00:00.000',
            end: previous ? secondToTime(previous.endTime + 0.002) : '00:00:00.000',
            text: 'Your Subtitle Text',
            get startTime() {
                return timeToSecond(this.start);
            },
            get endTime() {
                return timeToSecond(this.end);
            },
            get duration() {
                return (this.endTime - this.startTime).toFixed(3);
            },
            get overlapping() {
                return previous && this.startTime < previous.endTime;
            },
            get reverse() {
                return this.startTime >= this.endTime;
            },
        });
        this.setState(
            {
                subtitles,
            },
            () => {
                this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
                this.setState({
                    currentIndex: index,
                });
            },
        );
    }

    timeOffset(time) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            item.start = secondToTime(clamp(item.startTime + time, 0, Infinity));
            item.end = secondToTime(clamp(item.endTime + time, 0, Infinity));
            return item;
        });
        this.setState(
            {
                subtitles,
            },
            () => {
                this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));
            },
        );
    }

    googleTranslate(land) {
        console.log(land);
    }

    render() {
        const props = {
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
            removeEmptySubtitle: this.removeEmptySubtitle.bind(this),
            removeAllSubtitle: this.removeAllSubtitle.bind(this),
            addSubtitle: this.addSubtitle.bind(this),
            timeOffset: this.timeOffset.bind(this),
            googleTranslate: this.googleTranslate.bind(this),
        };

        return (
            <React.Fragment>
                <GlobalStyle />
                <Header {...props} />
                <Main>
                    <Subtitle {...props} />
                    <Player {...props} />
                </Main>
                <Timeline {...props} />
            </React.Fragment>
        );
    }
}
