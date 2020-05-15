const express = require('express');
const router = new express.Router();

const Admin = require('./../models/adminModel');
const Movie = require('./../models/movieModel');

const adminAuthentication = require('./../middleware/AdminAuth')

//create admin account
router.post('/admin/create', async function(request, response){
    const special_token = request.header('specialtoken');

    const adminPresent = await Admin.findOne({special_token: special_token})
    if(!adminPresent){
       return response.status(404).send({message: 'Chabi kahan hai!'})
    }

    const allowed = ['name', 'email', 'password'];
    const keys = Object.keys(request.body);
    keys.forEach(key => {
        if(!allowed.includes(key)){
            return response.status(403).send('Bad operation')
        }
    })
    try{
        keys.forEach(key => adminPresent[key] = request.body[key])
        const token = await adminPresent.generateTokenForAdmin();
        await adminPresent.save();
        response.status(200).send({adminPresent, token})
    }catch(e){
        response.status(500).send(e)
    }
})

//admin login
router.post('/admin/login', async function(request, response){
    const special_token = request.header('specialtoken');
    try{
        const admin = await Admin.findAdminByCredentials(request.body.email, request.body.password, special_token)
        response.send({adminPresent: admin.getPublicProfile(), token: request.token});
    }catch(e){
        response.status(404).send(e);
    }
})

//get admin profile
router.get('/admin/me', adminAuthentication, async function(request, response){
    const admin = request.admin;
    return response.send(admin.getPublicProfile());
})

//delete the account
router.delete('/admin/remove', adminAuthentication, async function(request, response){
    try{
        const admin = await request.admin.remove();
        response.send(admin.getPublicProfile());
    }catch(e){
        response.status(400).send({message: e.message});
    }
})

//update the account
router.patch('/admin/update', adminAuthentication, async function(request, response){
    const allowedUpdates = ['name', 'email', 'password'];
    const keys = Object.keys(request.body);

    keys.forEach(key => {
        if(!allowedUpdates.includes(key)){
            return response.status(400).send({message: 'failure', err_code: '3'})
        }
    })
    try{
        const adminF = request.admin;
        keys.forEach(key => adminF[key] = request.body[key])
        await adminF.save();
        response.status(200).send(adminF.getPublicProfile());
    }catch(e){
        console.log(e);
        response.status(500).send({message: e.message})
    }
})

//get all uploaded movies
router.get('/admin/uploads', adminAuthentication, async function(request, response){
    const admin = request.admin;
    try{
        const movies = await Movie.find({uploadedBy: admin._id})
        response.send(movies)
    }catch(e){
        response.status(404).send({error: e.message});
    }
});


//remove movies uploaded by admin
router.delete('/admin/upload/delete/:movieid', adminAuthentication, async function(request, response){
    try{
        const movie = await Movie.findOne({_id: request.params.movieid});
        await movie.remove();
        response.send(movie);    
    }catch(e){
        response.status(404).send({message: e.message});
    }
})

module.exports = router;