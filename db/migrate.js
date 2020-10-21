const db = require('./database.js');

(async () => {
    await db.connect();

    // DROP Datbase
    db.client().db('project').dropDatabase();

    const stocks = db.client().db('project').collection('stocks');
    stocks.insertMany([
        {
            name: 'AMD',
            value: [
                100,
                101,
                100,
                99,
                100,
                101
            ]
        },
        {
            name: 'Intel',
            value: [
                100,
                99,
                98,
                99
            ]
        }
    ], (err) => {
        if (err) {
            new Error('Datbase error');
            process.exit(1);
        }

        process.exit(0);
    });
})();
