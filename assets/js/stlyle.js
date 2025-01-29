const API_KEY = '59b3b113';  
const BASE_URL = 'https://www.omdbapi.com/';

let currentPage = 1;
let totalPages = 1;


function fetchMovies(query, page = 1) {
    fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovies(data.Search);
                totalPages = Math.ceil(data.totalResults / 10);
                displayPagination();
            } else {
                alert("No results found.");
            }
        })
        .catch(error => console.error('An error occurred:', error));
}


function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie');
        movieItem.onclick = () => showMovieModal(movie.imdbID);

        const movieImage = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
        movieItem.innerHTML = `
            <img src="${movieImage}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <div class="movie-icons">
                <i class="fas fa-heart" onclick="toggleFavorite('${movie.imdbID}')"></i>
                <i class="fas fa-save" onclick="saveMovie('${movie.imdbID}')"></i>
            </div>
        `;

        movieList.appendChild(movieItem);
    });
}

//  modal 
function showMovieModal(imdbID) {
    fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                const movieTitle = document.getElementById('movieTitle');
                movieTitle.innerText = `${data.Title} (${data.Year})`;

                const movieDetails = document.getElementById('movieDetails');
                movieDetails.innerHTML = `
                    <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${data.Title}">
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actors:</strong> ${data.Actors}</p>
                    <p><strong>Language:</strong> ${data.Language}</p>
                    <p><strong>Plot:</strong> ${data.Plot !== 'N/A' ? data.Plot : 'No plot available.'}</p>
                `;

                document.getElementById('movieModal').style.display = "block";
            }
        })
        .catch(error => console.error('Error loading movie details:', error));
}

// Close the modal
function closeModal() {
    document.getElementById('movieModal').style.display = "none";
}

// Search movies
function searchMovies() {
    const query = document.getElementById('search-input').value;
    if (query) {
        currentPage = 1;
        fetchMovies(query, currentPage);
    }
}

window.onload = function() {
    fetchMovies("movie", currentPage);
};