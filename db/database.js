const mongodb = require('mongodb');

const url = 'mongodb://localhost:27017';

class Database {
    static connect() {
        mongodb.MongoClient.connect(
            url,
            {
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err)
                    return;

                console.log('Connected to mongodb', url);
                Database.mongoClient = client;
            }
        );

        return Database;
    }

    static client() {
        if (!Database.mongoClient)
            return;

        return Database.mongoClient;
    }
}

module.exports = Database;
