const express = require('express');
const router = new express.Router();

const User = require('./../models/userModel');
const authentication = require('./../middleware/Auth');

//sign up the user
router.post('/user/signup', async function(request, response){
    const user = new User(request.body);
    const token = await user.generateAuthToken();
    try{
        await user.save();
        response.status(201).send({user, token});
    }catch(e){
        response.status(400).send(e)
    }
})
//login the user
router.post('/user/login', async function(request,response){
    try{
        const user = await User.findUserByCredentials(request.body.email, request.body.password);
        const token = await user.generateAuthToken();
        response.status(201).send({user: user.getUserProfile(), token})
    }catch(e){
        response.status(404).send(e)
    }
})
//get the user profile
router.get('/user/me', authentication, async function(request, response){
    const profile = request.user.getUserProfile();
    response.send(profile);
})

//update the user details
router.patch('/user/me/edit', authentication, async function(request,response){
    const allowedUpdates = ['name', 'email', 'password'];
    const keys = Object.keys(request.body);

    keys.forEach(key => {
        if(!allowedUpdates.includes(key)){
            return response.status(400).send('bad operation')
        }
    })
    try{
        const userF = request.user;
        keys.forEach(key => userF[key] = request.body[key])
        await userF.save();
        response.status(200).send(useF)
    }catch(e){
        response.status(500).send('Failed to update')
    }
})

//remove a user
router.delete('/user/delete', authentication, async function(request, response){
    try{
        await request.user.remove();
        response.send('user removed!')
    }catch(e){
        response.status(400).send(e);
    }
})

//get all genres that user likes
router.get('/user/genres', authentication, async function(request, response){
    try{
        const genres = request.user.genre_choices;
        response.send(genres);
    }catch(e){
        response.status(404).send('not found');
    }
})

//insert genre choices
router.post('/user/insertgenres', authentication, async function(request, response){
    try{
        request.user.genre_choices.push(request.body);
        await request.user.save()
        response.send(request.user.genre_choices);
    }catch(e){
        response.status(400).send(e);
    }
})

//delete genre choice
// /user/:id/remgen
/***
 * repair this
 */
router.delete('/user/remgen', authentication, async function(request, response){
    try{
        const user = request.user;
        user.genre_choices =  user.genre_choices.filter(genre => genre.genre !== request.body)
        await user.save();
        response.send(user.genre_choices);
    }
    catch(e){
        response.status(400).send(e);
    }
})

//add movie that was last watched by user
router.post('/user/watchnow', authentication, async function(request, response){
    try{
        request.user.movieArray.push(request.body);
        await user.save();
        response.send(user);
    }catch(e){
        response.status(400).send(e)
    }
})

//get all the movies watched by user
router.get('/user/watched', authentication, async function(request, response){
    try{
        const moviesWatched = request.user.movieArray;
        response.send(moviesWatched);
    }catch(e){
        response.status(400).send('Nothing to show')
    }
})

module.exports = router;