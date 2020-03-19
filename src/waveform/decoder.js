import throttle from 'lodash/throttle';
import { errorHandle, mergeBuffer } from './utils';

export default class Decoder {
    constructor(wf) {
        this.wf = wf;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.throttleDecodeAudioData = throttle(this.decodeAudioData, 500);
        this.audiobuffer = this.audioCtx.createBuffer(2, 22050, 44100);
        this.channelData = new Float32Array();
        this.data = new Uint8Array();

        this.wf.on('loading', uint8 => {
            if (wf.options.manualDecode) {
                this.data = mergeBuffer(this.data, uint8);
            } else {
                this.throttleDecodeAudioData(uint8);
            }
        });
    }

    manualDecode() {
        this.decodeAudioData(this.data);
    }

    decodeAudioData(uint8) {
        const {
            options: { channel },
            duration,
        } = this.wf;
        this.audioCtx
            .decodeAudioData(uint8.buffer)
            .then(audiobuffer => {
                this.audiobuffer = audiobuffer;
                this.wf.emit('audiobuffer', this.audiobuffer);
                this.wf.emit('decodeing', this.audiobuffer.duration / duration);
                this.channelData = audiobuffer.getChannelData(channel);
                this.wf.emit('channelData', this.channelData);
            })
            .catch(error => {
                errorHandle(false, `It seems that the AudioContext decoding get wrong: ${error.message.trim()}`);
            });
    }

    destroy() {
        this.audiobuffer = this.audioCtx.createBuffer(2, 22050, 44100);
        this.channelData = new Float32Array();
    }
}
