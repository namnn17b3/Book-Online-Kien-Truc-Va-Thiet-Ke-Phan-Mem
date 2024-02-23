const btnCartSpan = document.querySelector('.cart button span');

async function getQuantitiesCart() {
    const promiseGetQuantitiesCart = new Promise(async function(resolve, reject) {
        await callAPI('api/user/cart', 'GET', '', async function () {
            if (this.readyState === 4) {
                resolve(this);
            }
        });
    });
    const xhr = await promiseGetQuantitiesCart;
    const dataResponse = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        const quantities = dataResponse['allRecords'];
        btnCartSpan.innerText = quantities > 99 ? '(99+)' : `(${quantities})`;
    }
    else {
        alert(dataResponse['message']);
    }
}