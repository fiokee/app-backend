    const {v4: uuidv4}= require('uuid');

    const User = require('../models/user');
    const bcrypt = require('bcryptjs'); //hasing password
    const jwt = require('jsonwebtoken');

    const {validationResult} = require('express-validator');
    const HttpError = require('../models/http_error');

    

    const getUsers = async(req, res, next)=>{
        let users;
        try{

            users = await User.find({}, '-password'); //exempting the password when getting users
        }catch(err){
            const error = new HttpError('failed getting users, please try again', 500);
            return next(error);
        }
        res.json({users: users.map(user => user.toObject({getters : true}))});
    };

    //creating a new user
    const signup = async(req, res, next)=>{
    //checking to see if the input field is empty
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return next(new HttpError('invalid user input, please check your input data', 422));
    }
    const {name, email, password} = req.body;

    //verified if user already exist 
    let existingUser;
    try{
        existingUser = await User.findOne({email: email})

    }catch(err){
        const error = new HttpError('signing up failed please try again', 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('user exist already login instead', 422);
        return next(error)
    };
// hashing the user password
    let hashedPassword;
    try {
       hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('could not create a user please try again', 500);
        return next(error)
    }
    

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });
    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError('Signing Up user failed, please try again', 500);
        return next(error);
    };
//generating webtoken jwt for users
    let token;
    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, 
            'supersecret_dont_share_2024',
             {expiresIn: '1h'}
            );
    } catch (err) {
        const error = new HttpError('Signing Up user failed, please try again', 500);
        return next(error);
    }
    
    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token }); //data to send back to cleint or frontend
    };

    const login = async (req, res, next)=>{
        const {email, password} = req.body;

        //checking to identify if the users credentials is correct before login
        let existingUser;
        try{
            existingUser = await User.findOne({email: email})

        }catch(err){
            const error = new HttpError('login failed please try again', 500);
            return next(error);
        }
    //checking to see whether the email or password exist in db
    if(!existingUser){
    const error = new HttpError('invalid credentials, could not login user', 401);
    return next(error);
    }

    let isValidPassword = false;
    try {
        
        isValidPassword = await bcrypt.compare(password, existingUser.password) //comparing plan pass with the hash pass in db
    } catch (err) {
        const error = new HttpError(
            'could not login you, please check credentials and try again',
            500
        );
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('invalid credentials, could not login user', 401);
        return next(error);
    }

    //generating webtoken jwt for users
    let token;
    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, 
            'supersecret_dont_share_2024',
             {expiresIn: '1h'}
            );
    } catch (err) {
        const error = new HttpError('login user failed, please try again', 500);
        return next(error);
    }

        res.json({userId: existingUser.id, email: existingUser.email, token: token});
    };

    exports.getUsers = getUsers;
    exports.signup = signup;
    exports.login = login;