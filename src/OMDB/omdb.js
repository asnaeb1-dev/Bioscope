const fetch = require('node-fetch');
const API_KEY = process.env.OMDB_API_KEY;

const getMovieDetails = async (query) => {
    const base_URL = 'http://www.omdbapi.com/?apikey='
    const response = await fetch(`${base_URL}${API_KEY}&t=${query}`)
    const result = await response.json();
    return result.Poster;
}

module.exports = getMovieDetails;

