authen('/register');

const btnRegister = document.querySelector('#btn-register');
const emailInput = document.querySelector('#email');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const phoneInput = document.querySelector('#phone');
const addressInput = document.querySelector('#address');
const avatarInput = document.querySelector('#avatar');

function register() {
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const avatar = avatarInput.files[0];

    const dataSent = new FormData();
    dataSent.append('email', email);
    dataSent.append('username', username);
    dataSent.append('password', password);
    dataSent.append('phone', phone);
    dataSent.append('address', address);
    if (avatar) {
        dataSent.append('avatar', avatar);
    }
    else {
        dataSent.append('avatar', '');
    }

    callAPI('api/authen/register', 'POST', dataSent, function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            if (this.status === 201) {
                localStorage.setItem('accessToken', dataResponse['accessToken']);
                alert('Bạn đã đăng kí tài khoản thành công!');
                home();
            }
            else {
                alert(dataResponse['message']);
            }
        }
    });
}

btnRegister.onclick = register;