export function checkTime(time) {
    return /^(\d+):([0-5][0-9]):([0-5][0-9])\.\d{3}$/.test(time);
}

export function checkDuration(duration) {
    return /^\d+\.\d{3}/.test(duration);
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce(func, wait, context) {
    let timeout;
    return function fn(...args) {
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function notice(text) {
    const $el = document.createElement('div');
    $el.innerText = text;
    $el.classList.add('notice');
    document.body.appendChild($el);
    setTimeout(() => {
        document.body.removeChild($el);
    }, 3000);
}
