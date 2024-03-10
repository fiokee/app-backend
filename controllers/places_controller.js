const {v4: uuidv4}= require('uuid');

const HttpError = require('../models/http_error');

const {validationResult} = require('express-validator');
const Place = require('../models/place');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrappers in the world!',
        location:{
            lat: '40.748817',
            lng: '-73.985428'
        },
        address: '20 W 34th St., New York, NY 10001, United States',
        creator: 'u1'
    }
];


const getPlaceById = (req, res, next)=>{

    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p =>{
        return p.id === placeId
    });

    //handling places error
    if(!place){

       throw new HttpError ('Could not find a place for the provided id!', 404);
    }

    res.json({place: place})
};

const getPlacesByUserId = (req, res, next)=>{
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p=>{
        return p.creator === userId;
    });

//handling error

    if(!places || places.length === 0){
        return next( new HttpError('Could not find a place for the user with provided id!', 404));
    }
    res.json({places});
};

//creating  place route or post
const createPlace = (req, res, next)=>{
 const errors =  validationResult(req);
 
 if(!errors.isEmpty()){ //checking to validate if the input field is  empty
    throw new HttpError('Invalid input passed, please check your data', 422);
 }
const {title, description, coordinates, address, creator} = req.body;
//const title = req.body
const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    image: 'https://rb.gy/x23lxk',
    address,
    creator
});

createdPlace.save();

res.status(201).json({place: createdPlace});
// console.log(createdPlace);
}


//update a place by user id
const updatePlace = ((req, res, next)=>{
    const errors = validationResult(req);

//checking to validate if the input field is empty
    if(!errors.isEmpty()){
        throw new HttpError('could not update input, invalid data, please check your data', 422);
    }

    const {title, description} = req.body
    const placeId = req.params.pid;

    const updatePlace = {... DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({place: updatePlace});
})


//deleting a place by user id

const deletePlace = ((req, res, next)=>{
    const placeId = req.params.pid;
    //check to see if there is a place to delete with such id
    if(!DUMMY_PLACES.find(p => p.id === placeId)){ 
        throw new HttpError('could not find a place to delete for the id', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'place deleted'});
})

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
