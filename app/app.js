/**
 * Created by shayneburgess on 1/6/16.
 */
var qualcaddy = angular.module("qualcaddy", []);

qualcaddy.controller("AppCtrl", function ($http) {
    var app = this;
    //var url = "http://localhost:3000/";
    var url = "https://qualcaddy.herokuapp.com/";

    var currentApplication = null;
    var currentBank = null;

    app.saveApplication = function () {
        app.currentApplication.bank = app.currentBank._id;
        $http.post(url + "applications",
            app.currentApplication
        ).success(function () {
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
        app.currentApplication.bank = app.currentBank._id;
        $http.post(url + "applications/" + app.currentApplication._id,
            app.currentApplication
        ).success(function (res){
            loadApplications();
        })
    }

    app.verify = function(){
        app.currentApplication.bank = app.currentBank._id;
        if(app.currentApplication != null) {
            $http.post(url + "verify/", app.currentApplication)
                .success(function (res) {
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

    function loadBanks(){
        $http.get(url + "banks").success(function(banks) {
            app.banks = banks;
            app.currentBank = app.banks[0];
            loadApplications();
        })
    }

    function loadConfigs(){
        $http.get(url + "config").success(
            function(configs){
                url = configs.url;
            }
        )};

    loadConfigs();
    loadBanks();
})