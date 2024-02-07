const port = 80;
const domain = 'localhost';
const prefixUrl = `http://${domain}:${port}/`;

function callAPI(url, method, data=null, handler) {
    apiUrl = `${prefixUrl}${url}`;
    accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : 'abcxyz';
    
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", handler);
    
    xhr.open(method, apiUrl, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    if (data instanceof FormData) {
        console.log(data.get('jsonData'));
    }
    else {
        xhr.setRequestHeader("Content-Type", "*/*");
    }
    xhr.send(data);
}

function callAPIDowload(url, method, data=null, handler) {
    apiUrl = `${prefixUrl}${url}`;
    accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : 'abcxyz';

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
    redirect(`http://${document.domain}:${location.port}/bookonline`);
}

function login() {
    redirect(`http://${document.domain}:${location.port}/bookonline/login`);
}

const paths = ['/login', '/register', '/missing-password'];

function authen(path) {
    callAPI('api/authen/me', 'GET', '', function() {
        if (this.readyState == 4) {
            const dataResponse = JSON.parse(this.responseText);
            if (this.status != 200) {
                if (paths.indexOf(path) == -1) {
                    login();
                }
            }
            else {
                for (let p of paths) {
                    if (window.location.href.lastIndexOf(p) > -1) {
                        home();
                    }
                }
            }
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
