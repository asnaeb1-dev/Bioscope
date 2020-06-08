const express = require('express');

const router = new express.Router();

const Movie = require('./../models/movieModel');
const {getRecommendations} = require('./../OMDB/Recommendation');
const {getMovies, getMovieData} = require('./../OMDB/tmdb');

const authentication = require('./../middleware/Auth');
const adminAuthentication = require('./../middleware/AdminAuth');

//get suggestions based on text filled
router.get('/movie/title/:title', adminAuthentication, async function(request, response){
    const title = request.params.title;
    try{
        const res = await getMovies(title);
        response.send(res);
    }catch(e){
        console.log(e);
        response.status(400).send({message: "not available"});
    }
});

//push the movie to the database
router.post('/admin/upload/me', adminAuthentication, async function(request, response){
    const movieid = request.body.movieid;
    const url = request.body.url;
    const category = request.body.category;
    const industry = request.body.industry;
    //search for movie by id
    try{
        //get all relevant info about the movie
        const movieObj = await getMovieData(movieid, request.admin._id,url);
        //push it
        const movie = new Movie({
            tmdb_id: movieObj.tmdb_id,
            title: movieObj.title,
            description: movieObj.description, 
            category,       
            year: movieObj.year,
            rating: movieObj.rating,
            language: movieObj.language,
            videos: movieObj.videos,
            director: null,
            backdrops: movieObj.backdrops,
            posters: movieObj.posters,
            actors: movieObj.actors,
            uploadedBy: movieObj.uploadedBy,
            url: movieObj.url,
            industry       
        });        

        const recommend = await getRecommendations(movieObj.title);
        recommend.forEach( mov => movie.recommendation.push({movie_name: mov.movie_name, movie_poster: mov.movie_poster}));

        movieObj.genres_array.forEach(genre => movie.genres_array.push({genre: genre.name, genre_id: genre.id}))
        //save it
        await movie.save();    
        await request.admin.save();
        //send a success response
        response.send({message: "success", title: movie.title});
    }catch(e){
        console.log(e.message)
        response.status(404).send({message: e.message});
    }
})

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
router.get('/movie/recommendations', async function(request, response){
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

router.get('/movie/search', authentication, async function(request, response){
    try{
        const result = await Movie.find({category: request.query.c});
        const res = result.filter(movie => movie.title.toLowerCase().includes(request.query.q))
        response.send(res);
    }catch(e){
        response.status(404).send({error: e.message});
    }
})

// /movie/category?category={category}
router.get('/movie/category', authentication, async function(request, response){
    const category = request.query.category;
    try{
        const movies = await Movie.find({category});
        response.send(movies);
    }catch(e){
        response.status(404).send({error: e.message});
    }
});

// /movie/category?i={industry}
router.get('/movie/industry', authentication, async function(request, response){
    const industry = request.query.i;
    try{
        const movies = await Movie.find({industry});
        response.send(movies);
    }catch(e){
        response.status(404).send({error: e.message});
    }
})

module.exports = router;