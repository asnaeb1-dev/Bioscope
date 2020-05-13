const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.ADMIN_SECRET;

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type: String,
        minlength: 8,
        required: true,
    },
    special_token:{
        type: String,
        required: true,
        minlength: 15,
        trim: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    movies_uploaded:[{
        movie_name:{
            type:String
        },
        movie_id:{
            type: mongoose.Schema.Types.ObjectId
        }
    }]
})

adminSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

adminSchema.statics.findAdminByCredentials = async function(email, password, special_token){
    const admin = await Administrator.findOne({special_token});
    if(!admin){
        throw new Error('Admin not found!')
    }
    if(admin.email !== email){
        throw new Error('Invalid email address');
    }
    const isAMatch = await bcrypt.compare(password, admin.password)
    if(!isAMatch){
        throw new Error('Incorrect password!')
    }
    return admin;
}

adminSchema.methods.generateTokenForAdmin = async function(){
    const token = await jwt.sign({_id: this._id.toString()}, SECRET_KEY);
    this.tokens.push({token})
    await this.save();
    return token;
}

adminSchema.methods.getPublicProfile =  function(){
    const admin = this.toObject();

    delete admin.password;
    delete admin.tokens;

    return admin
}

adminSchema.methods.getProfileForPrincipalAdmin =  function(){
    const admin = this.toObject();

    delete admin.password;
    delete admin.tokens;
    delete admin.email;
    delete admin.special_token;

    return admin;
}

const Administrator = mongoose.model('Administrator', adminSchema);

module.exports = Administrator;