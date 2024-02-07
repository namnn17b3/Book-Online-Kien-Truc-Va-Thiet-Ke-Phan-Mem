class Lazyloading {
    constructor() {
        const html = `
            <style>
                .lazy-loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    display: none;
                    background-color: rgba(0, 0, 0, 0.2);
                }
                .loading-specific {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                @keyframes opacity-fade-out {
                    0% {
                        opacity: 1;
                    }
                    10% {
                        opacity: 0.9;
                    }
                    20% {
                        opacity: 0.6;
                    }
                    30% {
                        opacity: 0.4;
                    }
                    40% {
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0;
                    }
                    60% {
                        opacity: 0.2;
                    }
                    70% {
                        opacity: 0.4;
                    }
                    80% {
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 0.9;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            </style>
            <div class="lazy-loading">
                <div class="loading-specific">
                    <span class="rectangle-circle-1"></span>
                    <span class="rectangle-circle-2"></span>
                    <span class="rectangle-circle-3"></span>
                    <span class="rectangle-circle-4"></span>
                    <span class="rectangle-circle-5"></span>
                    <span class="rectangle-circle-6"></span>
                    <span class="rectangle-circle-7"></span>
                    <span class="rectangle-circle-8"></span>
                    <span class="rectangle-circle-9"></span>
                    <span class="rectangle-circle-10"></span>
                    <span class="rectangle-circle-11"></span>
                    <span class="rectangle-circle-12"></span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("afterbegin", html);

        Object.assign(document.querySelector('.rectangle-circle-1').style, {
            display: 'inline',
            position: 'absolute',
            top: '-40px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite'
        });

        Object.assign(document.querySelector('.rectangle-circle-2').style, {
            display: 'inline',
            position: 'absolute',
            top: '-35px',
            left: '20px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(30deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.1s',
        });

        Object.assign(document.querySelector('.rectangle-circle-3').style, {
            display: 'inline',
            position: 'absolute',
            top: '-20px',
            left: '34px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(60deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.2s'
        });

        Object.assign(document.querySelector('.rectangle-circle-4').style, {
            display: 'inline',
            position: 'absolute',
            top: '0px',
            left: '40px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(90deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.3s'
        });

        Object.assign(document.querySelector('.rectangle-circle-5').style, {
            display: 'inline',
            position: 'absolute',
            top: '20px',
            left: '34px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(120deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.4s'
        });

        Object.assign(document.querySelector('.rectangle-circle-6').style, {
            display: 'inline',
            position: 'absolute',
            top: '35px',
            left: '20px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(150deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.5s'
        });

        Object.assign(document.querySelector('.rectangle-circle-7').style, {
            display: 'inline',
            position: 'absolute',
            top: '40px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(180deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.6s'
        });

        Object.assign(document.querySelector('.rectangle-circle-8').style, {
            display: 'inline',
            position: 'absolute',
            top: '35px',
            left: '-20px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(210deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.8s'
        });

        Object.assign(document.querySelector('.rectangle-circle-9').style, {
            display: 'inline',
            position: 'absolute',
            top: '20px',
            left: '-34px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(240deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '0.9s'
        });

        Object.assign(document.querySelector('.rectangle-circle-10').style, {
            display: 'inline',
            position: 'absolute',
            left: '-40px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(270deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '1s'
        });

        Object.assign(document.querySelector('.rectangle-circle-11').style, {
            display: 'inline',
            position: 'absolute',
            top: '-20px',
            left: '-34px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(300deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '1.1s'
        });

        Object.assign(document.querySelector('.rectangle-circle-12').style, {
            display: 'inline',
            position: 'absolute',
            top: '-35px',
            left: '-20px',
            height: '30px',
            width: '8px',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%) rotateZ(330deg)',
            animationName: 'opacity-fade-out',
            animationDuration: '1.2s',
            animationIterationCount: 'infinite',
            animationDelay: '1.2s'
        });
    }

    show() {
        document.querySelector('.lazy-loading').style.display = 'flex';
    }

    close() {
        document.querySelector('.lazy-loading').style.display = 'none';
    }
}

export { Lazyloading };