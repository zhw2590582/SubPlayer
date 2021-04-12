import { sleep } from '../utils';

function translate(query = '', lang) {
    if (!query.trim()) return Promise.resolve('');
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', 'auto');
    url.searchParams.append('dt', 't');
    url.searchParams.append('tl', lang);
    url.searchParams.append('q', query);

    return new Promise((resolve, reject) => {
        fetch(url.href)
            .then((data) => data.json())
            .then((data) => {
                if (data) {
                    resolve(data[0].map((item) => item[0].trim()).join('\n'));
                } else {
                    resolve('');
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export default async function googleTranslate(subtitle = [], lang) {
    return new Promise((resolve, reject) => {
        const result = [];
        (function loop() {
            const item = subtitle.shift();
            if (item) {
                translate(item.text, lang)
                    .then((text) => {
                        item.text = text;
                        result.push(item);
                        sleep(100).then(loop);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                resolve(result);
            }
        })();
    });
}
