const express = require('express');
const path = require('path');
const omdb = require('../OMDB/omdb');

const router = new express.Router();

const Movie = require('./../models/movieModel');
const recommendations = require('./../OMDB/Recommendation');
const suggestions = require('./../OMDB/tmdb');

const authentication = require('./../middleware/Auth');
const adminAuthentication = require('./../middleware/AdminAuth');

//get suggestions based on text filled
router.get('/movie/title/:title', adminAuthentication, async function(request, response){
    const title = request.params.title;
    try{
        const res = await suggestions(title);
        response.send(res);
    }catch(e){
        response.status(400).send({message: "not available"});
    }
});

//get movie by name
// /movie?t={title}
router.get('/movie', authentication, async function(request,response){
    try{
        const movie = await Movie.findOne({title: request.query.t})
        response.send(movie);
    }catch(e){
        response.status(404).send({message: e.message});
    }
})

//get a movie by its id
// /movie?id={movie_id}
router.get('/movie/id', authentication, async function(request, response){
    try{
        const movie = await Movie.findById(request.query.id);
        response.send(movie)
    }catch(e){
        response.status(404).send({message: e.message});
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

//get movie recommendations based on movie selected
// /movie/recommendation?title={title}
router.get('/movie/recommendations', authentication, async function(request, response){
    const movieTitle = request.query.title;
    try{
        const result = await recommendations(movieTitle);
        response.send(result);    
    }catch(e){
        response.send({error: e.message});
    }
});

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