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
    })
    res.json({place: place})
});

router.get('/user/:uid', (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(p =>{
        return p.creator === userId;
    });
    res.json({place});
})

module.exports = router;