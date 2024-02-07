import { Lazyloading } from "./lazyloading.js";

authen('/home');

const productNameSearchElement = document.querySelector('#product-search-name');
const categoryIdSearchElement = document.querySelector('#product-search-category');
const minPriceSearchElement = document.querySelector('#product-search-min-price');
const maxPriceSearchElement = document.querySelector('#product-search-max-price');

productNameSearchElement.value = urlSearchParams.get('name') ? urlSearchParams.get('name') : '';
categoryIdSearchElement.value = urlSearchParams.get('categoryId') ? urlSearchParams.get('categoryId') : '0';
minPriceSearchElement.value = urlSearchParams.get('minPrice') ? urlSearchParams.get('minPrice') : '0';
maxPriceSearchElement.value = urlSearchParams.get('maxPrice') ? urlSearchParams.get('maxPrice') : '0';

const rowViewProductsWapper = document.querySelector('.row-view-products-wapper');
const btnSearch = document.querySelector('#btn-search');
const lazyloading = new Lazyloading();

const notification = document.querySelector('.notification');

function renderUIUtil(listItem) {
    if (listItem.length == 0) {
        rowViewProductsWapper.style.display = 'none';
        notification.style.display = 'block';
        notification.innerHTML = `
            <div>Chúng tôi không tìm thấy sản phẩm nào</div>
            <div>phù hợp với yêu cầu</div>
        `;
        return;
    }
    rowViewProductsWapper.style.display = 'flex';
    notification.style.display = 'none';
    let html = '';
    for (let i = 0; i < listItem.length; i++) {
        const item = listItem[i];
        html += i % 3 == 0 ? '<div class="row-view-products">' : '';
        html += `
            <div class="product-summary">
                <a href="./${item.id}" style="display: flex;">
                    <img src="${item.image}">
                </a>
                <div class="text-ellipsis product-summary-name" title="${item.name}">${item.name}</div>
                <div class="text-ellipsis product-summary-price" title="Price: ${Number(item.price).toLocaleString('vi-VN')} VNĐ">Price: <span>${Number(item.price).toLocaleString('vi-VN')} VNĐ</span></div>
                <div class="text-ellipsis product-summary-category" title="Category: ${item.category}">Category: ${item.category}</div>
                <div class="text-ellipsis product-summary-quantity" title="Quantity: ${Number(item.quantity).toLocaleString('vi-VN')}">Quantity: ${Number(item.quantity).toLocaleString('vi-VN')}</div>
                <div class="product-summary-btns">
                    <button class="btn-in-summary buy-now">BUY NOW</button>
                    <button class="btn-in-summary add-to-cart">ADD TO CART</button>
                </div>
            </div>
        `;
        html += i % 3 == 2 ? '</div>' : '';
    }
    rowViewProductsWapper.innerHTML = html;
}

function renderUI(q=false) {
    const productName = productNameSearchElement.value;
    const categoryId = parseInt(categoryIdSearchElement.value);
    const minPrice = parseInt(minPriceSearchElement.value);
    const maxPrice = parseInt(maxPriceSearchElement.value);

    let apiURL = `api/product?itemInPage=${itemInPage}&page=${page}`;
    let queryParams = `?page=${page}`;

    if (productName) {
        apiURL += `&name=${encodeURIComponent(productName)}`;
        queryParams += `&name=${encodeURIComponent(productName)}`;
    }
    if (categoryId) {
        apiURL += `&categoryId=${categoryId}`;
        queryParams += `&categoryId=${categoryId}`;
    }
    if (minPrice) {
        apiURL += `&minPrice=${minPrice}`;
        queryParams += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
        apiURL += `&maxPrice=${maxPrice}`;
        queryParams += `&maxPrice=${maxPrice}`;
    }

    if (q) {
        window.history.pushState(null, null, queryParams);
    }

    callAPI(apiURL, 'GET', '', async function() {
        lazyloading.show();
        if (this.readyState === 4) {
            await sleep(500);
            lazyloading.close();
            try {
                const dataResponse = JSON.parse(this.responseText);
                if (this.status === 200) {
                    renderUIUtil(dataResponse['items']);
                    pagination(page, dataResponse, renderUI);
                } else {
                    alert(dataResponse['message']);
                }
            } catch (error) {
                rowViewProductsWapper.style.display = 'none';
                notification.style.display = 'block';
                notification.innerHTML = `
                    <div>Đã có lỗi xảy ra!</div>
                    <div>Vui lòng thử lại sau</div>
                `;
            }
        }
    });
}

btnSearch.onclick = () => {
    page = 1;
    renderUI(true);
}

renderUI();