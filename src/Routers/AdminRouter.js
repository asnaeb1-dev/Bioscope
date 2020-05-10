const express = require('express');
const router = new express.Router();

const Admin = require('./../models/adminModel');
const Movie = require('./../models/movieModel');

const adminAuthentication = require('./../middleware/AdminAuth')

//create_account
router.get('/admin/createadmin', (request, response)=> {
    response.render('adminRegister');
})
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
        response.redirect('/movie/admin')
    }catch(e){
        response.status(500).send(e)
        console.log(e)
    }
})

//serve up login page
router.get('/admin/loginpage', function(request, response){
    response.render('adminlogin');
})

//admin login
router.post('/admin/login', async function(request, response){
    const special_token = request.header('specialtoken');
    try{
        const admin = await Admin.findAdminByCredentials(request.body.email, request.body.password, special_token)
        response.send(admin);
        response.header = admin.token;
        response.redirect('/movie/admin')
    }catch(e){
        response.status(404).send(e);
    }
})

//get admin profile
router.get('/admin/me', adminAuthentication, async function(request, response){
    return response.send(request.admin);
})


router.get('/admin/upload', adminAuthentication, async function(request, response){
    response.sendFile(path.join(__dirname, '../../public/upload.html'));
    /**
     * CONTINUE!!!!
     */
})

module.exports = router;