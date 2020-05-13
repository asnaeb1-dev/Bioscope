const fetch = require('node-fetch');

const baseURL = 'https://movie-recommendation-api.herokuapp.com/movie';

const getRecommendations = async (title) => {
    const response = await fetch(`${baseURL}?title=${title}`, {
        method: "GET"
    });
    const result = await response.json();
    return result;
}

module.exports = getRecommendations;