const express = require('express');
const router = express.Router();

const { Database, db } = require('../db/database.js');
const ObjectId = require('mongodb').ObjectID;

router.get('/', (req, res, next) => {
    const collection = Database.client().db(db).collection('stocks');

    collection.find().toArray((err, stocks) => {
        if (err) {
            return next(new Error('Databas fel'));
        }

        let data = stocks.map((stock) => {
            return {
                id: stock._id,
                name: stock.name,
                current: stock.value[stock.value.length - 1]
            };
        });

        data = data.sort((a, b) => a.current > b.current);

        res.status(200).json({ stocks: data });
    });
});

router.get('/:id', (req, res, next) => {
    const collection = Database.client().db(db).collection('stocks');

    collection.findOne({ _id: new ObjectId(req.params.id) }, (err, stock) => {
        if (err) {
            return next(new Error('Databas fel'));
        }

        let data = {
            id: stock._id,
            name: stock.name,
            value: stock.value,
            current: stock.value[stock.value.length -1]
        };

        res.status(200).json(data);
    });
});

module.exports = router;
