// TODO: Create a route that will do the following:
// 1. Handle a POST request to /auth/login that will take in an email and password as the request body
//      and will return a JSON object with a token property. This token SHOULD be stored in the database.
// 2. Handle a POST request to /auth/profile that will take in a token in the request header with key Authentication.
//      Our clients should send the token in the following format: "Bearer <token>". for example:
//      "Bearer 1234567890". If the token is valid, then return a JSON object with the user's profile.

const express = require('express');
const { authService } = require('../../services/auth.service');
const HttpError = require('../../models/http-error.model');

const router = express.Router();
router.post('/:profile', (req, res, next) => {

    var token = req.get('bearer');
    // const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.json({
            message: 'No token provided'
        })
    }

    const user = authService.findUserByToken(token)
    res.json({
        token: user,
    })
    next();

})

router.post('/', (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'bad Request',
            });
        }


        const token = authService.findAndGenerateToken(email, password);

        res.json({
            token: token[0],
            user_id: token[1]
        });



    } catch (e) {
        throw new HttpError(500, e.message);
    }
})

module.exports = router;