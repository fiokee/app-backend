const express = require('express');

const bodyParser = require('body-parser');
const HttpError = require('./models/http_error');

const placesRoute = require('./routes/places-routes');

const usersRoute = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

//error handling for unidentified route
app.use((req, res, next)=>{
const error = new HttpError('could not find the specific route', 404);
throw error;
});

//error handling
app.use((error, req, res, next)=>{
    if(res.headerSent){
       next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});
});


app.listen(5000);