import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    body {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
        line-height: 1.5;
        overflow: hidden;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        font-size: 14px;
        color: #ccc;
        background-color: rgb(0 0 0 / 90%);
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
    }
`;
