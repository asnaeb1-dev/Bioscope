
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
    const actors = await getActors(id);
    const videos = await getVideos(id);
    const {backdrops, posters} = await getImages(id);

    const movieObj = {
        tmdb_id: id,
        title: result.original_title,
        description: result.overview,
        year: result.release_date,
        rating: result.vote_average,
        language: result.original_language,
        videos: videos,
        genres_array: [...result.genres],
        director: null,
        backdrops: backdrops,
        posters: posters,
        actors: actors,
        uploadedBy: user_id,
        url: url
    }
   // console.log(movieObj)
    return movieObj;
}

const getActors = async (tmdb_id) => {
    const actors =[];
    const url = `https://api.themoviedb.org/3/movie/${tmdb_id}/credits?api_key=${api_key}`
    const response = await fetch(url);
    const result = await response.json();

    result.cast.every( (element, index) => {
        if(index <= 10){
            actors.push({
                actor: element.name,
                actor_poster: element.profile_path,
                actor_gender: element.gender,
                actor_character:element.character,
                actor_id: element.cast_id
            })
            return true;
        }else{
            return false;
        }
    })
    return actors;
}

const getVideos = async (tmdb_id) => {
    const videos = []
    const url = `https://api.themoviedb.org/3/movie/${tmdb_id}/videos?api_key=${api_key}`
    const response = await fetch(url);
    const result = await response.json();

    result.results.forEach( video => {
        videos.push({
            videoKey : video.key,
            videoType: video.type
        })
    })

    return videos;
}

const getImages = async (tmdb_id) => {
    const backdrops = [], posters = [];
    const url = `https://api.themoviedb.org/3/movie/${tmdb_id}/images?api_key=${api_key}`;
    const response = await fetch(url);
    const result = await response.json();

    result.backdrops.every( (image, index) => {
        if(index <= 10){
            backdrops.push({
                backdropPath: image.file_path,
                height: image.height,
                width: image.width
            })
            return true;
        }else{
            return false;
        }
        
    })

    result.posters.every(  (image, index) => {
        if(index<=10){
            posters.push({
                posterPath: image.file_path,
                height: image.height,
                width: image.width
            })
            return true;
        }else{
            return false;
        }
    })

    return {backdrops, posters};
}

module.exports = {getMovies, getMovieData};