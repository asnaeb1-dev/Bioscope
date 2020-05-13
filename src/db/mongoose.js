const mongoose = require('mongoose');
const url = process.env.CONN_URL;

mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify: true
})