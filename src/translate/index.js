import fetchJsonp from 'fetch-jsonp';
import NProgress from 'nprogress';
import toastr from 'toastr';
import pLimit from 'p-limit';
import MD5 from './md5';
import { sleep } from '../utils/index';

export function baiduTranslate(query, land) {
    return new Promise(resolve => {
        const appid = '20190926000337502';
        const key = 'AyDT0yVJk43C8mgzspBY';
        const salt = Date.now();

        const url = new URL('https://fanyi-api.baidu.com/api/trans/vip/translate');
        url.searchParams.append('q', query);
        url.searchParams.append('appid', appid);
        url.searchParams.append('salt', salt);
        url.searchParams.append('from', 'auto');
        url.searchParams.append('to', land);
        url.searchParams.append('sign', MD5(appid + query + salt + key));

        sleep().then(async () => {
            try {
                const data = await fetchJsonp(url.href);
                const result = await data.json();
                if (result.error_code) {
                    toastr.error(result.error_msg);
                    resolve('');
                } else if (result.trans_result) {
                    resolve(
                        result.trans_result
                            .map(item => item.dst)
                            .join('\n')
                            .trim(),
                    );
                } else {
                    resolve('');
                }
            } catch (error) {
                toastr.error(error.message);
                resolve('');
            }
        });
    });
}

export function googleTranslate(query, land) {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', 'auto');
    url.searchParams.append('dt', 't');
    url.searchParams.append('tl', land);
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
                    toastr.error(error.message);
                    resolve('');
                });
        });
    });
}

export default async function translate(subtitles, land, translatorName = 'google') {
    NProgress.start();
    const limit = pLimit(1);
    let index = 0;

    const translator = {
        baidu: baiduTranslate,
        google: googleTranslate,
    }[translatorName];

    try {
        const result = await Promise.all(
            subtitles.map(item =>
                limit(async () => {
                    const data = await translator(item.text, land);
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
        toastr.error(error.message);
    }
}
