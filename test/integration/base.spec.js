var should = require('chai').should();
var request = require('supertest');
var app = require('../../server');
var agent = request.agent(app);

// export NODE_ENV=test

describe('User Register', function () {


    var user;
    user = {
        "firstName": "Matthew",
        "lastName": "Shirtliffe",
        "email": "test@test.com",
        "phone": "07700900087",
        "password": "password101",
        "hasAcceptedTerms": true
    };

    describe('Hello World!', function (done) {

        it('should return 200', function (done) {

            agent.get('/api').send(user).end(function (err, result) {
                result.statusCode.should.equal(200);
                result.text.should.equal('Hello World!');
                done();
            });
        });

    });

});