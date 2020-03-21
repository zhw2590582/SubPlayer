import clamp from 'lodash/clamp';
import { timeToSecond, secondToTime } from '../utils';

export default class Sub {
    constructor(start, end, text) {
        this.start = start;
        this.end = end;
        this.text = text;
    }

    get check() {
        return this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime;
    }

    get clone() {
        return new Sub(this.start, this.end, this.text);
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
