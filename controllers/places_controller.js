const HttpError = require('../models/http_error');

const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(p=>{
        return p.creator === userId;
    });

//handling error

    if(!place){
        return next( new HttpError('Could not find a place for the user with provided id!', 404));
    }
    res.json({place})
}

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
