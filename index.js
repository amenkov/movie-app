import { searchUrl } from "./modules.js"
import { localStorageKey } from "./modules.js"
import { getBtnText } from "./modules.js"

const searchForm = document.getElementById('search-box')


let moviesIds = []
let savedWatchlistStorageObj = localStorage.getItem(localStorageKey)
let savedWatchList

if (savedWatchlistStorageObj) {
    savedWatchList = JSON.parse(savedWatchlistStorageObj)
} else {
    savedWatchList = []
}



document.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(searchForm)
    getMoviesByTitle(formData.get('search-movie'))

})

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains("add-btn")) {
        return
    }
    const imdbId = e.target.dataset.imdbId

    if (!savedWatchList.includes(imdbId)) {
        savedWatchList.push(imdbId)
        localStorage.setItem(localStorageKey, JSON.stringify(savedWatchList))
        e.target.innerHTML = getBtnText(savedWatchList, imdbId)
    } else {
        savedWatchList = savedWatchList.filter(item => imdbId !== imdbId)
        localStorage.setItem(localStorageKey, JSON.stringify(savedWatchList))
        e.target.innerHTML = getBtnText(savedWatchList, imdbId)
    }

})

async function getMoviesByTitle(movieTitle) {
    const movieSearchUrl = `${searchUrl}s=${movieTitle}`
    const res = await fetch(movieSearchUrl)
    const data = await res.json()
    const totalPages = Math.ceil((Number(data.totalResults) / 10))

    if (!totalPages) {
        console.log("Error getting total pages", data)
        return
    }

    getMoviesIds(searchUrl, totalPages, movieTitle)
}

async function getMoviesIds(searchUrl, totalPages, movieTitle) {
    console.log("TotalPages: ", totalPages)

    for (let i = 1; i < totalPages; i++) {
        let searchUrlPaged = `${searchUrl}s=${movieTitle}&page=${i}`
        const res = await fetch(searchUrlPaged)
        const data = await res.json()
        console.log(data)

        if (data.Response === "False") {
            return
        }

        for (let movie of data.Search) {
            moviesIds.push(movie.imdbID)
        }
    }

    renderMovies(moviesIds)
}

async function renderMovies(moviesIdsList) {

    let innerHTML = ''

    for (let id of moviesIdsList) {
        let dirSearchUrl = `${searchUrl}i=${id}`
        

        const res = await fetch(dirSearchUrl)
        const movieData = await res.json()

        if (movieData.Response === "False") {
            console.log(movieData)
            return
        }

        const btnText = getBtnText(savedWatchList, movieData.imdbID)

        innerHTML += `
         <div class="movie-card">
             <img class="poster"
                 src="${movieData.Poster}">
             <div class="movie-info">
                 <h3 class="movie-title">${movieData.Title}<span class="rating"><i class="fa-solid fa-star"></i>${movieData.imdbRating}</span></h3>
                 <div class="movie-details">
                     <p>${movieData.Runtime}</p>
                     <p>${movieData.Genre}</p>
                     <button class="btn add-btn" data-imdb-id="${movieData.imdbID}">${btnText}</button>
                 </div>
                 <p class="plot">${movieData.Plot}</p>
             </div>
         </div>
         <hr>
        `
    }

    document.getElementById('main').innerHTML = innerHTML

}


// {Response: 'False', Error: 'Too many results.'}


// {
//     "Title": "Blade Runner",
//     "Year": "1982",
//     "Rated": "R",
//     "Released": "25 Jun 1982",
//     "Runtime": "117 min",
//     "Genre": "Action, Drama, Sci-Fi",
//     "Director": "Ridley Scott",
//     "Writer": "Hampton Fancher, David Webb Peoples, Philip K. Dick",
//     "Actors": "Harrison Ford, Rutger Hauer, Sean Young",
//     "Plot": "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.",
//     "Language": "English, German, Cantonese, Japanese, Hungarian, Arabic, Korean",
//     "Country": "United States, United Kingdom, Hong Kong",
//     "Awards": "Nominated for 2 Oscars. 13 wins & 22 nominations total",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BOWQ4YTBmNTQtMDYxMC00NGFjLTkwOGQtNzdhNmY1Nzc1MzUxXkEyXkFqcGc@._V1_SX300.jpg",
//     "Ratings": [
//         {
//             "Source": "Internet Movie Database",
//             "Value": "8.1/10"
//         },
//         {
//             "Source": "Rotten Tomatoes",
//             "Value": "89%"
//         },
//         {
//             "Source": "Metacritic",
//             "Value": "84/100"
//         }
//     ],
//     "Metascore": "84",
//     "imdbRating": "8.1",
//     "imdbVotes": "876,371",
//     "imdbID": "tt0083658",
//     "Type": "movie",
//     "DVD": "N/A",
//     "BoxOffice": "$32,914,489",
//     "Production": "N/A",
//     "Website": "N/A",
//     "Response": "True"
// }