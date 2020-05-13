const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required:true,
        trim: true,
    },
    year:{
        type:String
    },
    rating:{
        type: String,
        trim: true
    },
    language:{
        type: String,
        required: true
    },
    genres:{
        type: String,
        required: true
    },
    director:{
        type: String
    },
    imageURLs:[{
        imageurl:{
            type: String
        }
    }],
    actors:{
        type: String,
    },
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    url:{
        type: String,
        required:true,
        trim: true
    }
},{
    timestamps : true
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;