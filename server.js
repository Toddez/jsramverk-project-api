const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

const port = process.env.HTTP_PORT || 1337;

app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    // Log unless running tests
    app.use(morgan('combined'));

    // Connect to db unless running tests
    require('./db/database.js').Database.connect();
}

// Bodyparser
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended:  true })); // application/x-www-form-urlencoded

// Import routes
const auth = require('./routes/auth');
const transaction = require('./routes/transaction');
const stocks = require('./routes/stocks');

// Use routes
app.use('/', auth);
app.use('/transaction', transaction);
app.use('/stocks', stocks);

// If no route found
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handling
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        errors: [
            {
                status: err.status,
                message: err.message
            }
        ]
    });
});

const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

module.exports = server;
