import {Lazyloading} from "./lazyloading.js";

authen('/home');

const productNameSearchElement = document.querySelector('#product-search-name');
const categoryIdSearchElement = document.querySelector('#product-search-category');
const minPriceSearchElement = document.querySelector('#product-search-min-price');
const maxPriceSearchElement = document.querySelector('#product-search-max-price');
const imageSearchElement = document.querySelector('#product-search-image-search');

productNameSearchElement.value = urlSearchParams.get('name') ? urlSearchParams.get('name') : '';
minPriceSearchElement.value = urlSearchParams.get('minPrice') ? urlSearchParams.get('minPrice') : '0';
maxPriceSearchElement.value = urlSearchParams.get('maxPrice') ? urlSearchParams.get('maxPrice') : '0';

let rowViewProductsWapper = document.querySelector('.row-view-products-wapper');
const btnSearch = document.querySelector('#btn-search');
const lazyloading = new Lazyloading();

const notification = document.querySelector('.notification');

const productSearchCategoryElement = document.querySelector('#product-search-category');

function renderUIUtil(listItem) {
    if (listItem.length === 0) {
        rowViewProductsWapper.style.display = 'none';
        notification.style.display = 'block';
        notification.innerHTML = `
            <div>Chúng tôi không tìm thấy sản phẩm nào</div>
            <div>phù hợp với yêu cầu</div>
        `;
        return;
    }
    console.log(listItem);
    rowViewProductsWapper.style.display = 'flex';
    notification.style.display = 'none';
    let html = '';
    for (let i = 0; i < listItem.length; i++) {
        const item = listItem[i];
        html += i % 3 === 0 ? '<div class="row-view-products">' : '';
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
        html += i % 3 === 2 ? '</div>' : '';
    }
    rowViewProductsWapper.innerHTML = html;
}

async function renderProductUI(q = false) {
    const imageSearch = imageSearchElement.files[0];
    let apiURL = `api/product/?itemInPage=${itemInPage}&page=${page}`;
    let dataSent = '';
    let method = 'GET';
    let queryParams = `?page=${page}`;

    const productName = productNameSearchElement.value;
    const categoryId = parseInt(categoryIdSearchElement.value);
    const minPrice = parseInt(minPriceSearchElement.value);
    const maxPrice = parseInt(maxPriceSearchElement.value);

    if (!imageSearch) {
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
    } else {
        apiURL = 'api/product/image-search';
        method = 'POST';
        dataSent = new FormData();
        dataSent.append('image', imageSearch);
    }
    await callAPI(apiURL, method, dataSent, async function () {
        lazyloading.show();
        if (this.readyState === 4) {
            await sleep(500);
            lazyloading.close();
            imageSearchElement.value = '';
            let dataResponse = null;
            try {
                dataResponse = JSON.parse(this.responseText);
                if (this.status === 200) {
                    renderUIUtil(dataResponse['items']);
                    pagination(page, dataResponse, renderProductUI);
                } else {
                    setTimeout(() => {
                        alert(dataResponse['message']);
                    }, 50);
                }
            } catch (error) {
                rowViewProductsWapper.style.display = 'none';
                notification.style.display = 'block';
                notification.innerHTML = `
                    <div>Đã có lỗi xảy ra!</div>
                    <div>Vui lòng thử lại sau</div>
                `;
            } finally {
                if (q) {
                    window.history.pushState({
                        page: page,
                        dataResponse: dataResponse,
                        name: productNameSearchElement.value,
                        categoryId: categoryIdSearchElement.value,
                        minPrice: minPriceSearchElement.value,
                        maxPrice: maxPriceSearchElement.value,
                    }, '', queryParams);
                } else {
                    const contextPath = 'bookonline/';
                    const path = window.location.href.substring(window.location.href.lastIndexOf(contextPath) + contextPath.length);
                    window.history.replaceState({
                        page: page,
                        dataResponse: dataResponse,
                        name: productNameSearchElement.value,
                        categoryId: categoryIdSearchElement.value,
                        minPrice: minPriceSearchElement.value,
                        maxPrice: maxPriceSearchElement.value,
                    }, '', path);
                }
            }
        }
    });
}

btnSearch.onclick = async () => {
    page = 1;
    await renderProductUI(true);
}

async function callAPIGetCategories(resolve) {
    await callAPI('api/catalog?itemInPage=10&page=1', 'GET', '', async function () {
        if (this.readyState === 4) {
            resolve(this);
        }
    });
}

window.addEventListener('popstate', async function (event) {
    console.log(event.state); // or console.log(window.history.state);
    const data = event.state;
    page = data.page;
    productNameSearchElement.value = data.name;
    categoryIdSearchElement.value = data.categoryId;
    minPriceSearchElement.value = data.minPrice;
    maxPriceSearchElement.value = data.maxPrice;
    renderUIUtil(data.dataResponse['items']);
    pagination(page, data.dataResponse, renderProductUI);
}, false);

async function renderCategories() {
    const promiseCategory = new Promise(async function(resolve, reject) {
        return (await callAPIGetCategories(resolve));
    });
    const xhr = await promiseCategory;
    const dataResponse = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        const items = dataResponse['items'];
        productSearchCategoryElement.innerHTML = items.reduce((prev, item) => {
            return prev + `<option value="${item.id}">${item.title}</option>`;
        }, '<option value="0">--- Category ---</option>');
        categoryIdSearchElement.value = urlSearchParams.get('categoryId') ? urlSearchParams.get('categoryId') : '0';
    } else {
        alert(dataResponse['message']);
    }
}

await renderCategories();

await renderProductUI();