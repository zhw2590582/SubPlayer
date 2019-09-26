import fetchJsonp from 'fetch-jsonp';
import pLimit from 'p-limit';
import MD5 from './md5';
import { sleep } from './index';

function baiduTranslate(query, land) {
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

        sleep(10).then(async () => {
            const data = await fetchJsonp(url.href);
            const data_1 = await data.json();
            if (data_1.trans_result) {
                resolve(data_1.trans_result.map(item => item.dst));
            } else {
                resolve([]);
            }
        });
    });
}

export default function translate(subtitles, land) {
    const limit = pLimit(1);
    return Promise.all(
        subtitles.map(item =>
            limit(async () => {
                const data = await baiduTranslate(item.text, land);
                item.text = data.join('\n').trim();
                return item;
            }),
        ),
    );
}
