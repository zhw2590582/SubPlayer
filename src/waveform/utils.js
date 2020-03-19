import DT from 'duration-time-conversion';

export class WFPlayerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WFPlayerError';
    }
}

export function errorHandle(condition, msg) {
    if (!condition) {
        throw new WFPlayerError(msg);
    }
    return condition;
}

export function durationToTime(duration = 0) {
    return DT.d2t(duration.toFixed(3));
}

export function timeToDuration(time) {
    return DT.t2d(time);
}

export function mergeBuffer(...buffers) {
    const Cons = buffers[0].constructor;
    return buffers.reduce((pre, val) => {
        const merge = new Cons((pre.byteLength | 0) + (val.byteLength | 0));
        merge.set(pre, 0);
        merge.set(val, pre.byteLength | 0);
        return merge;
    }, new Cons());
}

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function setStyle(element, key, value) {
    if (typeof key === 'object') {
        Object.keys(key).forEach(item => {
            setStyle(element, item, key[item]);
        });
    }
    element.style[key] = value;
    return element;
}