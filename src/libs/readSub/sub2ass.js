const toSubTime = (str) => {
    let n = [];
    let sx = '';
    let x = str.split(/[:.]/).map((x) => Number(x));
    x = str.split(/[:.]/).map((x) => Number(x));
    x[3] = '0.' + ('00' + x[3]).slice(-3);
    sx = (x[0] * 60 * 60 + x[1] * 60 + x[2] + Number(x[3])).toFixed(2);
    sx = sx.toString().split('.');
    n.unshift(sx[1]);
    sx = Number(sx[0]);
    n.unshift(('0' + (sx % 60).toString()).slice(-2));
    n.unshift(('0' + (Math.floor(sx / 60) % 60).toString()).slice(-2));
    n.unshift((Math.floor(sx / 3600) % 60).toString());
    return n.slice(0, 3).join(':') + '.' + n[3];
};

export default function sub2ass(sub) {
    return `
[Script Info]
; // 此字幕由爱幕生成
Synch Point:1
ScriptType:v4.00+
Collisions:Normal

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default, Microsoft YaHei, 20, &H00FFFFFF, &H000000FF, &H00000000, &H00000000, 0, 0, 0, 0, 100, 100, 0, 0, 1, 1, 0, 2, 10, 10, 10, 134

[Events]
Format: Layer, Start, End, Style, Actor, MarginL, MarginR, MarginV, Effect, Text
${sub
    .map((item) => {
        const start = toSubTime(item.start);
        const end = toSubTime(item.end);
        const text = item.text.replace(/\r?\n/g, '\\N');
        return `Dialogue: 0,${start},${end},Default,NTP,0000,0000,0000,,${text}`;
    })
    .join('\n')}
    `.trim();
}
