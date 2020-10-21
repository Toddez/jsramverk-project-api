const express = require('express');
const router = express.Router();

const db = require('../db/database.js');

router.get('/', (req, res, next) => {
    const collection = db.client().db('project').collection('stocks');

    collection.findMany({}, (err, stocks) => {
        if (err) {
            return next(new Error('Database error'));
        }

        // TODO: Filter result
        res.status(200).json(stocks);
    });
});

module.exports = router;
