    const {v4: uuidv4}= require('uuid');

    const HttpError = require('../models/http_error');

    const DUMMY_USERS = [
        {
            id: 'u1',
            name: 'Sam Skales',
            email: 'sample@gamil.com',
            password: 'testers'
        }
    ];

    const getUsers = ((req, res, next)=>{
        res.json({users: DUMMY_USERS});
    });

    //creating a new user
    const signup = ((req, res, next)=>{
    const {name, email, password} = req.body;

    //verified if user already exist 
    const hasUser = DUMMY_USERS.find( u => u.email === email);
    if(hasUser){
        throw new HttpError('could not create user, email already exist', 422);
    }
    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
    });

    const login = ((req, res, next)=>{
        const {email, password} = req.body;

        //checking to identify if the users credentials is correct before login
        const identifiedUser = DUMMY_USERS.find(u => u.email === email);
        if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('could not identify user, credentials seems to be wrong', 401);
        
        }
        res.json({message: 'Login successful'});
    });

    exports.getUsers = getUsers;
    exports.signup = signup;
    exports.login = login;