import { localStorageKey } from "./modules.js"
import { searchUrl } from "./modules.js"
import { getBtnText } from "./modules.js"

let savedWatchlistStorageObj = localStorage.getItem(localStorageKey)
let savedWatchList

if (savedWatchlistStorageObj) {
    savedWatchList = JSON.parse(savedWatchlistStorageObj)
} else {
    savedWatchList = []
}

renderMovies(savedWatchList)

async function renderMovies(savedWatchList) {

    let innerHTML = ''

    for (let id of savedWatchList) {
        let dirSearchUrl = `${searchUrl}i=${id}`


        const res = await fetch(dirSearchUrl)
        const movieData = await res.json()

        if (movieData.Response === "False") {
            console.log(movieData)
            return
        }

        const btnText = getBtnText(savedWatchList, movieData.imdbID)

        innerHTML += `
         <div class="movie-card search-list" id="${movieData.imdbID}">
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
        document.getElementById('main').innerHTML = innerHTML
    }

}

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains("add-btn")) {
        return
    }
    const imdbId = e.target.dataset.imdbId

    savedWatchList = savedWatchList.filter(item => imdbId !== imdbId)
    localStorage.setItem(localStorageKey, JSON.stringify(savedWatchList))

    document.getElementById(imdbId).remove()
    document.getElementsByTagName('hr')[0].remove()

})
