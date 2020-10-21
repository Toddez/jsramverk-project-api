const express = require('express');
const router = express.Router();

const db = require('../db/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltrounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'No-secret';

const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) {
            let err = new Error('Invalid token');
            err.status = 403;
            return next(err);
        }

        req.user = payload;

        next();
    });
};

// All routes requiring valid jwt
router.use('/transaction', checkToken);

router.post('/auth/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        let err = new Error('No email');
        err.status = 401;
        return next(err);
    }

    if (!password) {
        let err = new Error('No password');
        err.status = 401;
        return next(err);
    }

    const collection = db.client().db('project').collection('users');

    collection.findOne({ email: email }, (err, user) => {
        if (err)
            return next(new Error('Database error'));

        if (!user) {
            let err = new Error('User not found');
            err.status = 401;
            return next(err);
        }

        bcrypt.compare(password, user.password, (_, result) => {
            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.status(200).json({
                    data: {
                        message: 'Logged in!',
                        email: user.email,
                        token: jwtToken
                    }
                });
            }

            let err = new Error('Wrong password');
            err.status = 401;
            return next(err);
        });
    });
});

router.post('/auth/register', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        let err = new Error('No email');
        err.status = 401;
        return next(err);
    }

    if (!password) {
        let err = new Error('No password');
        err.status = 401;
        return next(err);
    }

    const collection = db.client().db('project').collection('users');

    bcrypt.hash(password, saltrounds, (_, hash) => {
        collection.insertOne({
            email: email,
            password: hash,
            balance: 0,
            inventory: []
        }, (err) => {
            if (err)
                return next(new Error('Email is already taken'));

            res.status(201).json({
                data: {
                    message: 'User registered'
                }
            });
        });
    });
});

module.exports = router;
