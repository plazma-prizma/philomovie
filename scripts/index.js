'use strict'
/**
 * Sample Script
 */

const movieApi = require("./movie-db-api")
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"
const IMDB_BASE_URL = "https://www.imdb.com/title/"
const PAGINATION_DEPTH = 10
const ADVENTURE_GENREID = 12
const ACTION_GENREID = 28
const DRAMA_GENREID = 18
const COMEDY_GENREID = 35
const HORROR_GENREID = 27

module.exports = bot => {

    // responds to greet slash command
    bot.on('movie', payload => {
        let message = {
            text: "Which genre are you up to?",
            attachments: [{
                fallback: 'actions',
                callback_id: "genre_click",
                actions: [
                    {type: "button", name: "Adventure", text: "Adventure", value: ADVENTURE_GENREID},
                    {type: "button", name: "Action", text: "Action", value: ACTION_GENREID},
                    {type: "button", name: "Drama", text: "Drama", value: DRAMA_GENREID},
                    {type: "button", name: "Comedy", text: "Comedy", value: COMEDY_GENREID},
                    {type: "button", name: "Horror", text: "Horror", value: HORROR_GENREID},
                ]
            }]
        };

        // ephemeral reply
        bot.replyPrivate(payload, message);
    })

    // Interactive Message handler
    bot.on('genre_click', payload => {
        movieApi.discoverActionMovieList(payload.actions[0].value).then(
            (response) => {
                let randomMovie = response.data.results[Math.floor(Math.random() * PAGINATION_DEPTH)]
                movieApi.getMovie(randomMovie.id).then(
                    (r) => {
                        let movie = r.data

                        let message = {
                            attachments: [
                                {
                                    title: movie.title + " (" + getYear(randomMovie.release_date) + ")",
                                    text: movie.overview + "\n",
                                    image_url: POSTER_BASE_URL + movie.poster_path,
                                    actions: [
                                        {
                                            type: "button",
                                            text: "See on IMDB 📺",
                                            url: IMDB_BASE_URL + movie.imdb_id,
                                            style: "primary",
                                        }
                                    ]
                                }
                            ]
                        }

                        bot.reply(payload, message)
                    }
                ).catch(e => console.log("error on getMovie:", e))
            }
        ).catch((error) => {
            console.log("error on discoverMovie", error)
        })
    });

    function getYear(releaseDate) {
        return releaseDate.substring(0, 4)
    }
}