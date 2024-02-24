const express = require('express');

const placesControllers = require('../controllers/places_controller');

const router = express.Router();


router.get('/:pid', placesControllers.getPlaceById );

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/: pid', placesControllers.deletPlace)


module.exports = router;