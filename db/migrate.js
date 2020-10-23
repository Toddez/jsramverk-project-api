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
        },
        {
            name: 'Nvidia',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'MSI',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'NZXT',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'Corsair',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'EVGA',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'ASUS',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'ASROCK',
            value: [
                { date: '2020-10-22T11:22:04.281Z', value: 100 }
            ]
        },
        {
            name: 'Dell',
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
