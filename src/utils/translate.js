import fetchJsonp from 'fetch-jsonp';
import NProgress from 'nprogress';
import toastr from 'toastr';
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

        sleep().then(async () => {
            try {
                const data = await fetchJsonp(url.href);
                const result = await data.json();
                if (result.error_code) {
                    toastr.error(result.error_msg);
                    resolve([]);
                } else if (result.trans_result) {
                    resolve(result.trans_result.map(item => item.dst));
                } else {
                    resolve([]);
                }
            } catch (error) {
                toastr.error(error.message);
                resolve([]);
            }
        });
    });
}

export default function translate(subtitles, land) {
    NProgress.start();
    const limit = pLimit(1);
    let index = 0;
    return Promise.all(
        subtitles.map(item =>
            limit(async () => {
                const data = await baiduTranslate(item.text, land);
                NProgress.set(++index / subtitles.length);

                if (data.length) {
                    item.text = data.join('\n').trim();
                }

                return item;
            }),
        ),
    ).then(data => {
        NProgress.done();
        return data;
    });
}
