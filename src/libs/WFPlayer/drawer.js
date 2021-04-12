import { durationToTime, clamp } from './utils';

export default class Drawer {
    constructor(wf) {
        this.wf = wf;
        this.canvas = wf.template.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.gridNum = 0;
        this.gridGap = 0;
        this.beginTime = 0;

        this.update();

        wf.on('options', () => {
            this.update();
        });

        wf.on('channelData', () => {
            this.update();
        });
    }

    update() {
        const {
            currentTime,
            options: { cursor, grid, ruler, wave, duration, padding },
        } = this.wf;
        this.gridNum = duration * 10 + padding * 2;
        this.gridGap = this.canvas.width / this.gridNum;
        this.beginTime = currentTime - duration / 2;

        this.density =
            {
                1: 5,
                2: 4,
                3: 3,
                4: 3,
                5: 2,
                6: 2,
                7: 2,
                8: 2,
            }[Math.floor(this.gridGap)] || 1;

        this.wf.emit('render', {
            padding,
            duration,
            gridGap: this.gridGap,
            gridNum: this.gridNum,
            beginTime: this.beginTime,
        });

        this.drawBackground();
        if (grid) {
            this.drawGrid();
        }
        if (ruler) {
            this.drawRuler();
        }
        if (wave) {
            this.drawWave();
        }
        if (cursor) {
            this.drawCursor();
        }
    }

    drawBackground() {
        const { backgroundColor, paddingColor, padding } = this.wf.options;
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.fillStyle = paddingColor;
        this.ctx.fillRect(0, 0, padding * this.gridGap, height);
        this.ctx.fillRect(width - padding * this.gridGap, 0, padding * this.gridGap, height);
    }

    drawWave() {
        const {
            options: { progress, waveColor, progressColor, duration, padding, waveScale },
            decoder: {
                channelData,
                audiobuffer: { sampleRate },
            },
        } = this.wf;
        if (!channelData.length) return;
        const { width, height } = this.canvas;
        const middle = height / 2;
        const waveWidth = width - this.gridGap * padding * 2;
        const startIndex = Math.floor(this.beginTime * sampleRate);
        const endIndex = Math.floor(clamp((this.beginTime + duration) * sampleRate, startIndex, Infinity));
        const step = Math.floor((endIndex - startIndex) / waveWidth);
        const cursorX = width / 2;

        let stepIndex = 0;
        let xIndex = 0;
        let min = 1;
        let max = -1;
        for (let i = startIndex; i < endIndex; i += 1) {
            stepIndex += 1;
            const item = channelData[i] || 0;
            if (item < min) {
                min = item;
            } else if (item > max) {
                max = item;
            }
            if (stepIndex >= step && xIndex < waveWidth) {
                xIndex += 1;
                const waveX = this.gridGap * padding + xIndex;
                this.ctx.fillStyle = progress && cursorX >= waveX ? progressColor : waveColor;
                this.ctx.fillRect(
                    waveX,
                    (1 + min * waveScale) * middle,
                    1,
                    Math.max(1, (max - min) * middle * waveScale),
                );
                stepIndex = 0;
                min = 1;
                max = -1;
            }
        }
    }

    drawGrid() {
        const { currentTime } = this.wf;
        const { gridColor, pixelRatio } = this.wf.options;
        const { width, height } = this.canvas;
        this.ctx.fillStyle = gridColor;
        for (let index = 0; index < this.gridNum + 10; index += this.density) {
            this.ctx.fillRect(
                this.gridGap * index - (currentTime - parseInt(currentTime)) * this.gridGap * 10,
                0,
                pixelRatio,
                height,
            );
        }
        for (let index = 0; index < height / this.gridGap; index += this.density) {
            this.ctx.fillRect(0, this.gridGap * index, width, pixelRatio);
        }
    }

    drawRuler() {
        const { currentTime } = this.wf;
        const { rulerColor, pixelRatio, padding, rulerAtTop } = this.wf.options;
        const { height } = this.canvas;
        const fontSize = 11;
        const fontHeight = 15;
        const fontTop = 30;
        this.ctx.font = `${fontSize * pixelRatio}px Arial`;
        this.ctx.fillStyle = rulerColor;
        let second = -1;
        for (let index = 0; index < this.gridNum + 10; index += 1) {
            if (index && index >= padding && index <= this.gridNum + 10 && (index - padding) % 10 === 0) {
                second += 1;
                this.ctx.fillRect(
                    this.gridGap * index - (currentTime - parseInt(currentTime)) * this.gridGap * 10,
                    rulerAtTop ? 0 : height - fontHeight * pixelRatio,
                    pixelRatio,
                    fontHeight * pixelRatio,
                );

                const time = this.beginTime + second;
                if ((index - padding) % (this.density * 10) === 0 && time >= 0) {
                    const text = durationToTime(time).split('.')[0];
                    const x =
                        this.gridGap * index -
                        (currentTime - parseInt(currentTime)) * this.gridGap * 10 -
                        fontSize * pixelRatio * 2 +
                        pixelRatio;
                    const y = rulerAtTop ? fontTop * pixelRatio : height - fontTop * pixelRatio + fontSize;
                    this.ctx.fillText(text, x, y);
                }
            } else if (index && (index - padding) % 5 === 0) {
                this.ctx.fillRect(
                    this.gridGap * index - (currentTime - parseInt(currentTime)) * this.gridGap * 10,
                    rulerAtTop ? 0 : height - (fontHeight / 2) * pixelRatio,
                    pixelRatio,
                    (fontHeight / 2) * pixelRatio,
                );
            }
        }
    }

    drawCursor() {
        const {
            options: { cursorColor, pixelRatio },
        } = this.wf;
        const { width, height } = this.canvas;
        this.ctx.fillStyle = cursorColor;
        this.ctx.fillRect(width / 2, 0, pixelRatio, height);
    }
}
