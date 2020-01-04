import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { t, setLocale } from 'react-i18nify';
import toastr from 'toastr';
import Header from './Header';
import Subtitle from './Subtitle';
import Timeline from './Timeline';
import Player from './Player';
import translate from '../utils/translate';
import Storage from '../utils/storage';
import Sub from '../utils/sub';
import {
    debounce,
    arrToVtt,
    vttToUrl,
    vttToUrlWorker,
    readSubtitleFromUrl,
    urlToArr,
    downloadFile,
    secondToTime,
    clamp,
    sleep,
    getSearchParams,
} from '../utils';

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
        line-height: 1.5;
        height: 100%;
        overflow: hidden;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #ccc;
        background: rgb(28,32,26);
    }

    #toast-container.toast-top-right {
        top: 60px;

        & > div {
            box-shadow: none;
        }
    }

    #nprogress .bar {
        top: 50px !important;

        .peg {
            display: none !important;
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
    position: relative;
    display: flex;
    flex: 1;
`;

let defaultVideoUrl = 'https://zhw2590582.github.io/assets-cdn/video/fullmetal-alchemist-again.mp4';
let defaultSubtitleUrl = 'https://zhw2590582.github.io/assets-cdn/subtitle/fullmetal-alchemist-again.vtt';

export default class App extends React.Component {
    vttToUrl = new Worker(vttToUrlWorker());
    storage = new Storage();
    inTranslation = false;
    history = [];

    state = {
        art: null,
        lang: 'en',
        mainHeight: 100,
        mainWidth: 100,
        videoUrl: '',
        subtitleUrl: '',
        currentTime: 0,
        currentIndex: -1,
        overallOffset: false,
        subtitles: [],
    };

    componentDidMount() {
        this.setLocale(this.storage.get('lang') || 'en');

        const uddateMainSize = () => {
            this.setState({
                mainHeight: document.body.clientHeight - 200,
                mainWidth: document.body.clientWidth,
            });
        };

        const resizeDebounce = debounce(() => {
            uddateMainSize();
        }, 500);

        uddateMainSize();
        window.addEventListener('resize', resizeDebounce);

        const locationSubtitleUrl = getSearchParams('subtitle') || defaultSubtitleUrl;
        const locationVideoUrl = getSearchParams('video') || defaultVideoUrl;
        const storageSubtitles = this.storage.get('subtitles');

        if (storageSubtitles) {
            const subtitleUrl = vttToUrl(arrToVtt(storageSubtitles));
            urlToArr(subtitleUrl)
                .then(subtitles => {
                    this.updateSubtitles(subtitles, true).then(() => {
                        this.updateVideoUrl(locationVideoUrl);
                    });
                })
                .catch(error => {
                    toastr.error(error.message);
                    throw error;
                });
        } else {
            readSubtitleFromUrl(locationSubtitleUrl)
                .then(data => {
                    const subtitleUrl = vttToUrl(data);
                    urlToArr(subtitleUrl)
                        .then(subtitles => {
                            this.updateSubtitles(subtitles, true).then(() => {
                                this.updateVideoUrl(locationVideoUrl);
                            });
                        })
                        .catch(error => {
                            toastr.error(error.message);
                            throw error;
                        });
                })
                .catch(error => {
                    toastr.error(error.message);
                    throw error;
                });
        }

        this.vttToUrl.onmessage = event => {
            this.updateSubtitleUrl(event.data);
        };
    }

    // 验证字幕在数组范围内
    checkSub(sub) {
        return this.state.subtitles.includes(sub);
    }

    // 验证字幕是否不规范
    checkSubtitleIllegal(sub) {
        const subtitles = this.state.subtitles;
        const index = subtitles.indexOf(sub);
        const previous = subtitles[index - 1];
        return (previous && sub.startTime < previous.endTime) || !sub.check;
    }

    // 获取播放器
    getArt(art) {
        this.setState({
            art,
        });
    }

    // 删除单个字幕
    removeSubtitle(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles;
        const index = subtitles.indexOf(sub);
        subtitles.splice(index, 1);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('delete'));
        });
    }

    // 激活单个字幕的编辑
    editSubtitle(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        sub.editing = true;
        this.updateSubtitles(subtitles).then(() => {
            this.videoSeek(sub);
        });
    }

    // 视频跳转到某个字幕的开始时间, 可选是否播放
    videoSeek(sub, isPlay) {
        const { art } = this.state;
        // This allows that video are not loaded.
        if (art !== null) {
            const currentTime = sub.startTime + 0.001;
            if (!art.playing && currentTime > 0 && currentTime !== art.currentTime && art.duration) {
                if (currentTime <= art.duration) {
                    // 由于字幕url是异步的，需要时间去同步
                    sleep(300).then(() => {
                        art.seek = currentTime;
                        if (isPlay) {
                            art.play = true;
                        }
                    });
                } else {
                    toastr.warning(t('durationLimit'));
                }
            }
        }
    }

    // 激活单个字幕的高亮
    highlightSubtitle(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            return item;
        });
        sub.highlight = true;
        this.updateSubtitles(subtitles);
    }

    // 更新单个字幕
    updateSubtitle(index, sub) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });

        subtitles[index] = sub;
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('update'));
            this.updateCurrentIndex(sub);
        });
    }

    // 插入单个新字幕
    insertSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        const previous = subtitles[index - 1];
        const start = previous ? secondToTime(previous.endTime + 0.001) : '00:00:00.001';
        const end = previous ? secondToTime(previous.endTime + 1.001) : '00:00:01.001';
        const text = t('your');
        const sub = new Sub(start, end, text);
        sub.highlight = true;
        subtitles.splice(index, 0, sub);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('add'));
            this.updateCurrentIndex(sub);
        });
    }

    // 合并当前与下一个字幕
    mergeSubtitle(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles;
        const index = subtitles.indexOf(sub);
        const current = subtitles[index];
        const next = subtitles[index + 1];
        if (!next) return;
        const merge = new Sub(current.start, next.end, current.text + '\n' + next.text);
        merge.highlight = true;
        subtitles[index] = merge;
        subtitles.splice(index + 1, 1);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('merge'));
            this.updateCurrentIndex(sub);
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

    // 更新所有字幕数据, 可选是否更新字幕地址和是否回退操作
    updateSubtitles(subtitles, updateUrl, isUndo) {
        return new Promise(resolve => {
            this.setState(
                {
                    subtitles: subtitles,
                },
                () => {
                    const subtitles = this.state.subtitles;
                    if (updateUrl) {
                        this.vttToUrl.postMessage(subtitles);

                        if (!isUndo) {
                            if (this.history.length >= 100) {
                                this.history.shift();
                            }
                            this.history.push(subtitles.map(sub => sub.clone));
                        }

                        this.storage.set(
                            'subtitles',
                            subtitles.map(item => ({
                                start: item.start,
                                end: item.end,
                                text: item.text,
                            })),
                        );
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
        this.setState(
            {
                currentTime,
            },
            () => {
                const sub = this.state.subtitles[currentIndex];
                this.highlightSubtitle(sub);
                this.updateCurrentIndex(sub);
            },
        );
    }

    // 滚动到某个字幕
    updateCurrentIndex(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles;
        const index = subtitles.indexOf(sub);
        this.setState({
            currentIndex: index,
        });
    }

    // 下载字幕
    downloadSubtitles() {
        downloadFile(vttToUrl(arrToVtt(this.state.subtitles)), `${Date.now()}.vtt`);
        toastr.success(t('download'));
    }

    // 删除空字幕
    removeEmptySubtitle() {
        const subtitles = this.state.subtitles.filter(item => item.text.trim());
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('removeEmpty'));
        });
    }

    // 删除所有字幕
    removeAllSubtitle() {
        this.updateSubtitles([], true).then(() => {
            toastr.success(t('removeAll'));
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
            toastr.success(`${t('offset')}: ${time}s`);
        });
    }

    // 整体字幕翻译
    translate(land, translator) {
        if (!this.inTranslation) {
            if (this.state.subtitles.length <= 1000) {
                this.inTranslation = true;
                translate(this.state.subtitles, land, translator)
                    .then(subtitles => {
                        this.inTranslation = false;
                        this.updateSubtitles(subtitles, true).then(() => {
                            toastr.success(t('translate'));
                        });
                    })
                    .catch(error => {
                        toastr.error(error.message);
                        this.inTranslation = false;
                        throw error;
                    });
            } else {
                toastr.error(t('translateLenght'));
            }
        } else {
            toastr.error(t('translateProgress'));
        }
    }

    // 删除缓存
    removeCache() {
        this.storage.del('subtitles');
        window.location.reload();
    }

    // 历史回滚
    undoSubtitle() {
        this.history.pop();
        const subtitles = this.history[this.history.length - 1];
        if (subtitles) {
            this.updateSubtitles(subtitles, true, true).then(() => {
                toastr.success(t('history'));
            });
        } else {
            toastr.warning(t('historyEmpty'));
        }
    }

    // 设置语言
    setLocale(lang) {
        this.setState(
            {
                lang,
            },
            () => {
                setLocale(lang);
                this.storage.set('lang', lang);
            },
        );
    }

    // 时间轴整体偏移开关
    overallOffsetSwitch() {
        this.setState({
            overallOffset: !this.state.overallOffset,
        });
    }

    getLocale() {
        return this.storage.get('lang');
    }

    render() {
        const props = {
            ...this.state,
            getLocale: this.getLocale.bind(this),
            checkSubtitleIllegal: this.checkSubtitleIllegal.bind(this),
            removeSubtitle: this.removeSubtitle.bind(this),
            editSubtitle: this.editSubtitle.bind(this),
            highlightSubtitle: this.highlightSubtitle.bind(this),
            updateSubtitle: this.updateSubtitle.bind(this),
            updateSubtitles: this.updateSubtitles.bind(this),
            updateVideoUrl: this.updateVideoUrl.bind(this),
            updateSubtitleUrl: this.updateSubtitleUrl.bind(this),
            updateCurrentTime: this.updateCurrentTime.bind(this),
            updateCurrentIndex: this.updateCurrentIndex.bind(this),
            downloadSubtitles: this.downloadSubtitles.bind(this),
            removeEmptySubtitle: this.removeEmptySubtitle.bind(this),
            removeAllSubtitle: this.removeAllSubtitle.bind(this),
            mergeSubtitle: this.mergeSubtitle.bind(this),
            insertSubtitle: this.insertSubtitle.bind(this),
            overallOffsetSwitch: this.overallOffsetSwitch.bind(this),
            videoSeek: this.videoSeek.bind(this),
            timeOffset: this.timeOffset.bind(this),
            translate: this.translate.bind(this),
            removeCache: this.removeCache.bind(this),
            undoSubtitle: this.undoSubtitle.bind(this),
            setLocale: this.setLocale.bind(this),
            getArt: this.getArt.bind(this),
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
