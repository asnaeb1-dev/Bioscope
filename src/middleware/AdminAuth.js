const jwt = require('jsonwebtoken');
const Admin = require('./../models/adminModel')

const SECRET_KEY = '!!BIOSCOPE_APP_ADMIN!!';

const auth = async function(request, response, next){
    try{
        const token = request.header('Authorization'). replace('Bearer ', '');
        const decoded = jwt.verify(token, SECRET_KEY);
        const admin = await Admin.findOne({_id: decoded._id, 'tokens.token': token})
        if(!admin){
            throw new Error();
        }
        request.admin = admin;
        request.token = token;
        next();
    
    }catch(e){
        response.status(401).send({message: 'please become an admin first'})
    }
}

module.exports = auth;