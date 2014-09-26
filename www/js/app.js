// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.constant', 'app.services'])

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

            .state('app.tabs', {
                url: "/tabs",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'TabsController'
            })

            //首页
            .state('app.tabs.home', {
                url: "/home",
                views: {
                    'indexContent': {
                        templateUrl: "templates/home.html",
                        controller : 'HomeController'
                    }
                }
            })
            //活动
            .state('app.tabs.events', {
                url: "/events",
                views: {
                    'eventsContent': {
                        templateUrl: "templates/events.html",
                        controller: 'EventsCtrl'
                    }
                }
            })
            //活动详情
            .state('app.tabs.edetail', {
                url: "/events/:eventsid",
                views: {
                    'eventsContent': {
                        templateUrl: "templates/events_detail.html",
                        controller: 'EventsDetailCtrl'
                    }
                }
            })

            //服务 - 创业服务
            .state('app.tabs.services', {
                url: "/services",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/services.html",
                        controller: 'ServicesCtrl'
                    }
                }
            })
            //服务 - 创业服务 - 创业详情页
            .state('app.tabs.sdetail', {
                url: "/services/:servicesId",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/services_detail.html",
                        controller: 'ServicesDetailCtrl'
                    }
                }
            })

            //服务 - 职业机会 - 职业列表页
            .state('app.tabs.jobs', {
                url: "/jobs",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/jobs.html",
                        controller: 'JobsCtrl'
                    }
                }
            })

            //服务 - 职业机会 - 职业详情页
            .state('app.tabs.jdetail', {
                url: "/jobs/:jobsId",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/jobs_detail.html",
                        controller: 'JobsDetailCtrl'
                    }
                }
            })

            //服务 - 职业机会 - 公司详情
            .state('app.tabs.company', {
                url: "/company/:companyId",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/company.html",
                        controller: 'CompanyCtrl'
                    }
                }
            })

            //vip
            .state('app.tabs.vip', {
                url: "/vip",
                views: {
                    'moreContent': {
                        templateUrl: "templates/vip.html",
                        controller: 'DetailCtrl'
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
        // 当没有被匹配时 跳转到app/home
        $urlRouterProvider.otherwise('/app/tabs/events');
    });

