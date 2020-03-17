import { getExt, secondToTime } from './utils';
import Sub from './sub';

export function checkIsFile(source) {
    return source instanceof File;
}

export function getType(source) {
    return checkIsFile(source) ? getExt(source.name) : getExt(source);
}

export async function getVtt(source) {
    if (checkIsFile(source)) {
        return await getVttFromFile(source);
    } else {
        return await getVttFromUrl(source);
    }
}

export function vttToUrl(vtt) {
    return URL.createObjectURL(
        new Blob([vtt], {
            type: 'text/vtt',
        }),
    );
}

export function vttToUrlUseWorker() {
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

export function subToVtt(sub) {
    return (
        'WEBVTT\n\n' +
        sub
            .map((item, index) => {
                return index + 1 + '\n' + item.start + ' --> ' + item.end + '\n' + item.text;
            })
            .join('\n\n')
    );
}

export async function getVttFromFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
            switch (getType(file)) {
                case 'vtt':
                    resolve(reader.result.replace(/{[\s\S]*?}/g, ''));
                    break;
                case 'ass':
                    resolve(assToVtt(reader.result));
                    break;
                case 'srt':
                    resolve(srtToVtt(reader.result));
                    break;
                default:
                    break;
            }
        };
        reader.readAsText(file);
    });
}

export async function getVttFromUrl(url) {
    return new Promise(async resolve => {
        const response = await fetch(url);
        const result = await response.text();
        switch (getType(url)) {
            case 'vtt':
                resolve(result.replace(/{[\s\S]*?}/g, ''));
                break;
            case 'ass':
                resolve(assToVtt(result));
                break;
            case 'srt':
                resolve(srtToVtt(result));
                break;
            default:
                break;
        }
    });
}

export function assToVtt(ass) {
    const re_ass = new RegExp(
        'Dialogue:\\s\\d,' +
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +
            '([^,]*),' +
            '([^,]*),' +
            '(?:[^,]*,){4}' +
            '([\\s\\S]*)$',
        'i',
    );

    function fixTime(time = '') {
        return time
            .split(/[:.]/)
            .map((item, index, arr) => {
                if (index === arr.length - 1) {
                    if (item.length === 1) {
                        return '.' + item + '00';
                    } else if (item.length === 2) {
                        return '.' + item + '0';
                    }
                } else {
                    if (item.length === 1) {
                        return (index === 0 ? '0' : ':0') + item;
                    }
                }

                return index === 0 ? item : index === arr.length - 1 ? '.' + item : ':' + item;
            })
            .join('');
    }

    return (
        'WEBVTT\n\n' +
        ass
            .split(/\r?\n/)
            .map(line => {
                const m = line.match(re_ass);
                if (!m) return null;
                return {
                    start: fixTime(m[1].trim()),
                    end: fixTime(m[2].trim()),
                    text: m[5]
                        .replace(/{[\s\S]*?}/g, '')
                        .replace(/(\\N)/g, '\n')
                        .trim()
                        .split(/\r?\n/)
                        .map(item => item.trim())
                        .join('\n'),
                };
            })
            .filter(line => line)
            .map((line, index) => {
                if (line) {
                    return index + 1 + '\n' + line.start + ' --> ' + line.end + '\n' + line.text;
                } else {
                    return '';
                }
            })
            .filter(line => line.trim())
            .join('\n\n')
    );
}

export function srtToVtt(srt) {
    return 'WEBVTT \r\n\r\n'.concat(
        srt
            .replace(/\{\\([ibu])\}/g, '</$1>')
            .replace(/\{\\([ibu])1\}/g, '<$1>')
            .replace(/\{([ibu])\}/g, '<$1>')
            .replace(/\{\/([ibu])\}/g, '</$1>')
            .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
            .replace(/{[\s\S]*?}/g, '')
            .concat('\r\n\r\n'),
    );
}

export async function getSubFromVttUrl(url) {
    return new Promise(resolve => {
        const $video = document.createElement('video');
        const $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        $video.appendChild($track);
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
