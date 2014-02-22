/* jshint -W030 */
module.exports = (function () {
    'use strict';

    var CONFIG = require('config').Default,
        request = require('supertest'),
        expect = require('chai').expect,
        TESTVALS = require('config').TestVals,
        casual = require('casual'),
        server = require(process.env.HOME + CONFIG.projRoot + '/server/app/server').app,
        endpoint = request(server),
        English = require('yadda').localisation.English,
        Dictionary = require('yadda').Dictionary,
        dictionary = new Dictionary()
            .define('http_method', /([^"]*)/)
            .define('route', /([^"]*)/)
            .define('number', /(\d+)/);

    return English.library(dictionary)

        .given('A thought exists in the database', function (next) {
            next();
        })
        .when('A GET on /thought with "$objectId" is performed', function (objectId, next) {
            endpoint
                .get('/thought/' + objectId)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    var id = JSON.parse(res.body)._id;

                    expect(err).to.not.exist;
                    expect(id).to.equal(TESTVALS.knownObjectId);

                    next();
                });
        })
        .then('A thought is returned', function (next) {
            next();
        })

        .given('A user', function (next) {
            next();
        })
        .when('A POST request on /thought is performed', function (next) {
            endpoint
                .post('/thought')
                .send({
                    title: casual.title,
                    body: casual.text
                })
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(201);
                    next();
                });
        })
        .then('A thought is persisted', function (next) {
            next();
        })
        .then('The ObjectId is returned', function (next) {
            next();
        });

}());