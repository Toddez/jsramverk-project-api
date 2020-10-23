/* global it describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.should();

chai.use(chaiHttp);

const { Database, db } = require('../db/database.js');

let client;

describe('stocks', () => {
    describe('GET /stocks', () => {
        it('should get list of stocks', (done) => {
            chai.request(server)
                .get('/stocks')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('stocks');
                    res.body.stocks.should.be.a('array');
                    res.body.stocks.length.should.be.eql(10);

                    done();
                });
        });
    });

    describe('GET /stocks/:id', () => {
        it('should get a stock with id', (done) => {
            const stocks = Database.client().db(db).collection('stocks');
            stocks.findOne({}, (err, stock) => {
                if (err) {
                    throw new Error('Could not get a stock to assert');
                }

                chai.request(server)
                    .get(`/stocks/${stock._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('id');
                        res.body.id.should.be.a('string');
                        res.body.should.have.a.property('name');
                        res.body.name.should.be.a('string');
                        res.body.should.have.a.property('value');
                        res.body.value.should.be.a('array');
                        res.body.should.have.a.property('current');
                        res.body.current.should.be.a('object');

                        client.close();
                        done();
                    });
            });
        });
    });
});

(async () => {
    client = await Database.temporaryClient();
    Database.use(client);
})();
