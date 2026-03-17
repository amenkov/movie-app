import { searchUrl } from "./modules.js"
import { getBtnText } from "./modules.js"

export async function renderMovies(moviesIdsList, savedWatchList) {

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
                 src="${movieData.Poster}" onerror="this.src='./images/filmstrip.png';this.onerror='';">
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

