const express = require('express');

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const HttpError = require('./models/http_error');

const placesRoute = require('./routes/places-routes');

const usersRoute = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images'))); //uploading image statically

//handling cors error
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'https://photo-app-six-kappa.vercel.app'); //handling CORS Error
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //controls all incoming reqest by header
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


// Use cors middleware
// app.use(cors({
//     origin: '*', // Allow all origins. You can also specify specific origins here
//     methods: 'GET, POST, PATCH, DELETE, OPTIONS',
//     allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// }));

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

//error handling for unidentified route
app.use((req, res, next)=>{
const error = new HttpError('could not find the specific route', 404);
throw error;
});

//error handling
app.use((error, req, res, next)=>{
    if(req.file){
        fs.unlink(req.file.path, err=>{
            console.log(err)
        });//errors for file meaning if something goes wrong 
    }
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

