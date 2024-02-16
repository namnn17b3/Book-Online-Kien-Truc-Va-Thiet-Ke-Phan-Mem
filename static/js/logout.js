const btnLogout = document.querySelector('.logout');

btnLogout.onclick = () => {
    if (confirm('Bạn có chắc muốn đăng xuất không?')) {
        callAPI('api/authen/logout', 'GET', '', async function() {
            if (this.readyState === 4) {
                const dataResponse = JSON.parse(this.responseText);
                if (this.status === 200) {
                    localStorage.removeItem('accessToken');
                    login();
                }
                else {
                    alert(dataResponse['message']);
                }
            }
        });
    }
}