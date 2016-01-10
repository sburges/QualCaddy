/**
 * Created by shayneburgess on 1/9/16.
 */
'use strict';

var chai = require('chai');
var request = require('request');

var fakeapplication = {
    name: "FakeUser",
    bank: 0,
    income: 100,
    debt: 100
};

var fakeUserid = 0;

var expect = chai.expect;

describe('Testing testing', function(){
    it('should pass a simple test: true = true', function() {
        expect(true).to.equal(true);
    });
});

describe('REST API', function() {
    this.timeout(3000);
    var baseUrl = 'http://localhost:3000';

    it('should get 200 on connect', function (done) {
        request.get(baseUrl, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

 /*   it('should have a home page', function (done) {
        request.get(baseUrl + 'index.html', function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });*/

    it('should POST an application', function (done) {
        request.post({url:baseUrl + '/applications', json:fakeapplication}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should GET an application', function (done) {
        request.get({url:baseUrl + '/applications', json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(Array.isArray(body)).to.be.true;
            expect(body[0]).to.have.property('name');
            for(var i=0;i<body.length;i++)
            {
                if(body[i].name == fakeapplication.name)
                {
                    fakeUserid = body[0]._id;
                    break;
                }
            }
            done();
        });
    });

    it('should DELETE the test application', function (done) {
        request.del({url:baseUrl + '/applications/' + fakeUserid, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});