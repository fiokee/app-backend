const express = require('express');
const fileUpload = require('../middlewares/file-Upload')
const {check} = require('express-validator');

const usersControllers = require('../controllers/users_controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/signup',
fileUpload.single('image'), //for file uploads 
[
    check('name')
    .not()
    .isEmpty(),

    check('email')
    .normalizeEmail() //Test@gmail.com => test@gmail.com
    .isEmail(), //checks wether the email is valid 
    check('password').isLength({min:6})
], usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;