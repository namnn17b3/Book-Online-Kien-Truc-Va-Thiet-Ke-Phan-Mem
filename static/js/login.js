await authen('/login');

async function loginClickHandler() {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const data = JSON.stringify({
        'email': email,
        'password': password
    });
    await callAPI('api/authen/login', 'POST', data, function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            if (this.status === 200) {
                localStorage.setItem('accessToken', dataResponse['accessToken']);
                home();
            }
            else if (this.status === 401) {
                alert(dataResponse['message']);
            }
        }
    });
}

document.querySelector('#btn-login').onclick = loginClickHandler;
