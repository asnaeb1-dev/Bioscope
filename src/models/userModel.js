const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//put this into env vars
const SECRET_KEY = '!!BIOSCOPE_APP!!';
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        validate(val){
            if(typeof val === 'number'){
                throw new Error('You cannot enter name as number!');
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password cannot have password!')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    movieArray:[{
            movie:{
                type: String,
            }
        }
    ],
    genre_choices:[{
        genre:{
            type: String
        }
    }]
})

//when saving the data we will hash the password!
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

userSchema.statics.findUserByCredentials = async function(email, password){
    //STEP 1: find user by email
    const user = await User.findOne({email: email})
    if(!user){
        throw new Error('User not found')
    }
    const isAMatch = await bcrypt.compare(password, user.password)
    if(!isAMatch){
        throw new Error('Incorrect password!')
    }
    return user;
}

userSchema.methods.generateAuthToken = async function(){
    const token = await jwt.sign({_id: this._id.toString()}, SECRET_KEY);
    this.tokens.push({token})
    await this.save();
    return token;
}

userSchema.methods.getUserProfile = function(){
    const senderObj = this.toObject();
    delete senderObj.password;
    delete senderObj.tokens;
    
    return senderObj;
}


const User = mongoose.model('User', userSchema);

module.exports = User;