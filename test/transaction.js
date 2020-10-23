/* global it describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.should();

chai.use(chaiHttp);

const { Database, db } = require('../db/database.js');

let client;
let token;
let stockId;

describe('transaction', () => {
    describe('POST /transaction/deposit', () => {
        it('should deposit money for user', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    email: 'transaction@email.com',
                    password: '123'
                })
                .end((err) => {
                    if (err) {
                        throw new Error('Failed to create test user');
                    }

                    chai.request(server)
                        .post('/auth/login')
                        .send({
                            email: 'transaction@email.com',
                            password: '123'
                        })
                        .end((err, loginRes) => {
                            if (err) {
                                throw new Error('Failed to login test user');
                            }

                            token = loginRes.body.data.token;

                            chai.request(server)
                                .post('/transaction/deposit')
                                .set('x-access-token', token)
                                .send({ amount: 1000 })
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    res.body.should.be.a('object');
                                    res.body.should.have.a.property('balance');
                                    res.body.balance.should.be.a('number');
                                    res.body.balance.should.be.eql(1000);

                                    done();
                                });
                        });
                });
        });
    });

    describe('POST /transaction/buy', () => {
        it('should buy stocks for user', (done) => {
            const stocks = Database.client().db(db).collection('stocks');
            stocks.findOne({}, (err, stock) => {
                if (err) {
                    throw new Error('Could not get a stock to assert');
                }

                stockId = stock._id;

                chai.request(server)
                    .post('/transaction/buy')
                    .set('x-access-token', token)
                    .send({ amount: 2, id: stockId })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('balance');
                        res.body.balance.should.be.a('number');
                        res.body.balance.should.be.eql(800);
                        res.body.should.have.a.property('amount');
                        res.body.amount.should.be.a('number');
                        res.body.amount.should.be.eql(2);

                        done();
                    });
            });
        });
    });

    describe('POST /transaction/sell', () => {
        it('should sell stocks for user', (done) => {
            chai.request(server)
                .post('/transaction/sell')
                .set('x-access-token', token)
                .send({ amount: 1, id: stockId })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('balance');
                    res.body.balance.should.be.a('number');
                    res.body.balance.should.be.eql(900);
                    res.body.should.have.a.property('amount');
                    res.body.amount.should.be.a('number');
                    res.body.amount.should.be.eql(1);

                    done();
                });
        });
    });

    describe('GET /transaction/inventory', () => {
        it('should get inventory for user', (done) => {
            chai.request(server)
                .get('/transaction/inventory')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('balance');
                    res.body.balance.should.be.a('number');
                    res.body.balance.should.be.eql(900);
                    res.body.should.have.a.property('inventory');
                    res.body.inventory.should.be.a('array');
                    res.body.inventory.length.should.be.eql(1);
                    res.body.inventory[0].should.have.a.property('id');
                    res.body.inventory[0].id.should.be.a('string');
                    res.body.inventory[0].id.should.be.eql(stockId.toString());
                    res.body.inventory[0].should.have.a.property('amount');
                    res.body.inventory[0].amount.should.be.a('number');
                    res.body.inventory[0].amount.should.be.eql(1);
                    res.body.inventory[0].should.have.a.property('name');
                    res.body.inventory[0].name.should.be.a('string');
                    res.body.inventory[0].should.have.a.property('value');
                    res.body.inventory[0].value.should.be.a('number');
                    res.body.inventory[0].value.should.be.eql(100);

                    done();
                    client.close();
                });
        });
    });
});

(async () => {
    client = await Database.temporaryClient();
    Database.use(client);
})();
