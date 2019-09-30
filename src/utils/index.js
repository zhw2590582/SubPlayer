import DT from 'duration-time-conversion';
import assToVtt from './assToVtt';
import Sub from './sub';

export function checkTime(time) {
    return /^(\d+):([0-5][0-9]):([0-5][0-9])\.\d{3}$/.test(time);
}

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export function getExt(url) {
    if (url.includes('?')) {
        return getExt(url.split('?')[0]);
    }

    if (url.includes('#')) {
        return getExt(url.split('#')[0]);
    }

    return url
        .trim()
        .toLowerCase()
        .split('.')
        .pop();
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function secondToTime(seconds = 0) {
    return DT.d2t(seconds.toFixed(3));
}

export function timeToSecond(time) {
    return DT.t2d(time);
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

export function urlToArr(url) {
    return new Promise((resolve, reject) => {
        const $video = document.createElement('video');
        const $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        $video.appendChild($track);
        $track.onerror = error => {
            reject(error);
        };
        $track.onload = () => {
            resolve(
                Array.from($track.track.cues).map(item => {
                    const start = secondToTime(item.startTime);
                    const end = secondToTime(item.endTime);
                    const text = item.text;
                    return new Sub(start, end, text);
                }),
            );
        };
        $track.src = url;
    });
}

export function vttToUrl(vttText) {
    return URL.createObjectURL(
        new Blob([vttText], {
            type: 'text/vtt',
        }),
    );
}

export function vttToUrlWorker() {
    return URL.createObjectURL(
        new Blob([
            `onmessage = event => {
                postMessage(URL.createObjectURL(
                    new Blob([
                        \`WEBVTT

                        \${event.data.map((item, index) => \`
                        \${index + 1}
                        \${item.start} --> \${item.end}
                        \${item.text}\`).join('\\n\\n')}
                        \`
                    ], {
                        type: 'text/vtt',
                    }),
                ))
            }`,
        ]),
    );
}

export function arrToVtt(arr) {
    return (
        'WEBVTT\n\n' +
        arr
            .map((item, index) => {
                return index + 1 + '\n' + item.start + ' --> ' + item.end + '\n' + item.text;
            })
            .join('\n\n')
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
            .replace(/{[\s\S]*?}/g, '')
            .concat('\r\n\r\n'),
    );
}

export function readSubtitleFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const type = getExt(file.name);
        reader.onload = () => {
            if (type === 'srt') {
                resolve(srtToVtt(reader.result));
            } else if (type === 'ass') {
                resolve(assToVtt(reader.result));
            } else {
                resolve(reader.result.replace(/{[\s\S]*?}/g, ''));
            }
        };
        reader.onerror = error => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

export async function readSubtitleFromUrl(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const type = getExt(url);
        if (type === 'srt') {
            return srtToVtt(text);
        }
        if (type === 'ass') {
            return assToVtt(text);
        }
        return text.replace(/{[\s\S]*?}/g, '');
    } catch (error) {
        throw error;
    }
}

export function downloadFile(url, name) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}

export function escapeHTML(str) {
    return str.replace(
        /[&<>'"]/g,
        tag =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
            }[tag] || tag),
    );
}

export function unescapeHTML(str) {
    return str.replace(
        /&amp;|&lt;|&gt;|&#39;|&quot;/g,
        tag =>
            ({
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&#39;': "'",
                '&quot;': '"',
            }[tag] || tag),
    );
}

export function getSearchParams(name) {
    const locationUrl = new URL(window.location.href);
    return decodeURIComponent(locationUrl.searchParams.get(name) || '');
}
