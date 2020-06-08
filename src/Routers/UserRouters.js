const express = require('express');
const router = new express.Router();
require("dotenv").config();

const User = require('./../models/userModel');
const Movie = require('./../models/movieModel');
const authentication = require('./../middleware/Auth');
const bcrypt = require('bcrypt');

const {sendCode, sendForgotPasswordMail} = require('./../email/email');

//send confirmation code to email
router.post('/user/sendcode', async function(request, response){
    try{
        const code = Math.floor(100000 + Math.random() * 900000);
        await sendCode(code, request.body.email, process.env.EMAILADDRESS, process.env.PASSWORD);
        response.send({confirmation_code : code})
    }catch(e){
        console.log(e);
        response.status(400).send({error : e.message});
    }
})

//sign up the user
router.post('/user/signup', async function(request, response){
    const user = new User(request.body);
    try{
        const token = await user.generateAuthToken();
        await user.save();
        response.status(201).send({user, token});
    }catch(e){
        response.status(400).send({error: e.message})
    }
})

//login the user
router.post('/user/login', async function(request,response){
    try{
        const user = await User.findUserByCredentials(request.body.email, request.body.password);
        const token = await user.generateAuthToken();
        response.status(201).send({user: user.getUserProfile(), token})
    }catch(e){
        response.status(400).send({error: e.message});
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
        response.status(200).send(userF)
    }catch(e){
        response.status(500).send('Failed to update')
    }
})

//remove a user
router.delete('/user/delete', authentication, async function(request, response){
    try{
        const user = await request.user.remove();
        response.send(user)
    }catch(e){
        response.status(400).send({error: e.message});
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
        request.user.genre_choices= request.body;
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
        await request.user.save();
        response.send(request.user.movieArray);
    }catch(e){
        response.status(400).send(e);
    }
})

//get all the movies watched by user
router.get('/user/watched', authentication, async function(request, response){
    try{
        const moviesWatched = request.user.movieArray;
        response.send(moviesWatched);
    }catch(e){
        response.status(404).send({message: e.message});
    }
})

router.get('/user/logout', authentication, async function(request, response){
    try{
        request.user.tokens = request.user.tokens.filter((token) => token.token!==request.token)
        await request.user.save();
        response.status(200).send({message : "logged_out", name: request.user.name})
    }catch(e){
        response.status(404).send({message: e.message});
    }
})

//change password
router.post("/user/changepassword", authentication, async function(request, response){
    const previousPassword = request.body.oldpassword;
    const newPassword = request.body.newpassword;
    try{
        const isAMatch = await bcrypt.compare(previousPassword, request.user.password);
        if(isAMatch){
            request.user.password = newPassword;
            await request.user.save();
            response.send(request.user);
        }else{
            throw new Error("Please enter the proper password")
        }
    }catch(e){
        response.status(400).send({error: e.message});
    }
});

//send forgot password code
router.post("/user/forgot", async function(request, response){
    const email = request.body.email;
    try{
        const confirmation = await User.findOne({email});
        if(confirmation){
            const code =  Math.floor(100000 + Math.random() * 900000);
            await sendForgotPasswordMail(email, code, process.env.EMAILADDRESS, process.env.PASSWORD);
            response.send({confirmation_code: code});
        }
    }catch(e){
        response.status(404).send({error: e.message})
    }
})

//change password
router.post("/user/forgotpass", async function(request, response){
    const email = request.body.email;
    try{
        const result = await User.findOne({email});
        if(result){
            result.password = request.body.password;
            result.tokens = [];
            await result.save();
            response.send(result.user);
        }else{
            throw new Error('User not found')
        }
    }catch(e){
        response.status(404).send({error: e.message});
    }
})

module.exports = router;