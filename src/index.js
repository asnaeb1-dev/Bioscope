const express = require('express');
const hbs = require('hbs')
const path = require('path');
const cors = require('cors');
//connect to db
require('./db/mongoose');

const userRouter = require('./Routers/UserRouters');
const movieRouter = require('./Routers/MovieRouters');
const adminRouter = require('./Routers/AdminRouter');

const app = express();

const port = process.env.PORT||3000;

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(movieRouter);
app.use(adminRouter);

app.listen(port, function(){
    console.log('Server is up and running at port '+ port)
});