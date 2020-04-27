const express = require('express');
const hbs = require('hbs')
const path = require('path');
//connect to db
require('./db/mongoose');
const User = require('./models/userModel');

const userRouter = require('./Routers/UserRouters');
const movieRouter = require('./Routers/MovieRouters');
const adminRouter = require('./Routers/AdminRouter');

const app = express();

const port = process.env.PORT||3000;

const publicDir = path.join(__dirname, './public');
const viewsDir = path.join(__dirname, './templates/views');
const partialsDir =  path.join(__dirname, './templates/partials');

//Setup handlebars views and view engine
app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

//setup static directory to serve
app.use(express.static(publicDir))
//setup js file access
app.use('/js', express.static(__dirname + './../public/js'));
app.use('/css', express.static(__dirname + './../public/css'));
app.use(express.json());

app.use(userRouter);
app.use(movieRouter);
app.use(adminRouter);

app.listen(port, function(){
    console.log('Server is up and running at port '+ port)
});
