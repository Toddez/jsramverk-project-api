const express = require('express');
const router = express.Router();

const db = require('../db/database.js');

router.get('/inventory', (req, res, next) => {
    const collection = db.client().db('project').collection('users');

    collection.findOne({email: req.user.email}, (err, user) => {
        if (err) {
            return next(new Error('Database error'));
        }

        const data = {
            balance: user.balance || 0,
            inventory: user.inventory || []
        };

        res.status(200).json(data);
    });
});

router.post('/deposit', (req, res, next) => {
    const collection = db.client().db('project').collection('users');

    const increment = parseInt(req.body.amount);

    collection.findOneAndUpdate(
        {
            email: req.user.email
        },
        {
            $inc: {
                balance: increment
            }
        },
        {new: true},
        (err, result) => {
            if (err) {
                return next(new Error('Database error'));
            }

            const user = result.value;

            res.status(201).json({
                balance: user.balance + increment
            });
        });
});

module.exports = router;
