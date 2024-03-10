const express = require('express');

const mongoose = require('mongoose');

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

// connecting to database 
mongoose
.connect('mongodb+srv://fiokee_123:FNnSI7bjZLW9TGGX@cluster0.afn6l2s.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    app.listen(5000);
    console.log('database connected');
})
.catch((err)=>{
    console.error('connection failed', err);
});

