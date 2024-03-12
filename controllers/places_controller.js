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


const getPlaceById = async (req, res, next)=>{

    const placeId = req.params.pid;
    
    let place;

    try{

        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError('Something went wrong,could not find a place', 500);
        return next(error);
    }

    //handling places error
    if(!place){
       return next( new HttpError ('Could not find a place for the provided id!', 404));
    }
    res.json({place: place.toObject( {getters: true}) });
};
// getting places by the user Id
    const getPlacesByUserId = async (req, res, next)=>{
    const userId = req.params.uid;

    let places;

    try{
         places = await Place.find({creator:userId });
    }catch(err){
    const error = new HttpError('fetching places failed, try again later', 500);
    return next(error);
    }

//handling error

    if(!places || places.length === 0){
        return next( new HttpError('Could not find a place for the user with provided id!', 404));
    }
    res.json({places : places.map(place => place.toObject( {getters: true}))});
};

//creating  place route or post
const createPlace = async (req, res, next)=>{
 const errors =  validationResult(req);
 
 if(!errors.isEmpty()){ //checking to validate if the input field is  empty
    console.log(errors.array());
    return next(new HttpError('Invalid input passed, please check your data', 422));
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
try{

    await createdPlace.save();
}catch(err){
    const error = new HttpError('creating place failed try again', 500);
    return next(error);
}
res.status(201).json({place: createdPlace});
// console.log(createdPlace);
}

//update a place by user id
const updatePlace = async (req, res, next)=>{
    const errors = validationResult(req);

//checking to validate if the input field is empty
    if(!errors.isEmpty()){
        throw new HttpError('could not update input, invalid data, please check your data', 422);
    }
    
    const {title, description} = req.body
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('something went wrong could not update', 500);
        return next(error);
    }
    
    place.title = title;
    place.description = description;

    try {
       await place.save(); // saving the updated place object
    }catch(err){
        const error = new HttpError('something went wrong could not update place', 500)
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters: true}) });
}


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
