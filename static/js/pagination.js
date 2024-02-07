const urlSearchParams = new URLSearchParams(window.location.search);
var page = urlSearchParams.get('page') ? parseInt(urlSearchParams.get('page')) : 1;
var itemInPage= 10;
const paginationWapperElement = document.querySelector('.pagination-wapper');
const paginationElement = document.querySelector('.pagination');

function pagination(currentPage, dataResponse, pageNodeHandler) {
    if (dataResponse['items'].length == 0) {
        paginationElement.style.display = 'none';
        return;
    }
    const allPage = dataResponse['allRecords'] % itemInPage == 0 ? dataResponse['allRecords'] / itemInPage : dataResponse['allRecords'] / itemInPage | 0 + 1;
    if (allPage <= 1) {
        paginationElement.style.display = 'none';
        return;
    }
    paginationWapperElement.style.display = 'flex';
    const start = currentPage - (currentPage - 1) % 4;
    let end = start + 3;
    end = end > allPage ? allPage : end;
    const prev = currentPage == 1 ? 0 : currentPage - 1;
    const next = currentPage > allPage ? allPage : currentPage + 1;

    let html = '';
    if (prev > 0) {
        html += `<button class="page-node" id="page-${prev}">prev</button>`;
    }
    for (var i = start; i <= end; i++) {
        html += `
            <button class="page-node" id="page-${i}" style="color: ${i == currentPage ? 'red' : 'black'};">${i}</button>
        `;
    }
    if (next <= allPage) {
        html += `<button class="page-node" id="page-${next}">next</button>`
    }
    paginationElement.innerHTML = html;
    document.querySelectorAll('.page-node').forEach(item => {
        item.onclick = () => {
            page = parseInt(item.id.substring(5));
            pageNodeHandler(true);
        }
    });
}