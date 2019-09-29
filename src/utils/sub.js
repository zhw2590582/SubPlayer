import { timeToSecond, secondToTime, clamp } from './index';

export default class Sub {
    constructor(start, end, text) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.editing = false;
        this.highlight = false;
    }

    get check() {
        return this.startTime > 0 && this.endTime > 0 && this.startTime < this.endTime;
    }

    get startTime() {
        return timeToSecond(this.start);
    }

    set startTime(time) {
        this.start = secondToTime(clamp(time, 0, Infinity));
    }

    get endTime() {
        return timeToSecond(this.end);
    }

    set endTime(time) {
        this.end = secondToTime(clamp(time, 0, Infinity));
    }

    get duration() {
        return (this.endTime - this.startTime).toFixed(3);
    }
}
