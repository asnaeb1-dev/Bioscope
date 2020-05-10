// APIKEY = 17d99bf38e7ffbebabfc4d9713b679a8
// link = https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={query}

const fetch = require('node-fetch');

const getMovies = async function(query){
    const api_key = '17d99bf38e7ffbebabfc4d9713b679a8';
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