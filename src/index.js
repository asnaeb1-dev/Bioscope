const express = require('express');
const path = require('path');
//connect to db
require('./db/mongoose');
const User = require('./models/userModel');

const userRouter = require('./Routers/UserRouters');
const movieRouter = require('./Routers/MovieRouters');
const adminRouter = require('./Routers/AdminRouter');

const app = express();

const port = process.env.PORT||3000;

app.use(express.json());

app.use(userRouter);
app.use(movieRouter);
app.use(adminRouter);

app.listen(port, function(){
    console.log('Server is up and running at port '+ port)
});
