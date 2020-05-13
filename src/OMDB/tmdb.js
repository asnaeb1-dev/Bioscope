
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

module.exports = getMovies;