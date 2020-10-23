const express = require('express');
const router = express.Router();

const db = require('../db/database.js');
const ObjectId = require('mongodb').ObjectID;

router.get('/inventory', (req, res, next) => {
    const users = db.client().db('project').collection('users');
    const stocksCollection = db.client().db('project').collection('stocks');

    users.findOne({email: req.user.email}, (err, user) => {
        if (err) {
            return next(new Error('Databas fel'));
        }

        stocksCollection.find({}).toArray((err, stocks) => {
            if (err) {
                console.log(err);
                return next(new Error('Databas fel'));
            }

            let inventoryData = [];

            for (const id in user.inventory) {
                if (user.inventory[id]) {
                    const item = user.inventory[id];

                    const stock = stocks.find((value) => {
                        return value._id == id;
                    });

                    inventoryData.push({
                        id: id,
                        amount: item.amount,
                        name: stock.name,
                        value: stock.value[stock.value.length -1].value
                    });
                }
            }

            const data = {
                balance: user.balance || 0,
                inventory: inventoryData || {}
            };

            res.status(200).json(data);
        });
    });
});

router.post('/buy', (req, res, next) => {
    const users = db.client().db('project').collection('users');
    const stocks = db.client().db('project').collection('stocks');

    if (req.body.amount <= 0 || !Number.isInteger(parseFloat(req.body.amount))) {
        return next(new Error('Mängd måste vara ett positivt heltal'));
    }

    users.findOne({email: req.user.email}, (err, user) => {
        if (err) {
            return next(new Error('Databas fel'));
        }

        stocks.findOne({_id: ObjectId(req.body.id)}, (err, stock) => {
            if (err) {
                return next(new Error('Databas fel'));
            }

            const stockValue = stock.value[stock.value.length - 1].value;

            if (stockValue * req.body.amount > user.balance) {
                return next(new Error('Inte tillräckligt med pengar på konto'));
            }

            let currentAmount = 0;
            if (user.inventory[ObjectId(req.body.id)]) {
                currentAmount = user.inventory[ObjectId(req.body.id)].amount;
            }

            const newBalance = user.balance - stockValue * req.body.amount;

            users.updateOne({email: req.user.email}, {
                $set: {
                    balance: newBalance,
                    inventory: {
                        ...user.inventory,
                        [ObjectId(req.body.id)]: {
                            amount: currentAmount + parseInt(req.body.amount)
                        }
                    }
                }
            }, (err) => {
                if (err) {
                    return next(new Error('Databas fel'));
                }

                res.status(201).json({
                    balance: newBalance,
                    amount: currentAmount + parseInt(req.body.amount),
                    message: 'Successfully bought stocks'
                });
            });
        });

    });
});

router.post('/sell', (req, res, next) => {
    const users = db.client().db('project').collection('users');
    const stocks = db.client().db('project').collection('stocks');

    if (req.body.amount <= 0 || !Number.isInteger(parseFloat(req.body.amount))) {
        return next(new Error('Mängd måste vara ett positivt heltal'));
    }

    users.findOne({email: req.user.email}, (err, user) => {
        if (err) {
            return next(new Error('Databas fel'));
        }

        stocks.findOne({_id: ObjectId(req.body.id)}, (err, stock) => {
            if (err) {
                return next(new Error('Databas fel'));
            }

            const stockValue = stock.value[stock.value.length - 1].value;

            let currentAmount = 0;
            if (user.inventory[ObjectId(req.body.id)]) {
                currentAmount = user.inventory[ObjectId(req.body.id)].amount;
            }

            if (currentAmount < req.body.amount ) {
                return next(new Error('Inte tillräckligt med andelar'));
            }

            const newBalance = user.balance + stockValue * req.body.amount;

            users.updateOne({email: req.user.email}, {
                $set: {
                    balance: newBalance,
                    inventory: {
                        ...user.inventory,
                        [ObjectId(req.body.id)]: {
                            amount: currentAmount - parseInt(req.body.amount)
                        }
                    }
                }
            }, (err) => {
                if (err) {
                    return next(new Error('Databas fel'));
                }

                res.status(201).json({
                    balance: newBalance,
                    amount: currentAmount - parseInt(req.body.amount),
                    message: 'Successfully sold stocks'
                });
            });
        });

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
                return next(new Error('Databas fel'));
            }

            const user = result.value;

            res.status(201).json({
                balance: user.balance + increment
            });
        });
});

module.exports = router;
