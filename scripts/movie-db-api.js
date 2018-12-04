const axios = require('axios')
const DISCOVER_ENDPOINT = "discover/movie"
const MOVIE_ENDPOINT = "movie"
const API_KEY = /* Create Your TMDB ApiKey from https://www.themoviedb.org */
const client = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    header: {},
})

// Returns 20 random action movies
exports.discoverActionMovieList = function (genreId) {
    let randomPage = Math.floor(Math.random() * 50)

    return client.get(DISCOVER_ENDPOINT, {
        params: {
            api_key: API_KEY,
            language: "en-US",
            sort_by: "popularity.desc",
            include_adult: false,
            include_video: false,
            page: randomPage,
            with_genres: genreId
        }
    })
}

exports.getMovie = function (movieId) {
    return client.get(MOVIE_ENDPOINT + "/" + movieId, {
        params: {
            api_key: API_KEY,
            language: "en-US",
        }
    })
}