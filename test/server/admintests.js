/**
 * Created by shayne on 1/11/16.
 */

var chai = require('chai');
var request = require('request');

var expect = chai.expect;

var fakebank = {
    bankName: "FakeBank",
    debtToIncomeRatio: 1
};

var fakeBankid = 0;
var newBankName = "FankBankNameChanged";

var expect = chai.expect;

describe('ADMIN API', function() {
    this.timeout(3000);
    var baseUrl = 'http://localhost:3000';

    it('should POST an application', function (done) {
        request.post({
            url: baseUrl + '/admin/banks',
            json: fakebank
        }, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should GET all banks', function (done) {
        request.get({
            url: baseUrl + '/banks',
            json: true
        }, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(Array.isArray(body)).to.be.true;
            expect(body[0]).to.have.property('bankName');
            for(var i=0; i<body.length; i++)
                if(body[i].bankName == fakebank.bankName)
                    fankBankid = body[i]._id;
            done();
        });
    });

    it('should GET a bank', function (done) {
        request.get({url:baseUrl + '/admin/banks/' + fankBankid, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.have.property("bankName");
            expect(body.bankName).to.eql(fakebank.bankName);
            expect(body._id).to.eql(fankBankid);
            done();
        });
    });

    it('should update a bank', function (done) {
        fakebank.bankName = newBankName;
        request.post({url:baseUrl + '/admin/banks/' + fankBankid, json:fakebank}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should GET updated bank', function (done) {
        request.get({url:baseUrl + '/admin/banks/' + fankBankid, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.have.property('bankName');
            expect(body.bankName).to.eql(newBankName);
            expect(body._id).to.eql(fankBankid);
            done();
        });
    });

    it('should DELETE the test bank', function (done) {
        request.del({url:baseUrl + '/admin/banks/' + fankBankid, json:true}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});