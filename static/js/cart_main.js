import {Lazyloading} from "./lazyloading.js";

await authen('/cart');

itemInPage = 5;
const cartViewElement = document.querySelector('.cart-view');
const notification = document.querySelector('.notification');

const lazyloading = new Lazyloading();


function addEventHandlerForCartQuantityInput(listProductId, listUpdatedAt) {
    document.querySelectorAll('.cart-quantity-input').forEach((item, index) => {
        item.oninput = debounce(async () => {
            const dataRequest = JSON.stringify({
                items: [
                    {
                        productId: parseInt(listProductId[index].innerText),
                        quantity: parseInt(item.value)
                    }
                ]
            });
            await callAPI('api/user/cart', 'PUT', dataRequest, async function () {
                if (this.readyState === 4) {
                    const dataResponse = JSON.parse(this.responseText);
                    if (this.status === 200) {
                        listUpdatedAt[index].title = dataResponse['items'][0].updatedAt;
                        listUpdatedAt[index].firstElementChild.innerText = dataResponse['items'][0].updatedAt;
                        item.parentElement.parentElement.title = item.value;
                    }
                    else {
                        alert(dataResponse['message']);
                    }
                }
            });
        }, 1000);
    });
}

function addEventHandlerForCartActionDelete(listProductId, listProductName) {
    document.querySelectorAll('.cart-delete-product span button').forEach((item, index) => {
        item.onclick = async () => {
            if (!confirm(`Bạn có chắc chắn muốn bỏ sản phẩm:\n"${listProductName[index].firstElementChild.innerText}"\nra khỏi giỏ hàng?`)) {
                return;
            }
            const dataRequest = JSON.stringify({
                items: [
                    {
                        productId: parseInt(listProductId[index].innerText)
                    }
                ]
            });
            await callAPI('api/user/cart', 'DELETE', dataRequest, async function() {
                if (this.readyState === 4) {
                    const dataResponse = JSON.parse(this.responseText);
                    if (this.status === 200) {
                        page = listProductId.length === 1 ? (page > 1 ? page - 1 : 1) : page;
                        getQuantitiesCart();
                        await renderCartUI();
                    }
                    alert(dataResponse['message']);
                }
            });
        }
    });
}

async function renderUIUtil(listItem) {
    if (listItem.length === 0) {
        cartViewElement.style.display = 'none';
        notification.style.display = 'block';
        notification.innerHTML = `
            <div>Bạn không có sản phẩm nào trong giỏ hàng</div>
            <div>Hãy tiếp tục mua sách bạn nhé</div>
        `;
        return;
    }
    cartViewElement.style.display = 'table';
    notification.style.display = 'none';
    let html = '';
    for (let i = 0; i < listItem.length; i++) {
        const item = listItem[i];
        html += `
            <tr>
                <td class="cart-stt" title="${(page - 1) * itemInPage + i + 1}"><span>${(page - 1) * itemInPage + i + 1}</span></td>
                <td class="cart-image">
                    <span><a href="./product/${item.productId}"><img src="${item.image}" alt=""></a></span>
                </td>
                <td class="cart-name" title="${item.name}"><span>${item.name}</span></td>
                <td class="cart-author" title="${item.author}"><span>${item.author}</span></td>
                <td class="cart-publish-date" title="${item.publishDate}"><span>${item.publishDate}</span></td>
                <td class="cart-price" title="${Number(item.price).toLocaleString('vi-VN')} VNĐ"><span>${Number(item.price).toLocaleString('vi-VN')} <span style="color: red;">VNĐ</span></span></td>
                <td class="cart-quantity" title="${item.quantity}">
                    <span>
                        <input class="cart-quantity-input" max="200" min="1" type="number" value="${item.quantity}"/>
                    </span>
                </td>
                <td class="cart-category" title="${item.category}"><span>${item.category}</span></td>
                <td class="cart-updated-at" title="${item.updatedAt}"><span>${item.updatedAt}</span></td>
                <td class="cart-delete-product">
                    <span>
                        <button>DELETE</button>
                    </span>
                </td>
                <div class="cart-product-id" style="display: none;">${item.productId}</div>
            </tr>
        `;
    }
    cartViewElement.querySelector('tbody').innerHTML = html;
    const listProductId = document.querySelectorAll('.cart-product-id');
    const listUpdatedAt = document.querySelectorAll('.cart-updated-at');
    const listProductName = document.querySelectorAll('.cart-name');
    addEventHandlerForCartQuantityInput(listProductId, listUpdatedAt);
    addEventHandlerForCartActionDelete(listProductId, listProductName);
}

async function renderCartUI(q=false) {
    let apiURL = `api/user/cart?itemInPage=${itemInPage}&page=${page}`;
    let dataSent = '';
    let method = 'GET';
    let queryParams = `?page=${page}`;

    await callAPI(apiURL, method, dataSent, async function() {
        lazyloading.show();
        if (this.readyState === 4) {
            await sleep(500);
            lazyloading.close();
            let dataResponse = null;
            try {
                dataResponse = JSON.parse(this.responseText);
                if (this.status === 200) {
                    await renderUIUtil(dataResponse['items']);
                    pagination(page, dataResponse, renderCartUI);
                }
                else {
                    setTimeout(() => {
                        alert(dataResponse['message']);
                    }, 50);
                }
            }
            catch (error) {
                console.log(error);
                cartViewElement.style.display = 'none';
                notification.style.display = 'block';
                notification.innerHTML = `
                    <div>Đã có lỗi xảy ra!</div>
                    <div>Vui lòng thử lại sau</div>
                `;
            }
            finally {
                if (q) {
                    window.history.pushState({
                        page: page,
                        dataResponse: dataResponse
                    }, '', queryParams);
                } else {
                    const contextPath = 'bookonline/';
                    const path = window.location.href.substring(window.location.href.lastIndexOf(contextPath) + contextPath.length);
                    window.history.replaceState({
                        page: page,
                        dataResponse: dataResponse
                    }, '', path);
                }
            }
        }
    });
}

window.addEventListener('popstate', async function (event) {
    // console.log(event.state); // or console.log(window.history.state);
    const data = event.state;
    page = data.page;
    await renderUIUtil(data.dataResponse['items']);
    pagination(page, data.dataResponse, renderCartUI);
}, false);

await renderCartUI();

await getQuantitiesCart();