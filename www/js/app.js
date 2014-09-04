// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.constant', 'starter.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
//路由及模板设置
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            //首页
            .state('app.home', {
                url: "/home",
                views: {
                    'indexContent': {
                        templateUrl: "templates/home.html"
                    }
                }
            })
            //创业项目
            .state('app.working', {
                url: "/working",
                views: {
                    'workingContent': {
                        templateUrl: "templates/working.html"
                    }
                }
            })
            //创业详情页
            .state('app.detail', {
                url: "/working/:workingId",
                views: {
                    'workingContent': {
                        templateUrl: "templates/detail.html",
                        controller: 'DetailCtrl'
                    }
                }
            })

            .state('app.partner', {
                url: "/partner",
                views: {
                    'partnerContent': {
                        templateUrl: "templates/partner.html"
                    }
                }
            })

            .state('app.events', {
                url: "/events",
                views: {
                    'eventsContent': {
                        templateUrl: "templates/events.html"
                    }
                }
            })

//            .state('app.browse', {
//                url: "/browse",
//                views: {
//                    'workingContent': {
//                        templateUrl: "templates/browse.html"
//                    }
//                }
//            })
//            .state('app.playlists', {
//                url: "/playlists",
//                views: {
//                    'partnerContent': {
//                        templateUrl: "templates/playlists.html",
//                        controller: 'PlaylistsCtrl'
//                    }
//                }
//            })
//            .state('app.single', {
//                url: "/playlists/:playlistId",
//                views: {
//                    'menuContent': {
//                        templateUrl: "templates/playlist.html",
//                        controller: 'PlaylistCtrl'
//                    }
//                }
//            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

