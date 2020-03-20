import throttle from 'lodash/throttle';
import { clamp } from './utils';

export default class Controller {
    constructor(wf) {
        this.wf = wf;
        this.playTimer = null;
        this.wf.on('load', () => {
            this.clickInit();
            this.resizeInit();
            this.playInit();
        });
    }

    getTimeFromEvent(event) {
        const {
            currentTime,
            template: { canvas },
            options: { duration, padding, container, pixelRatio },
        } = this.wf;
        const gridNum = duration * 10 + padding * 2;
        const gridGap = canvas.width / gridNum;
        const left = clamp(event.pageX - container.offsetLeft - (padding * gridGap) / pixelRatio, 0, Infinity);
        const beginTime = Math.floor(currentTime / duration) * duration;
        const time = clamp(((left / gridGap) * pixelRatio) / 10 + beginTime, beginTime, beginTime + duration);
        return time;
    }

    clickInit() {
        const {
            template: { canvas },
            events: { proxy },
            options: { mediaElement },
        } = this.wf;
        proxy(canvas, ['click', 'contextmenu'], event => {
            const time = this.getTimeFromEvent(event);
            this.wf.emit(event.type, time, event);
            if (mediaElement && mediaElement.currentTime !== time) {
                mediaElement.currentTime = time;
            }
            this.wf.drawer.update();
        });
    }

    resizeInit() {
        const {
            template,
            drawer,
            events: { proxy },
        } = this.wf;

        const throttleResize = throttle(() => {
            template.update();
            drawer.update();
            this.wf.emit('resize');
        }, 500);

        proxy(window, ['resize', 'orientationchange'], () => {
            throttleResize();
        });
    }

    playInit() {
        const {
            drawer,
            events: { proxy },
            options: { mediaElement },
        } = this.wf;
        if (!mediaElement) return;

        proxy(mediaElement, 'seeked', () => {
            drawer.update();
        });

        (function loop() {
            this.playTimer = requestAnimationFrame(() => {
                if (this.wf.playing) {
                    drawer.update();
                    this.wf.emit('playing', mediaElement.currentTime);
                }

                if (!this.wf.isDestroy) {
                    loop.call(this);
                }
            });
        }.call(this));
    }

    destroy() {
        cancelAnimationFrame(this.playTimer);
    }
}
