import { errorHandle } from './utils';

export default class Template {
    constructor(wf) {
        this.wf = wf;
        this.canvas = null;
        this.update();
    }

    update() {
        const { container, pixelRatio } = this.wf.options;
        const { clientWidth, clientHeight } = container;
        if (this.canvas) {
            this.canvas.width = clientWidth * pixelRatio;
            this.canvas.height = clientHeight * pixelRatio;
        } else {
            errorHandle(
                this.wf.constructor.instances.every(wf => wf.options.container !== container),
                'Cannot mount multiple instances on the same dom element, please destroy the previous instance first.',
            );
            errorHandle(clientWidth && clientHeight, 'The width and height of the container cannot be 0');
            container.innerHTML = '';
            this.canvas = document.createElement('canvas');
            this.canvas.width = clientWidth * pixelRatio;
            this.canvas.height = clientHeight * pixelRatio;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            container.appendChild(this.canvas);
        }
    }

    exportImage() {
        const elink = document.createElement('a');
        elink.style.display = 'none';
        elink.href = this.canvas.toDataURL('image/png');
        elink.download = `${Date.now()}.png`;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
    }

    destroy() {
        this.wf.options.container.innerHTML = '';
    }
}
