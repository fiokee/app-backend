const express = require('express');

const {check} = require('express-validator'); //this for validating input data 

const placesControllers = require('../controllers/places_controller');

const router = express.Router();


router.get('/:pid', placesControllers.getPlaceById );

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/',
[ 
    check('title')
    .not()
    .isEmpty(),
    check('description').not().isLength({min: 5}),
    check('address').not().isEmpty()

], placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);


module.exports = router;