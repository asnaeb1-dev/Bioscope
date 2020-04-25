const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/bioscope_api';

mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify: true
})