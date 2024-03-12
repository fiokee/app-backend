const express = require('express');

const {check} = require('express-validator'); //this for validating input data 

const placesControllers = require('../controllers/places_controller');

const router = express.Router();


router.get('/:pid', placesControllers.getPlaceById );

router.get('/user/:uid', placesControllers.getPlacesByUserId);

// validating and emtyp input field
router.post('/',
[ 
    check('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('must not be empty'),
    check('description')
    .trim()
    .isLength({min: 10})
    .withMessage('Description must be at least 10 characters long'),
    check('address').trim().not().isEmpty()

], placesControllers.createPlace);

// validating and emtyp input field
router.patch('/:pid',
[
check('title')
.trim()
.not().isEmpty()
.withMessage('must not be empty'),
check('description').trim().isLength({min: 10}).withMessage('not be empty'),
], placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);


module.exports = router;