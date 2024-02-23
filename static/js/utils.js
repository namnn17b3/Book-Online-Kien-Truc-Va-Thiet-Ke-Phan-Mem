const port = location.port ? location.port : 80;
const domain = document.domain;
const http = window.location.href.includes('https') ? 'https' : 'http';
const prefixUrl = `${http}://${domain}:${port}/bookonline/`;

async function callAPI(url, method, data=null, handler) {
    const apiUrl = `${prefixUrl}${url}`;
    const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;
    
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", await handler);
    
    xhr.open(method, apiUrl, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    if (data instanceof FormData) {
        console.log(data.get('avatar'));
    }
    else {
        xhr.setRequestHeader("Content-Type", "*/*");
    }
    xhr.send(data);
}

function callAPIDowload(url, method, data=null, handler) {
    const apiUrl = `${prefixUrl}${url}`;
    const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("load", handler);

    xhr.open(method, apiUrl, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.send(data);
}

function redirect(url) {
    console.log(url);
    const aTag = document.createElement('a');
    aTag.href = url;
    document.querySelector('body').insertAdjacentElement('afterbegin', aTag);
    aTag.click();
}

function home() {
    redirect(`${http}://${domain}:${port}/bookonline`);
}

function login() {
    redirect(`${http}://${domain}:${port}/bookonline/login`);
}

async function refreshToken() {
    await callAPI('api/authen/refresh-token', 'GET', '', function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            if (this.status === 200) {
                localStorage.setItem('accessToken', dataResponse['accessToken']);
                home();
            }
            else {
                login();
            }
        }
    });
}

const paths = ['/login', '/register', '/missing-password'];

async function authen(path) {
    await callAPI('api/authen/me', 'GET', '', async function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            if (this.status !== 200 && this.status !== 401) {
                if (paths.indexOf(path) === -1) {
                    login();
                }
            }
            else if (this.status === 200) {
                for (let p of paths) {
                    if (window.location.href.lastIndexOf(p) > -1) {
                        home();
                    }
                }
            }
            else if (this.status === 401) {
                await refreshToken();
            }
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(callback, delay) {
    let timeout = null;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (callback instanceof Promise) {
                callback(...args).then(() => {});
            }
            else {
                callback(...args);
            }
        }, delay);
    }
}

function throttle(callback, delay) {
    let shouldWait = false;
    let lastArgs = null;

    return (...args) => {
        if (shouldWait) {
            lastArgs = args;
            return;
        }

        if (callback instanceof Promise) {
            callback(...args).then(() => {});
        }
        else {
            callback(...args);
        }
        shouldWait = true;
        setTimeout(() => {
            if (lastArgs === null) {
                shouldWait = false;
            }
            else {
                shouldWait = false;
                if (callback instanceof Promise) {
                    callback(...args).then(() => {});
                }
                else {
                    callback(...args);
                }
                lastArgs = null;
            }
        }, delay);
    }
}