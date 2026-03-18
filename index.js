import { searchUrl } from "./modules.js"
import { localStorageKey } from "./modules.js"
import { getBtnText } from "./modules.js"
import { renderMovies } from "./render.js"

const searchForm = document.getElementById('search-box')
const placeholderEl = document.getElementById('placeholder')
const searchBtn = document.getElementById('search-movie-btn')
const originalBtnText = searchBtn.textContent


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

    searchBtn.textContent = 'Loading...'

    searchBtn.disabled = true

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
        savedWatchList = savedWatchList.filter(item => item !== imdbId)
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
        placeholderEl.innerHTML = `<h3>Unable to find what you’re looking for. Please try another search.</h3>`
        searchBtn.disabled = false
        searchBtn.textContent = originalBtnText
        return
    }

    getMoviesIds(searchUrl, totalPages, movieTitle)
}

async function getMoviesIds(searchUrl, totalPages, movieTitle) {
    console.log("TotalPages: ", totalPages)

    for (let i = 0; i < totalPages; i++) {
        i++
        let searchUrlPaged = `${searchUrl}s=${movieTitle}&page=${i}`
        const res = await fetch(searchUrlPaged)
        const data = await res.json()
        console.log(data)

        if (data.Response === "False") {
            searchBtn.disabled = false
            searchBtn.textContent = originalBtnText
            return
        }

        for (let movie of data.Search) {
            moviesIds.push(movie.imdbID)
        }
    }

    if (document.getElementById('placeholder')) {
        document.getElementById('placeholder').remove()
    }



    renderMovies(moviesIds, savedWatchList)

    searchBtn.textContent = originalBtnText
    searchBtn.disabled = false

}


