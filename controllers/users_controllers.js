    const {v4: uuidv4}= require('uuid');

    const User = require('../models/user');

    const {validationResult} = require('express-validator');
    const HttpError = require('../models/http_error');

    

    const getUsers = async(req, res, next)=>{
        let users;
        try{

            users = await User.find({}, '-password'); //exempting the password
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
    }
    const createdUser = new User({
        name,
        email,
        image: 'https://rb.gy/83k3w',
        password,
        places: []
    });
    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError('Signing Up user failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({user: createdUser.toObject({getters: true})});
    };

    const login = async (req, res, next)=>{
        const {email, password} = req.body;

        //checking to identify if the users credentials is correct before login
        let existingUser;
        try{
            existingUser = await User.findOne({email: email})

        }catch(err){
            const error = new HttpError('login up failed please try again', 500);
            return next(error);
        }
    //checking to see whether the eamil or password exist in db
    if(!existingUser || existingUser.password !== password){
    const error = new HttpError('invalid credentials, could not login user', 401);
    return next(error);
    }
        res.json({message: 'Login successful', user: existingUser.toObject({getters: true})});
    };

    exports.getUsers = getUsers;
    exports.signup = signup;
    exports.login = login;