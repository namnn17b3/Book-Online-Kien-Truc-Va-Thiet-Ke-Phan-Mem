authen('/missing-password');

const emailInputElement = document.querySelector('#email');
const btnSendCode = document.querySelector('#btn-send-code');

btnSendCode.onclick = () => {
    const email = emailInputElement.value;
    data = JSON.stringify({
        'email': email
    });
    callAPI('api/authen/missing-password', 'POST', data, function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            alert(dataResponse['message']);
        }
    });
}