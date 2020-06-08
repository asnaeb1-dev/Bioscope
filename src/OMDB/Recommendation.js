const fetch = require('node-fetch');

const baseURL = 'https://bioscope-api.herokuapp.com/movie?title=';
const {getMovieDetails} = require('./../OMDB/omdb');
const Movie = require('./../models/movieModel');

//get recommendations from BioScope API
const getRecommendations = async (title) => {
    const response = await fetch(`${baseURL}${title}`);
    const result = await response.json();
    
    const recommendations = [];

    for(let i = 0;i< result.length;i++){
        const response = await getMovieDetails(result[i].Name);
        recommendations.push({
            movie_name: response.Title,
            movie_poster: response.Poster
        })
    }
    return recommendations;
};

module.exports = {getRecommendations};