import WaveSurfer from 'wavesurfer.js';
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
        ws.on('ready', () => {
            sleep(100).then(() => {
                const canvasList = [...mergeOption.container.querySelectorAll('canvas')];
                const canvasData = canvasList.map(canvas => {
                    const ctx = canvas.getContext('2d');
                    return ctx.getImageData(0, 0, canvas.width, canvas.height);
                });
                resolve(canvasData);
                wavesurfer.destroy();
            });
        });
    });
}
