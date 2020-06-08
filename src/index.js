const express = require('express');
const cors = require('cors');
//connect to db
require('./db/mongoose');

//the routes for all the functions that the API does
const userRouter = require('./Routers/UserRouters');
const movieRouter = require('./Routers/MovieRouters');
const adminRouter = require('./Routers/AdminRouter');

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(movieRouter);
app.use(adminRouter);

//listen at the port specified
app.listen(port, function(){
    console.log('Server is up and running at port '+ port)
});