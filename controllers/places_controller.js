const {v4: uuidv4}= require('uuid');

const HttpError = require('../models/http_error');

const {validationResult} = require('express-validator');
const  mongoose  = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user'); 



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

    // if(!places || places.length === 0){
    //     return next( new HttpError('Could not find a place for the user with provided id!', 404));
    // }
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
    address,
    location: coordinates,
    image: req.file.path,
    creator
});

//check to see if the user Id exist in other to create a place
let user;
try{
    user = await User.findById(creator);
}catch(err){
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
};

// check to see if user not exist in db
if(!user){
    const error = new HttpError('could not find user for provided id', 404);
    return next(error);
};

try{
    const sess = await mongoose.startSession(); //we are checking create automatic uid
    sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace); //making sure the place id is added to user
    await user.save({session: sess}) //updating the user
    await sess.commitTransaction() //making it save in the db
}catch(err){
    console.log(err)
    const error = new HttpError('creating place failed try again', 500);
    return next(error);
}
res.status(201).json({place: createdPlace});
}

//update a place by user id
const updatePlace = async (req, res, next)=>{
    const errors = validationResult(req);

//checking to validate if the input field is empty
    if(!errors.isEmpty()){
        return next(new HttpError('could not update input, invalid data, please check your data', 422));
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
};

//deleting a place by user id

const deletePlace = async (req, res, next)=>{
    const placeId = req.params.pid;
    //check to see if there is a place to delete with such id
    let place;
    try{
        place = await Place.findById(placeId).populate('creator')//populate allows to refer to data stored in anothher collection;
    }catch(err){
        const error = new HttpError('could not delete a place something went wrong', 500);
        return next(error);
    }

    //check to see if a place id exist
    if(!place){
        return next(new HttpError('could not find a place with such id', 404)); 
    }
    //deleting from database
    try{
        const sess = await mongoose.startSession(); //we are checking create automatic uid
        sess.startTransaction();
        await place.deleteOne({session: sess});// removing a place from the place collection
        place.creator.places.pull(place);//this removes the id
        await place.creator.save({session: sess});//saving our newly created user
        await sess.commitTransaction();
    }catch(err){
        
        const error = new HttpError('could not delete a place something went wrong', 500);
        return next(error);
    }
    res.status(200).json({message: 'place deleted'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
