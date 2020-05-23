const fetch = require('node-fetch');

const baseURL = 'https://movie-recommendation-api.herokuapp.com/movie';

const getPosters = require('./omdb')

const getRecommendations = async (title) => {
    const response = await fetch(`${baseURL}?title=${title}`, {
        method: "GET"
    });
    const result = await response.json();
    if(result !== "Movie not in Database"){
        const recommendation = [];
        const rcmd = await saveRecommendation(result, recommendation);
        return rcmd;
    }
    return [];
}

const saveRecommendation = async (result, rcmd) => {
    for(let i = 0;i<result.length; i++){
        let poster = await getPosters(result[i].Name);
        rcmd.push({
            recommended_movie : result[i].Name,
            recommended_movie_genre: result[i].Genre,
            movie_poster_data : poster
        })
    }
    return rcmd;
}

module.exports = getRecommendations;