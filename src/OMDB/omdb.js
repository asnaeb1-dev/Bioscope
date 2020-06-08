const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.OMDB_API_KEY;
const getMovieDetails = async (query) => {
    const base_URL = 'http://www.omdbapi.com/?apikey='
    const response = await fetch(`${base_URL}${API_KEY}&t=${query}`)
    const result = await response.json();
    return result;
}

module.exports = {getMovieDetails};

