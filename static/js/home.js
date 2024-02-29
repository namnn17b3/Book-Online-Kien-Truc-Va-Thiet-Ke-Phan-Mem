import {Lazyloading} from "./lazyloading.js";
import {RecognitionUi} from "./recognition_ui.js";

await authen('/home');

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
const recognitionUI = new RecognitionUi();

const notification = document.querySelector('.notification');

const productSearchCategoryElement = document.querySelector('#product-search-category');

async function renderUIUtil(listItem) {
    if (listItem.length === 0) {
        rowViewProductsWapper.style.display = 'none';
        notification.style.display = 'block';
        notification.innerHTML = `
            <div>Chúng tôi không tìm thấy sản phẩm nào</div>
            <div>phù hợp với yêu cầu</div>
        `;
        return;
    }
    // console.log(listItem);
    rowViewProductsWapper.style.display = 'flex';
    notification.style.display = 'none';
    let html = '';
    for (let i = 0; i < listItem.length; i++) {
        const item = listItem[i];
        html += i % 3 === 0 ? '<div class="row-view-products">' : '';
        html += `
            <div class="product-summary">
                <a href="./product/${item.id}" style="display: flex;">
                    <img src="${item.image}" alt="">
                </a>
                <div class="text-ellipsis product-summary-name" title="${item.name}">${item.name}</div>
                <div class="text-ellipsis product-summary-price" title="Price: ${Number(item.price).toLocaleString('vi-VN')} VNĐ">Price: <span>${Number(item.price).toLocaleString('vi-VN')} VNĐ</span></div>
                <div class="text-ellipsis product-summary-category" title="Category: ${item.category}">Category: ${item.category}</div>
                <div class="text-ellipsis product-summary-quantity" title="Quantity: ${Number(item.quantity).toLocaleString('vi-VN')}">Quantity: ${Number(item.quantity).toLocaleString('vi-VN')}</div>
                <div class="product-summary-btns">
                    <div style="display: none;">${item.id}</div>
                    <button class="btn-in-summary buy-now">BUY NOW</button>
                    <button class="btn-in-summary add-to-cart">ADD TO CART</button>
                </div>
            </div>
        `;
        html += i % 3 === 2 ? '</div>' : '';
    }
    rowViewProductsWapper.innerHTML = html;
    const productNameElement = document.querySelectorAll('.product-summary-name');
    await cart(productNameElement);
}

async function renderProductUI(q = false, voice=false) {
    const imageSearch = imageSearchElement.files[0];
    let apiURL = `api/search/product/?itemInPage=${itemInPage}&page=${page}`;
    let dataSent = '';
    let method = 'GET';
    let queryParams = `?page=${page}`;

    const productName = productNameSearchElement.value;
    const categoryId = parseInt(categoryIdSearchElement.value);
    const minPrice = parseInt(minPriceSearchElement.value);
    const maxPrice = parseInt(maxPriceSearchElement.value);

    if (!imageSearch && !voice) {
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
    } else if (imageSearch && !voice) {
        apiURL = 'api/search/product/image';
        method = 'POST';
        dataSent = new FormData();
        dataSent.append('image', imageSearch);
    }
    else if (voice) {
        apiURL = `api/search/product/voice?text=${encodeURIComponent(voice)}`;
        method = 'GET';
        dataSent = '';
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
                    await renderUIUtil(dataResponse['items']);
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
                } else if (!voice) {
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
                } else {
                    const path = `voice-search?text=${voice}`;
                    window.history.pushState({
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

window.addEventListener('popstate', async function (event) {
    // console.log(event.state); // or console.log(window.history.state);
    const data = event.state;
    page = data.page;
    productNameSearchElement.value = data.name;
    categoryIdSearchElement.value = data.categoryId;
    minPriceSearchElement.value = data.minPrice;
    maxPriceSearchElement.value = data.maxPrice;
    await renderUIUtil(data.dataResponse['items']);
    pagination(page, data.dataResponse, renderProductUI);
}, false);

async function callAPIGetCategories(resolve) {
    await callAPI('api/catalog?itemInPage=10&page=1', 'GET', '', async function () {
        if (this.readyState === 4) {
            resolve(this);
        }
    });
}

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

async function cart(productNameElement) {
    document.querySelectorAll('.add-to-cart').forEach((item, index) => {
        item.onclick = async () => {
            const productId = parseInt(item.parentElement.firstElementChild.innerText);
            const dataRequest = JSON.stringify({
                productId: productId,
                quantity: 1
            });
            await callAPI('api/user/cart', 'POST', dataRequest, async function () {
                if (this.readyState === 4) {
                    const dataResponse = JSON.parse(this.responseText);
                    if (this.status === 200) {
                        const quantities = dataResponse['quantities'];
                        btnCartSpan.innerText = quantities > 99 ? '(99+)' : `(${quantities})`;
                        alert(`Đã thêm sản phẩm:\n"${productNameElement[index].innerText}"\nvào giỏ hàng thành công!`);
                    }
                    else {
                        alert(dataResponse['message']);
                    }
                }
            });
        }
    });
}

function findProductByVoice() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = 'vi-VI';
    recognition.continuous = false;

    const microphone = document.querySelector('#product-search-voice-search');
    const handleVoice = (text) => {
        recognitionUI.contentTextElement.title = text;
        recognitionUI.contentTextElement.innerText = text;
        setTimeout(() => {
            recognitionUI.close();
            renderProductUI(true, text).then(() => {});
        }, 1300);
    }

    microphone.onclick = (e) => {
        e.preventDefault();
        recognition.start();
        recognitionUI.show();
    }

    recognition.onspeechend = () => {
        recognition.stop();
    }

    recognition.onerror = (err) => {
        console.log(err);
    }

    recognition.onresult = (e) => {
        handleVoice(e.results[0][0].transcript);
    }
}

findProductByVoice();

await renderCategories();

await renderProductUI();

await getQuantitiesCart();