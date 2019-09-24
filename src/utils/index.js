export function checkTime(time) {
    return /^(\d+):([0-5][0-9]):([0-5][0-9])\.\d{3}$/.test(time);
}

export function checkDuration(duration) {
    return /^\d+\.\d{3}/.test(duration);
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function timeToSecond(time) {
    const fractional = `0.${time.split('.')[1]}`;
    const integerArr = time.split('.')[0].split(':');
    return Number(integerArr[0]) * 60 * 60 + Number(integerArr[1]) * 60 + Number(integerArr[2]) + Number(fractional);
}

export function debounce(func, wait, context) {
    let timeout;
    return function fn(...args) {
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function notice(text) {
    const $el = document.createElement('div');
    $el.innerText = text;
    $el.classList.add('notice');
    document.body.appendChild($el);
    setTimeout(() => {
        document.body.removeChild($el);
    }, 3000);
}

export function vttToBlob(vttText) {
    return URL.createObjectURL(
        new Blob([vttText], {
            type: 'text/vtt',
        }),
    );
}

export function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(
        srtText
            .replace(/\{\\([ibu])\}/g, '</$1>')
            .replace(/\{\\([ibu])1\}/g, '<$1>')
            .replace(/\{([ibu])\}/g, '<$1>')
            .replace(/\{\/([ibu])\}/g, '</$1>')
            .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
            .concat('\r\n\r\n'),
    );
}
