/* global it describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.should();

chai.use(chaiHttp);

const { Database } = require('../db/database.js');

let client;

describe('auth', () => {
    describe('POST /auth/register', () => {
        it('should register user', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({ email: 'test@email.com', password: '123' })
                .end((err, res) => {
                    res.should.have.status(201);

                    done();
                });
        });

        it('should not register duplicate user', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({ email: 'test@email.com', password: '123' })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.length.should.be.eql(1);
                    res.body.errors[0].should.be.a('object');
                    res.body.errors[0].should.have.property('message').eql('Email är redan tagen');

                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should login user with correct details', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({ email: 'test@email.com', password: '123' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token');

                    done();
                });
        });

        it('should not login user with incorrect details', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({ email: 'test@email.com', password: '456' })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.length.should.be.eql(1);
                    res.body.errors[0].should.be.a('object');
                    res.body.errors[0].should.have.property('message').eql('Fel lösenord');

                    client.close();
                    done();
                });
        });
    });
});

(async () => {
    client = await Database.temporaryClient();
    Database.use(client);
})();
