import NProgress from 'nprogress';
import pLimit from 'p-limit';
import { sleep, notify } from '../utils/index';

export function googleTranslate(query = '', lang) {
    if (!query.trim()) return Promise.resolve('');
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', 'auto');
    url.searchParams.append('dt', 't');
    url.searchParams.append('tl', lang);
    url.searchParams.append('q', query);

    return new Promise(resolve => {
        sleep().then(async () => {
            fetch(url.href)
                .then(data => data.json())
                .then(data => {
                    if (data) {
                        resolve(data[0].map(item => item[0].trim()).join('\n'));
                    } else {
                        resolve('');
                    }
                })
                .catch(error => {
                    notify(error.message, 'error');
                    resolve('');
                });
        });
    });
}

export default async function translate(subtitles, lang) {
    NProgress.start();
    const limit = pLimit(1);
    let index = 0;

    try {
        const result = await Promise.all(
            subtitles.map(item =>
                limit(async () => {
                    const data = await googleTranslate(item.text, lang);
                    NProgress.set(++index / subtitles.length);
                    if (data) {
                        item.text = data;
                    }
                    return item;
                }),
            ),
        );
        NProgress.done();
        return result;
    } catch (error) {
        NProgress.done();
        notify(error.message, 'error');
    }
}
