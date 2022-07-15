const main = () => {
    getMovies();
    openUploadModalButton();
    modalCloseButton();
    stopButton();
    sendButton();
    bodyClick();
};

const openUploadModalButton = () => {
    const openUploadModalButtonElement = document.getElementById('upload-modal-open-button');
    openUploadModalButtonElement.addEventListener('click', () => {
        const uploadModalElement = document.getElementById('upload-modal');
        uploadModalElement.style.display = 'block';
    });
};

const stopButton = () => {
    const stopButtonElement = document.getElementById('stop');
    stopButtonElement.addEventListener('click', (event) => {
        event.preventDefault();

        fetch('/stop')
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((reson) => {
                        console.error(reson);
                    });
            })
            .catch((reson) => {
                console.error(reson);
            });
    });
};

const getMovies = () => {
    fetch('/list')
        .then((response) => {
            response
                .json()
                .then((data) => {
                    const movieListElement = document.getElementById('movie-list');
                    while (movieListElement.firstChild) {
                        movieListElement.removeChild(movieListElement.firstChild);
                    }

                    data.files.forEach((record) => {
                        const linkElement = document.createElement('a');

                        linkElement.innerText = record;
                        linkElement.href = `/play/${record}`;
                        linkElement.addEventListener('click', requestMoviePlay);

                        movieListElement.appendChild(linkElement);
                    });
                })
                .catch((reson) => {
                    console.error(reson);
                });
        })
        .catch((reson) => {
            console.error(reson);
        });
};

const requestMoviePlay = (event) => {
    event.preventDefault();
    const requestUrl = event.srcElement.href;

    fetch(requestUrl)
        .then((response) => {
            response
                .json()
                .then((data) => {
                    console.log(data);
                })
                .catch((reson) => {
                    console.error(reson);
                });
        })
        .catch((reson) => {
            console.error(reson);
        });
};

const sendButton = () => {
    const sendButtonElement = document.getElementById('upload-button');
    sendButtonElement.addEventListener('click', fileUpload);
};

const fileUpload = () => {
    const uploadProgressElement = document.getElementById('upload-progress');
    const selectFileElement = document.getElementById('select-file');

    if (selectFileElement.files[0] != undefined) {
        uploadProgressElement.value = 0;
        uploadProgressElement.max = selectFileElement.files[0].size;
    }

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = (e) => {
        uploadProgressElement.value = e.loaded;
        console.log(`Upload ${e.loaded} / ${e.total}`);
    };

    xhr.upload.onload = () => {
        getMovies();

        modalClose();
    };

    const uploadForm = document.getElementById('upload-form');
    const formData = new FormData(uploadForm);
    xhr.send(formData);
};

const modalCloseButton = () => {
    const modalCloseButtonElement = document.getElementById('modal-close-button');
    modalCloseButtonElement.addEventListener('click', () => {
        modalClose();
    });
};

const modalClose = () => {
    const uploadModalElement = document.getElementById('upload-modal');

    uploadModalElement.classList.add('modal-close');

    setTimeout(() => {
        uploadModalElement.style.display = 'none';
        uploadModalElement.classList.remove('modal-close');
    }, 1000);
};

main();
