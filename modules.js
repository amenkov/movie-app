const searchUrl = 'http://www.omdbapi.com/?apikey=48cbe039&'
const localStorageKey = "movie-watchlist-app"


function getBtnText(movieList, movieId) {
    if (movieList.includes(movieId)) {
        return `<i class="fa-solid fa-circle-minus"></i>Remove from watchlist`
    } else {
        return `<i class="fa-solid fa-circle-plus"></i>Watchlist`
    }
}

export { searchUrl, localStorageKey, getBtnText }

