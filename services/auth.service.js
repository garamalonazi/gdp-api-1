// TODO: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.
const User = require('../models/user.model');
const tokenDatabase = require('../databases/tokens');
const userDB = require('../databases/users');
//const userServices = require('./users.service');

const crypto = require('crypto');

class AuthService {
    db;
    userDB;

    constructor(db , userDB) {
        this.db = db;
        this.userDB = userDB;
    }

findAndGenerateToken(email, password) {
    const  user = this.userDB.find(user => user.email === email);

    if (!user || password != user.password) {
        throw new Error('Error! Something went wrong');
    }

    var token = crypto.randomBytes(64).toString('base64');
   
    this.db.push([token, user.id]);

    return [token, user.id];
}

findUserByToken(token){

    
    const userid = this.db.find(userid => userid[0] === token )
    const  user = this.userDB.find(user => user.id === userid[1]);
    if (!user) {
        throw new Error('No user exist ');
    }

    return user ;
}
}

const authService = new AuthService(tokenDatabase , userDB);

module.exports = { authService };