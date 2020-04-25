const express = require('express');
const path = require('path');
const TMDb = require('./../TMDB/tmdb');

const router = new express.Router();

const Movie = require('./../models/movieModel');

const authentication = require('./../middleware/Auth');
const adminAuthentication = require('./../middleware/AdminAuth');

//serve up the pushing page
router.get('/movie/admin', (request, response) => {
    response.sendFile(path.join(__dirname, '../../public/upload.html'))
    
})

//search for movie
router.get('/movie/search', async (request, response) => {
    try{
        const suggestions = await TMDb(request.query.name);
        response.send(suggestions)
    }catch(e){
        response.status(500).send(e);
    }
})

//push movie to database
router.post('/movie/push', async (request, response) => {
    try{
        const movie = new Movie(request.body);
        await movie.save();
        response.send(movie);
    }catch(e){
        response.status(500).send(e);

    }
})

//get movie by name
// /movie?t={title}
router.get('/movie', authentication, async function(request,response){
    try{
        const movie = await Movie.find({title: request.query.t})
        response.send(movie);
    }catch(e){
        response.status(404).send(e);
    }
})

//get a movie by its id
// /movie?id={movie_id}
router.get('/movie', authentication, async function(request, response){
    try{
        const movie = await Movie.findById(request.query.id);
        response.send(movie)
    }catch(e){
        response.status(404).send(e);
    }
})

//get all movie by pagination
// /movie/all?limit=4&skip=4
router.get('/movie/all', authentication, async function(request, response){
    try{
        const result = await Movie.find({}).limit(parseInt(request.query.limit)).skip(parseInt(request.query.skip))
        response.send(result);
    }catch(e){
        response.status(500).send(e);
    }
})

//get movies by genre

//get movies by rating
// /movies/ratings?r={rating}
router.get('/movie/ratings', authentication, async function(request, response){
    try{
        const movies = await Movie.find({"rating": {$gte: request.query.r}})
        response.send(movies);
    }catch(e){
        response.status(404).send(e);
    }
})

//search movie by year
// /movie/year?y={year}
router.get('/movie/year', authentication, async function(request, response){
    try{
        const movie = await Movie.find({ year: request.query.y});
        response.send(movie);
    }catch(e){
        response.status(404).send(e);
    }
})

module.exports = router;