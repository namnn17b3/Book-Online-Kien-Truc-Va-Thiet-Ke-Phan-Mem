await authen('/missing-password');

const emailInputElement = document.querySelector('#email');
const btnSendCode = document.querySelector('#btn-send-code');

btnSendCode.onclick = async () => {
    const email = emailInputElement.value;
    const data = JSON.stringify({
        'email': email
    });
    await callAPI('api/authen/missing-password', 'POST', data, function() {
        if (this.readyState === 4) {
            const dataResponse = JSON.parse(this.responseText);
            alert(dataResponse['message']);
        }
    });
}