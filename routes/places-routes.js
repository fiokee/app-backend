const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next)=>{

    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p =>{
        return p.id === placeId
    });

    //handling places error
    if(!place){
       const error = new Error('Could not find a place for the provided id!');
       error.code = 404;
       throw error;
    }

    res.json({place: place})
});

router.get('/user/:uid', (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(p=>{
        return p.creator === userId;
    });

//handling error

    if(!place){
        const error = new Error('could not find a place for user with provided id!');
        error.code = 404;
        return next(error);
    }
    res.json({place})
})
module.exports = router;