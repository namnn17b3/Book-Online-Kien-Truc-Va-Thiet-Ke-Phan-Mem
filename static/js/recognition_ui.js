class RecognitionUi {
    constructor() {
        const html = `
            <style>
                .recognition-ui {
                    position: fixed;
                    display: none;
                    background-color: rgba(0, 0, 0, 0.2);
                    top: 0px;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    z-index: 1000;
                }
                .recognition-card {
                    margin: auto;
                    width: 500px;
                    height: 300px;
                    background-color: azure;
                    border-radius: 6px;
                    padding: 10px;
                }
                .recognition-card {
                    display: flex;
                    flex-direction: column;
                }
                .recognition-card div {
                    display: flex;
                }
                .recognition-card div span {
                    margin: auto;
                }
                .recognition-card-title {
                    font-size: 60px;
                    font-weight: 600;
                    width: 100%;
                    height: 60px;
                    color: red;
                }
                .recognition-card-content {
                    width: 100%;
                    height: 50px;
                    font-weight: 600;
                    color: #888888;
                    font-size: 36px;
                    margin-top: 50px;
                }
                .recognition-card-content span {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                }
                .recognition-card-content-btn-cancel {
                    width: 100%;
                    height: 60px;
                }
                .recognition-card-content-btn-cancel button {
                    width: 120px;
                    height: 50px;
                    font-weight: 600;
                    font-size: 24px;
                    border-radius: 6px;
                    margin: 55px auto auto auto;
                    cursor: pointer;
                }
            </style>
            <div class="recognition-ui">
                <div class="recognition-card">
                    <div class="recognition-card-title"><span>Xin mời nói</span></div>
                    <div class="recognition-card-content"><span>Listening ...</span></div>
                    <div class="recognition-card-content-btn-cancel"><button>CANCEL</button></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);
        document.querySelector('.recognition-card-content-btn-cancel button').onclick = () => {
            this.close();
        }
        this.contentTextElement = document.querySelector('.recognition-card-content span');
        this.btnClose = document.querySelector('.recognition-card-content-btn-cancel button');
        this.recognitionShow = document.querySelector('.recognition-ui');
    }

    show() {
        this.recognitionShow.style.display = 'flex';
        this.contentTextElement.innerText = 'Listening ...';
        this.contentTextElement.title = '';
    }

    close() {
        this.recognitionShow.style.display = 'none';
    }
}

export { RecognitionUi };