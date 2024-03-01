const express = require('express');

const {validationResult, check} = require('express-validator');

const usersControllers = require('../controllers/users_controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/signup',
[
    check('name')
    .not()
    .isEmpty(),

    check('email')
    .not()
    .isEmpty(), 
    check('password')
    .not()
    .isLength({min:5})
], usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;