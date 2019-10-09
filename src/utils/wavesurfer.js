import WaveSurfer from 'wavesurfer.js';
import NProgress from 'nprogress';
import { sleep } from './index';

let ws = null;
let $tmp = null;
export default function wavesurfer(option) {
    wavesurfer.destroy = () => {
        if (ws) {
            ws.destroy();
            ws = null;
        }
        if ($tmp) {
            document.body.removeChild($tmp);
            $tmp = null;
        }
    };
    return new Promise(resolve => {
        wavesurfer.destroy();
        $tmp = document.createElement('div');
        $tmp.style.position = 'fixed';
        $tmp.style.top = '-1000px';
        document.body.appendChild($tmp);
        const mergeOption = {
            pixelRatio: 1,
            fillParent: false,
            responsive: true,
            container: $tmp,
            cursorColor: 'rgba(255, 255, 255, 0)',
            waveColor: 'rgba(255, 255, 255, 0.1)',
            progressColor: 'rgba(255, 255, 255, 0.1)',
            ...option,
        };

        ws = WaveSurfer.create(mergeOption);
        ws.load(mergeOption.videoUrl);
        const isBlobUrl = mergeOption.videoUrl.startsWith('blob:');
        if (!isBlobUrl) {
            NProgress.start();
        }
        ws.on('ready', () => {
            sleep(100).then(() => {
                const canvasList = [...mergeOption.container.querySelectorAll('canvas')];
                const canvasData = canvasList.map(canvas => {
                    const ctx = canvas.getContext('2d');
                    return ctx.getImageData(0, 0, canvas.width, canvas.height);
                });
                resolve(canvasData);
                wavesurfer.destroy();
                if (!isBlobUrl) {
                    NProgress.done();
                }
            });
        });
        ws.on('loading', integer => {
            if (!isBlobUrl) {
                NProgress.set(integer / 100);
            }
        });
    });
}
