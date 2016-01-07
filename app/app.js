/**
 * Created by shayneburgess on 1/6/16.
 */
var qualcaddy = angular.module("qualcaddy", []);

qualcaddy.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "https://qualcaddy.herokuapp.com/";
    //var url = "http://localhost:3000/"

    app.saveApplication = function (newApplication) {
        $http.post(url + "applications/add", {
            name: newApplication.name,
            income: newApplication.income,
            debt: newApplication.debt
        }).success(function () {
            loadApplications();
        })
    }

    app.verify = function(newApplication){
        $http.post(url + "verify", {
            name: newApplication.name,
            income: newApplication.income,
            debt: newApplication.debt
        }).success(function(){

        })
    }

    function loadApplications() {
        $http.get(url + "applications").success(function(applications) {
            app.applications = applications;
        })
    }

    loadApplications();
})