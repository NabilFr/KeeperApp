
const passport = require("passport");
const mongoose = require("mongoose");

const User = require("../models/users-model");
const HttpError = require("../models/http-error");

// Create and Save a new User
// This will later become Register new User
// Doesn't add notes to User yet
const registerUser = async (req, res, next) => {
    const { email, password  } = req.body;   
    User.register({ username: email, notes: "NOTES!" }, password, function(err, user){
        if (err) {
            console.log(err);
        } else {
            res.status(201).json({ user: user.toObject({ getters: true }) });
        }
    })

}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ username: email });
    } catch (err) {
        console.log(err);
        return next(err);
    }

    req.logIn(user, function(err){
        res.json({
            message: 'Logged in!',
            user: user.toObject({ getters: true })
          });
        // try {
        //     passport.authenticate("local")(req, res, function(){
        //         res.json({message: "Logged In!"});
        //     });
        // } catch (err) {
        //     console.log(err);
        //     return next(err);
        // }
    });
      
}


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find(foundUsers => {return foundUsers});
    } catch (err) {
        const error = new HttpError(
            'Could not find User',
            500
        );
        return next(error);
    }

    if (!users || users.length === 0) {
        const error = new HttpError(
            'User database empty, Could not find users',
            404
        );
        return next(error);
    }
    res.json({ users });
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;