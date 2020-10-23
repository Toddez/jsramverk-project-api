const mongodb = require('mongodb');

const url = 'mongodb://localhost:27017';

class Client {
    constructor(client) {
        this.client = client;
    }

    close() {
        const client = Database.clients.pop();
        client.client.close();
    }
}

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

    static async temporaryClient() {
        let newClient;
        await new Promise(resolve => {
            mongodb.MongoClient.connect(
                url,
                {
                    useUnifiedTopology: true
                },
                (err, client) => {
                    if (err)
                        return;

                    newClient = client;
                    resolve();
                }
            );
        });

        return new Client(newClient);
    }

    static use(client) {
        Database.clients.push(client);
    }

    static client() {
        if (Database.mongoClient) {
            return Database.mongoClient;
        }

        if (Database.clients.length > 0) {
            return Database.clients[0].client;
        }

        throw new Error('Databasen körs inte');
    }
}

Database.clients = [];

let db = 'project';
if (process.env.NODE_ENV === 'test') {
    db = 'project-test';
}

module.exports = { Database, db };
