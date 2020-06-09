const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

    tmdb_id:{
        type: Number,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required:true,
        trim: true,
    },
    category:{
        type:String,
        required: true
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
    videos: [{
        videoKey:{
            type: String
        },
        videoType:{
            type: String
        }
    }],
    genres_array:[{
        genre:{
            type: String
        },
        genre_id:{
            type:  Number
        }
    }],
    director:{
        type: String
    },
    backdrops: [{
        backdropPath:{
            type: String
        },
        height:{
            type: Number
        },
        width:{
            type: Number
        }
    }],
    posters:[{
        posterPath:{
            type: String
        },
        height:{
            type: Number
        },
        width:{
            type: Number
        }
    }],
    actors:[{
        actor:{
            type: String
        },
        actor_poster:{
            type: String
        },
        actor_gender:{
            type: Number
        },
        actor_character:{
            type: String
        },
        actor_id:{
            type: Number
        }
    }],
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    url:{
        type: String,
        required:true,
        trim: true
    },
    recommendation: [{
        movie_name:{
            type: String
        },
        movie_poster:{
            type: String
        }
    }],
    industry:{
        type: String,
        required: true
    }
},{
    timestamps : true
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;