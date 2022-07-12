const main = () => {
    getMovies();

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

const getMovies = () => {
    fetch('/list')
        .then((response) => {
            response
                .json()
                .then((data) => {
                    const ulElement = document.createElement('ul');
                    data.files.forEach((record) => {
                        const liElement = document.createElement('li');
                        const linkElement = document.createElement('a');

                        linkElement.innerText = record;
                        linkElement.href = `/play/${record}`;
                        linkElement.addEventListener('click', requestMoviePlay);
                        liElement.appendChild(linkElement);

                        ulElement.appendChild(liElement);
                    });

                    const movieListElement = document.getElementById('movie-list');
                    movieListElement.appendChild(ulElement);
                })
                .catch((reson) => {
                    console.error(reson);
                });
        })
        .catch((reson) => {
            console.error(reson);
        });
};

main();
