const fetch = require('node-fetch');
const API_KEY = '66ef6fdc';

const getMovieDetails = async (query) => {
    //http://www.omdbapi.com/?apikey=[yourkey]&
    const base_URL = 'http://www.omdbapi.com/?apikey='
    const response = await fetch(`${base_URL}${API_KEY}&t=${query}`)
    const result = await response.json();
    return result;
}

module.exports = getMovieDetails;

