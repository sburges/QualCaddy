/**
 * Created by shayneburgess on 1/6/16.
 */
var qualcaddy = angular.module("qualcaddy", []);

qualcaddy.controller("AppCtrl", function ($http) {
    var app = this;
    var url ="http://localhost:3000";

    app.saveQualification = function (newQualification) {
        $http.post(url + "/qualification/add", {
            name: newQualification.name,
            income: newQualification.income,
            debt: newQualification.debt
        }).success(function () {
            loadQualifications();
        })
    }

    function loadQualifications() {
        $http.get(url + "/qualification").success(function(qualifications) {
            app.qualifications = qualifications;
        })
    }

    loadQualifications();


})