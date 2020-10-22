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
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'Intel',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
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
