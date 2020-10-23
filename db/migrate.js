const { Database, db } = require('./database.js');

(async () => {
    await Database.connect();

    // DROP Datbase
    Database.client().db(db).dropDatabase();

    const stocks = Database.client().db(db).collection('stocks');
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
