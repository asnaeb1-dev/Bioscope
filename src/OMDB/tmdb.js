
const fetch = require('node-fetch');
const api_key = process.env.TMDB_API_KEY;

const getMovies = async function(query){
    const baseURL = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`
    const response = await fetch(baseURL);
    const result = await response.json();

    const res = parseData(result.results);

    return res;
}
const parseData = (resultArray) => {
    let resu = [];
    for(let i = 0;i<resultArray.length;i++){
        resu[i] = {
            title: resultArray[i].title,
            movieid: resultArray[i].id,
        }
    }
    return resu;
} 

const getMovieData = async (id, user_id, url) => {
    const baseURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`;
    const response = await fetch(baseURL);
    const result = await response.json();

    const genreArr = [];
    result.genres.forEach(genre => genreArr.push(genre));

    const movieObj = {
        title: result.original_title,
        description: result.overview,
        year: result.release_date,
        rating: result.vote_average,
        language: result.original_language,
        genres_array: genreArr,
        director: null,
        backdrop: result.backdrop_path,
        posterPath: result.poster_path,
        actors: null,
        uploadedBy: user_id,
        url: url
    }
    console.log(movieObj)
    return movieObj;
}

module.exports = {getMovies, getMovieData};