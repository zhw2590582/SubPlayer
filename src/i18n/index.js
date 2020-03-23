const en = {
    open: 'Open',
    save: 'Save',
    undo: 'Undo',
    clear: 'Clear',
    help: 'Help',
    donate: 'Donate',
    confirm: 'Confirm',
    delete: 'Delete',
    insert: 'Insert Next',
    merge: 'Merge Next',

    'open-subtitle': 'Open Subtitle',
    'open-subtitle-supports': 'Supports opening .vtt, .srt and .ass subtitle',
    'open-subtitle-success': 'Open subtitles successfully',
    'open-subtitle-error': 'Failed to open subtitles',

    'open-video': 'Open Video',
    'open-video-supports': 'Supports opening .mp4, .webm and .ogg video',
    'open-video-warning':
        'The files are opened locally and no data is uploaded. When creating an audio waveform, The browser may be blocked for a short time due to audio decoding',
    'open-video-success': 'Open video successfully',
    'open-video-error': 'Failed to open video',

    'clear-warning': 'This step cannot be rolled back. Are you sure ?',
    'clear-success': 'Clear all subtitles data successfully',

    'help-info':
        'This editor is suitable for video with small volume and simple subtitle effect. For large file videos or more subtitle effect, please use professional desktop software.',
    'help-issue': 'You can ask any questions on Github Issue:',
    'help-email': 'Or contact me via email:',

    'donate-info':
        'Or you can buy me a cup of coffee to encourage me to continue to update and improve the subtitle editor.',
    'donate-weChatPay': 'WeChat Pay:',
    'donate-alipay': 'Alipay:',

    'history-rollback': 'History rollback successful',
    'history-empty': 'History is empty',

    'translation-success': 'Translation successful',
    'translation-progress': 'Translation in progress',
    'translation-limit': 'Limit 1000 translations per batch',

    'audio-waveform': 'Audio Waveform:',
    'file-size': 'File Size:',
    'decoding-progress': 'Decoding Progress:',
    'render-channel': 'Render Channel:',
    'unit-duration': 'Unit Duration:',
    'height-zoom': 'Height Zoom:',
    'space-metronome': 'Space Metronome:',
    'export-image': 'Export Image',
    'parameter-error': 'Parameter error',
    'keep-one': 'Please keep at least one subtitle',
    'subtitle-text': '[Subtitle Text]',
    'time-offset': 'Time Offset:',
    'google-translate': 'Google Translate:',
};

const zh = {
    open: '打开',
    save: '保存',
    undo: '回退',
    clear: '清除',
    help: '帮助',
    donate: '捐助',
    confirm: '确定',

    delete: '删除',
    insert: '插入下一条',
    merge: '合并下一条',

    'open-subtitle': '打开字幕',
    'open-subtitle-supports': '支持打开 .vtt, .srt 和 .ass 字幕',
    'open-subtitle-success': '打开字幕成功',
    'open-subtitle-error': '打开字幕失败',

    'open-video': '打开视频',
    'open-video-supports': '支持打开 .mp4, .webm 和 .ogg 视频',
    'open-video-warning':
        '文件均为本地打开，不会上传任何数据。创建音频波形时，浏览器可能会由于音频解码而在短时间内被阻塞',
    'open-video-success': '打开视频成功',
    'open-video-error': '打开视频失败',

    'clear-warning': '此步骤无法回退，确定吗?',
    'clear-success': '清除所有字幕数据成功',

    'help-info': '该编辑器适用于体积小，字幕效果简单的视频。对于大文件视频或更多字幕效果，请使用专业的桌面软件。',
    'help-issue': '您可以在Github问题上提出任何问题:',
    'help-email': '或通过电子邮件与我联系:',

    'donate-info': '或者，您可以给我买杯咖啡，以鼓励我继续更新和改进字幕编辑器。',
    'donate-weChatPay': '微信支付:',
    'donate-alipay': '支付宝:',

    'history-rollback': '历史回退成功',
    'history-empty': '历史是空的',

    'translation-success': '翻译成功',
    'translation-progress': '翻译正在进行',
    'translation-limit': '每此限制1000条翻译',

    'audio-waveform': '波形图:',
    'file-size': '文件大小:',
    'decoding-progress': '解码进度:',
    'render-channel': '渲染声道:',
    'unit-duration': '单位时长:',
    'height-zoom': '高度缩放:',
    'space-metronome': '空格节拍器:',
    'export-image': '导出图像',
    'parameter-error': '参数错误',
    'keep-one': '请至少保留一个字幕',
    'subtitle-text': '[字幕文字]',
    'time-offset': '时间偏移:',
    'google-translate': '谷歌翻译:',
};

export default {
    en,
    zh,
    'zh-cn': zh,
    'zh-tw': zh,
};

export const names = {
    en: 'EN',
    zh: '中',
};

export const getName = key => {
    return (
        {
            en: 'en',
            zh: 'zh',
            'zh-cn': 'zh',
            'zh-tw': 'zh',
        }[key] || 'en'
    );
};
