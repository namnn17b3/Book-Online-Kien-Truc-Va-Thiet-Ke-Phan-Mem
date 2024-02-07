import { Lazyloading } from "./lazyloading.js";

authen('/category');

const lazyloading = new Lazyloading();
const categoriesView = document.querySelector('.categories-view');

const notification = document.querySelector('.notification');

function renderUIUtil(listItem) {
    if (listItem.length == 0) {
        notification.style.display = 'block';
        categoriesView.style.display = 'none';
        return;
    }
    notification.style.display = 'none';
    categoriesView.style.display = 'flex';
    let html = '';
    for (let i = 0; i < listItem.length; i++) {
        const item = listItem[i];
        html += i % 3 == 0 ? '<div class="row-category-view">' : '';
        html += `
            <div class="category-view-item">
                <a class="category-view-item-img-wapper" href="./home?page=1&categoryId=${item.id}">
                    <img class="category-view-item-img" src="${item.image}">
                </a>
                <div class="category-view-item-text-content">
                    <div class="text-ellipsis category-view-item-title" title="${item.title}">${item.title}</div>
                    <div class="category-view-item-description">${item.description}</div>
                </div>
            </div>
        `;
        html += i % 3 == 2 ? '</div>' : '';
    }
    categoriesView.innerHTML = html;
}

function renderUI(q=false) {
    let apiURL = `api/catalog?itemInPage=${itemInPage}&page=${page}`;
    let queryParams = `?page=${page}`;

    callAPI(apiURL, 'GET', '', async function() {
        lazyloading.show();
        if (this.readyState === 4) {
            console.log(this.responseText);
            await sleep(500);
            lazyloading.close();
            try {
                const dataResponse = JSON.parse(this.responseText);
                if (this.status === 200) {
                    renderUIUtil(dataResponse['items']);
                    pagination(page, dataResponse, renderUI);
                }
                else {
                    alert(dataResponse['message']);
                }
            } catch (error) {
                categoriesView.style.display = 'none';
                notification.style.display = 'block';
                notification.innerHTML = `
                    <div>Đã có lỗi xảy ra!</div>
                    <div>Vui lòng thử lại sau</div>
                `;
            }
        }
    });

    if (q) {
        window.history.pushState(null, null, queryParams);
    }
}

renderUI();