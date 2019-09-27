import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import NProgress from 'nprogress';
import toastr from 'toastr';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import translate from '../utils/translate';
import Storage from '../utils/storage';
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

    #toast-container.toast-top-right {
        top: 60px;

        & > div {
            box-shadow: none;
        }
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
    flex: 1;
`;

let defaultVideoUrl = 'https://zhw2590582.github.io/assets-cdn/video/fullmetal-alchemist-again.mp4';
let defaultSubtitleUrl = 'https://zhw2590582.github.io/assets-cdn/subtitle/fullmetal-alchemist-again.vtt';

export default class App extends React.Component {
    storage = new Storage();
    inTranslation = false;
    history = [];

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
        NProgress.configure({ parent: '.main' });

        const uddateMainSize = () => {
            this.setState({
                mainHeight: document.body.clientHeight - 250,
                mainWidth: document.body.clientWidth,
            });
        };

        const resizeDebounce = debounce(() => {
            uddateMainSize();
        }, 500);

        uddateMainSize();
        window.addEventListener('resize', resizeDebounce);

        const locationUrl = new URL(window.location.href);
        const locationSubtitleUrl =
            decodeURIComponent(locationUrl.searchParams.get('subtitle') || '') || defaultSubtitleUrl;
        const locationVideoUrl = decodeURIComponent(locationUrl.searchParams.get('video') || '') || defaultVideoUrl;

        const storageSubtitles = this.storage.get('subtitles');
        if (storageSubtitles) {
            const subtitleUrl = vttToUrl(arrToVtt(storageSubtitles));
            urlToArr(subtitleUrl).then(subtitles => {
                this.updateSubtitles(subtitles, true).then(() => {
                    this.updateVideoUrl(locationVideoUrl);
                    toastr.success('Initialize SubPlayer');
                });
            });
        } else {
            readSubtitleFromUrl(locationSubtitleUrl)
                .then(data => {
                    const subtitleUrl = vttToUrl(data);
                    urlToArr(subtitleUrl).then(subtitles => {
                        this.updateSubtitles(subtitles, true).then(() => {
                            this.updateVideoUrl(locationVideoUrl);
                            toastr.success('Initialize SubPlayer');
                        });
                    });
                })
                .catch(error => {
                    toastr.error(error.message);
                    throw error;
                });
        }
    }

    // 验证index在字幕数组范围内
    checkIndex(index) {
        return index >= 0 && index <= this.state.subtitles.length - 1;
    }

    // 删除单个字幕
    removeSubtitle(index) {
        if (!this.checkIndex(index)) return;
        const subtitles = this.state.subtitles;
        subtitles.splice(index, 1);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success('Delete a subtitle');
        });
    }

    // 激活单个字幕的编辑
    editSubtitle(index) {
        if (!this.checkIndex(index)) return;
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        subtitles[index].editing = true;
        this.updateSubtitles(subtitles);
        this.setState({
            currentTime: subtitles[index].startTime + 0.001,
        });
    }

    // 激活单个字幕的高亮
    highlightSubtitle(index) {
        if (!this.checkIndex(index)) return;
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            return item;
        });
        subtitles[index].highlight = true;
        this.updateSubtitles(subtitles);
    }

    // 更新单个字幕
    updateSubtitle(index, subtitle) {
        const subtitles = this.state.subtitles.map(item => {
            item.editing = false;
            return item;
        });
        const previous = subtitles[index - 1];
        if (subtitle) {
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
                    return previous && this.startTime < previous.endTime;
                },
                get reverse() {
                    return this.startTime >= this.endTime;
                },
            };
        } else {
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
        }

        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success('Update a subtitle');
            this.setState({
                currentIndex: index,
            });
        });
    }

    // 更新视频地址
    updateVideoUrl(videoUrl) {
        this.setState({
            videoUrl,
        });
    }

    // 更新字幕地址
    updateSubtitleUrl(subtitleUrl) {
        this.setState({
            subtitleUrl,
        });
    }

    // 更新所有字幕数据, 可选是否更新字幕地址
    updateSubtitles(subtitles, updateUrl) {
        return new Promise(resolve => {
            this.setState(
                {
                    subtitles,
                },
                () => {
                    const subtitles = this.state.subtitles;
                    if (updateUrl) {
                        this.updateSubtitleUrl(vttToUrl(arrToVtt(subtitles)));

                        if (this.history.length >= 100) {
                            this.history.shift();
                        }

                        this.history.push(
                            subtitles.map(item => {
                                return Object.getOwnPropertyNames(item).reduce((result, key) => {
                                    Object.defineProperty(result, key, Object.getOwnPropertyDescriptor(item, key));
                                    return result;
                                }, {});
                            }),
                        );

                        this.storage.set('subtitles', subtitles);
                    }
                    resolve(subtitles);
                },
            );
        });
    }

    // 从视频当前时间更新当前下标
    updateCurrentTime(currentTime) {
        const currentIndex = this.state.subtitles.findIndex(item => {
            return item.startTime <= currentTime && item.endTime >= currentTime;
        });
        this.highlightSubtitle(currentIndex);
        this.setState({
            currentIndex,
        });
    }

    // 下载字幕
    downloadSubtitles() {
        downloadFile(vttToUrl(arrToVtt(this.state.subtitles)), `${Date.now()}.vtt`);
        toastr.success('Download vtt subtitles');
    }

    // 删除空字幕
    removeEmptySubtitle() {
        const subtitles = this.state.subtitles.filter(item => item.text.trim());
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success('Remove empty subtitles');
        });
    }

    // 删除所有字幕
    removeAllSubtitle() {
        this.updateSubtitles([], true).then(() => {
            toastr.success('Remove all subtitles');
        });
    }

    // 整体字幕时间偏移
    timeOffset(time) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            item.start = secondToTime(clamp(item.startTime + time, 0, Infinity));
            item.end = secondToTime(clamp(item.endTime + time, 0, Infinity));
            return item;
        });
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(`Time offset: ${time}`);
        });
    }

    // 整体字幕翻译
    translate(land) {
        if (!this.inTranslation) {
            if (this.state.subtitles.length <= 1000) {
                this.inTranslation = true;
                translate(this.state.subtitles, land)
                    .then(subtitles => {
                        this.inTranslation = false;
                        this.updateSubtitles(subtitles, true).then(() => {
                            toastr.success('Translate subtitles');
                        });
                    })
                    .catch(error => {
                        toastr.error(error.message);
                        this.inTranslation = false;
                        throw error;
                    });
            } else {
                toastr.error('Currently translates up to 1000 subtitles at a time');
            }
        } else {
            toastr.error('Translation is in progress...');
        }
    }

    // 删除缓存
    removeCache() {
        this.storage.clean();
        window.location.reload();
    }

    render() {
        const props = {
            ...this.state,
            checkIndex: this.checkIndex.bind(this),
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
            timeOffset: this.timeOffset.bind(this),
            translate: this.translate.bind(this),
            removeCache: this.removeCache.bind(this),
        };

        return (
            <React.Fragment>
                <GlobalStyle />
                <Header {...props} />
                <Main className="main">
                    <Subtitle {...props} />
                    <Player {...props} />
                </Main>
                <Timeline {...props} />
            </React.Fragment>
        );
    }
}
