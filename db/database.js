const mongodb = require('mongodb');

const url = 'mongodb://localhost:27017';

class Database {
    static async connect() {
        await new Promise(resolve => {
            mongodb.MongoClient.connect(
                url,
                {
                    useUnifiedTopology: true
                },
                (err, client) => {
                    if (err)
                        return;

                    Database.mongoClient = client;
                    resolve();
                }
            );
        });

        return Database;
    }

    static client() {
        if (!Database.mongoClient)
            throw new Error('Database not running');

        return Database.mongoClient;
    }
}

module.exports = Database;
