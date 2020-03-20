import validator from 'option-validator';
import Emitter from './emitter';
import Events from './events';
import Template from './template';
import Drawer from './drawer';
import Decoder from './decoder';
import Loader from './loader';
import Controller from './controller';
import { timeToDuration, clamp, errorHandle } from './utils';

let id = 0;
const instances = [];
export default class WFPlayer extends Emitter {
    static get instances() {
        return instances;
    }

    static get version() {
        return '__VERSION__';
    }

    static get env() {
        return '__ENV__';
    }

    static get default() {
        return {
            container: '#waveform',
            mediaElement: null,
            wave: true,
            waveColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgb(28, 32, 34)',
            paddingColor: 'rgba(255, 255, 255, 0.05)',
            cursor: true,
            cursorColor: '#ff0000',
            progress: true,
            progressColor: 'rgba(255, 255, 255, 0.5)',
            grid: true,
            gridColor: 'rgba(255, 255, 255, 0.05)',
            ruler: true,
            rulerColor: 'rgba(255, 255, 255, 0.5)',
            rulerAtTop: true,
            withCredentials: false,
            cors: false,
            headers: {},
            channel: 0,
            duration: 10,
            padding: 5,
            waveScale: 0.8,
            pixelRatio: window.devicePixelRatio,
        };
    }

    static get scheme() {
        const checkNum = (name, min, max, isInteger) => (value, type) => {
            errorHandle(type === 'number', `${name} expects to receive number as a parameter, but got ${type}.`);
            errorHandle(
                value >= min && value <= max && (isInteger ? Number.isInteger(value) : true),
                `'options.${name}' expect ${
                    isInteger ? 'an integer ' : 'a '
                }number that >= ${min} and <= ${max}, but got ${value}.`,
            );
            return true;
        };

        return {
            container: 'htmlelement|htmldivelement',
            mediaElement: 'null|htmlvideoelement|htmlaudioelement',
            wave: 'boolean',
            waveColor: 'string',
            backgroundColor: 'string',
            paddingColor: 'string',
            cursor: 'boolean',
            cursorColor: 'string',
            progress: 'boolean',
            progressColor: 'string',
            grid: 'boolean',
            gridColor: 'string',
            ruler: 'boolean',
            rulerColor: 'string',
            rulerAtTop: 'boolean',
            withCredentials: 'boolean',
            cors: 'boolean',
            headers: 'object',
            channel: checkNum('channel', 0, 5, true),
            duration: checkNum('duration', 1, 100, true),
            padding: checkNum('padding', 1, 100, true),
            waveScale: checkNum('waveScale', 0.1, 10, false),
            pixelRatio: checkNum('pixelRatio', 1, 10, false),
        };
    }

    constructor(options = {}) {
        super();

        this._currentTime = 0;
        this.isDestroy = false;
        this.options = {};
        this.setOptions(options);

        this.events = new Events(this);
        this.template = new Template(this);
        this.decoder = new Decoder(this);
        this.drawer = new Drawer(this);
        this.controller = new Controller(this);
        this.loader = new Loader(this);

        id += 1;
        this.id = id;
        instances.push(this);
    }

    get currentTime() {
        return this.options.mediaElement ? this.options.mediaElement.currentTime : this._currentTime;
    }

    get duration() {
        return this.options.mediaElement ? this.options.mediaElement.duration : timeToDuration('99:59:59.999');
    }

    get playing() {
        const { mediaElement } = this.options;
        if (mediaElement) {
            return !!(
                mediaElement.currentTime > 0 &&
                !mediaElement.paused &&
                !mediaElement.ended &&
                mediaElement.readyState > 2
            );
        }
        return false;
    }

    setOptions(options = {}) {
        errorHandle(validator.kindOf(options) === 'object', 'setOptions expects to receive object as a parameter.');

        if (typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }

        if (typeof options.mediaElement === 'string') {
            options.mediaElement = document.querySelector(options.mediaElement);
        }

        this.options = validator(
            {
                ...WFPlayer.default,
                ...this.options,
                ...options,
            },
            WFPlayer.scheme,
        );

        this.emit('options', this.options);
        return this;
    }

    load(target) {
        if (target instanceof HTMLVideoElement || target instanceof HTMLAudioElement) {
            this.options.mediaElement = target;
            target = target.src;
        }
        errorHandle(
            typeof target === 'string' && target.trim(),
            `The load target is not a string. If you are loading a mediaElement, make sure the mediaElement.src is not empty.`,
        );
        this.loader.load(target);
        this.emit('load');
        return this;
    }

    seek(second) {
        errorHandle(typeof second === 'number', 'seek expects to receive number as a parameter.');
        this._currentTime = clamp(second, 0, this.duration);
        if (this.options.mediaElement && this.options.mediaElement.currentTime !== this._currentTime) {
            this.options.mediaElement.currentTime = this._currentTime;
        }
        this.drawer.update();
        return this;
    }

    changeChannel(channel) {
        this.setOptions({ channel });
        this.decoder.changeChannel(channel);
    }

    exportImage() {
        this.template.exportImage();
        return this;
    }

    destroy() {
        this.isDestroy = true;
        this.events.destroy();
        this.template.destroy();
        this.controller.destroy();
        this.decoder.destroy();
        this.loader.destroy();
        instances.splice(instances.indexOf(this), 1);
    }
}
