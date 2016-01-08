/**
 * Created by shayneburgess on 1/6/16.
 */
var qualcaddy = angular.module("qualcaddy", []);

qualcaddy.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "https://qualcaddy.herokuapp.com/";
    //var url = "http://localhost:3000/"
    var currentApplication = null;

    app.saveApplication = function () {
        $http.post(url + "applications", {
            name: app.currentApplication.name,
            income: app.currentApplication.income,
            debt: app.currentApplication.debt
        }).success(function () {
            loadApplications();
        })
    }

    app.deleteApplication = function(){
        $http.delete(url + "applications/" + app.currentApplication._id,
            app.currentApplication
        ).success(function (res){
            loadApplications();
        })
    }

    app.updateApplication = function(){
        $http.post(url + "applications/" + app.currentApplication._id,
            app.currentApplication
        ).success(function (res){
            loadApplications();
        })
    }

    app.verify = function(){
        if(app.currentApplication != null) {
            $http.post(url + "verify", {
                name: app.currentApplication.name,
                income: app.currentApplication.income,
                debt: app.currentApplication.debt
            }).success(function (res) {
                app.applicationResult = res;
            })
        }
    }

    function loadApplications() {
        $http.get(url + "applications").success(function(applications) {
            app.applications = applications;
            app.currentApplication = app.applications[0];
            app.verify();
        })
    }

    loadApplications();
})