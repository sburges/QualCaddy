/**
 * Created by shayneburgess on 1/9/16.
 */
'use strict';

var chai = require('chai');
var request = require('request');
var Application = require('../../models/applications');
var FieldFlags = require('../../models/fieldflags');

var fakeapplication = new Application({
    name: "FakePerson",
    bank: "0",
    debt: 10000,
    incomedetails: { borrowers: [100] }
});

var fakefieldflag = new FieldFlags({
    message: "Bad field"
});

var passingDebtValue = 0;

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

    it('should GET all banks', function (done) {
        request.get({url:baseUrl + '/banks', json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(Array.isArray(body)).to.be.true;
            expect(body[0]).to.have.property('bankName');
            fakeapplication.bank = body[0]._id;
            done();
        });
    });

    it('should POST an application', function (done) {
        request.post({url:baseUrl + '/applications', json:fakeapplication}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should GET all applications', function (done) {
        request.get({url:baseUrl + '/applications', json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(Array.isArray(body)).to.be.true;
            expect(body[0]).to.have.property('name');
            for(var i=0;i<body.length;i++)
            {
                if(body[i].name == fakeapplication.name)
                {
                    fakeapplication._id = body[0]._id;
                    break;
                }
            }
            done();
        });
    });

    it('should GET an application', function (done) {
        request.get({url:baseUrl + '/applications/' + fakeapplication.id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.have.property('name');
            expect(body.name).to.eql('FakePerson');
            expect(body._id).to.eql(fakeapplication.id);
            done();
        });
    });

    it('verify should fail', function (done) {
        request.post({url:baseUrl + '/verify', json:fakeapplication}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body.result).to.eql(false);
            done();
        });
    });

    it('should update an application', function (done) {
        fakeapplication.debt = passingDebtValue;
        request.post({url:baseUrl + '/applications/' + fakeapplication.id, json:fakeapplication}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should GET an updated application', function (done) {
        request.get({url:baseUrl + '/applications/' + fakeapplication.id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.have.property('debt');
            expect(body.debt).to.eql(passingDebtValue);
            done();
        });
    });

    it('verify should pass', function (done) {
        request.post({url:baseUrl + '/verify', json:fakeapplication}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body.result).to.eql(true);
            done();
        });
    });

    it('should DELETE the test application', function (done) {
        request.del({url:baseUrl + '/applications/' + fakeapplication.id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should NOT GET the test application', function (done) {
        request.get({url:baseUrl + '/applications/' + fakeapplication._id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should SAVE field flag', function (done) {
        console.log("ID FROM TEST: " + fakefieldflag._id);
        request.post({url:baseUrl + '/fieldflags', json:fakefieldflag}, function(err,res,body){
            expect(res.statusCode).to.equal(200);
            expect(body.message).to.eql(fakefieldflag.message);
            done();
        });
    });

    it('should GET a field flag', function (done) {
        request.get({url:baseUrl + '/admin/fieldflags/' + fakefieldflag._id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.have.property('message');
            expect(body.message).to.eql(fakefieldflag.message);
            done();
        });
    });

    it('should DELETE the field flag', function (done) {
        request.del({url:baseUrl + '/admin/fieldflags/' + fakefieldflag.id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should NOT GET a field flag', function (done) {
        request.get({url:baseUrl + '/admin/fieldflags/' + fakefieldflag._id, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });
});