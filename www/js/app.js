// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers','app.services'])

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
                    'servicesContent': {
                        templateUrl: "templates/events.html",
                        controller: 'EventsCtrl'
                    }
                }
            })
            //活动详情
            .state('app.tabs.edetail', {
                url: "/events/:id",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/events_detail.html",
                        controller: 'EventsDetailCtrl'
                    }
                }
            })

            //我的活动
            .state('app.tabs.eventsmy', {
                url: "/events_my",
                views: {
                    'otherContent': {
                        templateUrl: "templates/events.html",
                        controller: 'EventsMyCtrl'
                    }
                }
            })

            //我的活动 - 新增
            .state('app.tabs.eventsadd', {
                url: "/events_add",
                views: {
                    'otherContent': {
                        templateUrl: "templates/events_form.html",
                        controller: 'EventsAddFormCtrl'
                    }
                }
            })

            //我的活动 - 修改
            .state('app.tabs.eventsedit', {
                url: "/events_edit/:id",
                views: {
                    'otherContent': {
                        templateUrl: "templates/events_form.html",
                        controller: 'EventsEditFormCtrl'
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
                url: "/services/:id",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/services_detail.html",
                        controller: 'ServicesDetailCtrl'
                    }
                }
            })

            //我的服务
            .state('app.tabs.servicesmy', {
                url: "/services_my",
                views: {
                    'otherContent': {
                        templateUrl: "templates/services.html",
                        controller: 'ServicesMyCtrl'
                    }
                }
            })

            //我的服务 - 新增
            .state('app.tabs.servicesadd', {
                url: "/services_add",
                views: {
                    'otherContent': {
                        templateUrl: "templates/services_form.html",
                        controller: 'ServicesAddCtrl'
                    }
                }
            })


            //我的服务 - 修改
            .state('app.tabs.servicesedit', {
                url: "/services_edit/:id",
                views: {
                    'otherContent': {
                        templateUrl: "templates/services_form.html",
                        controller: 'ServicesEditFormCtrl'
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
            .state('app.tabs.jobssearch', {
                url: "/jobs/:city/:salary/:jobs/:experience/:edu/:time",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/jobs.html",
                        controller: 'JobsSearchCtrl'
                    }
                }
            })

            //服务 - 职业机会 - 职业详情页
            .state('app.tabs.jdetail', {
                url: "/jobs/:id",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/jobs_detail.html",
                        controller: 'JobsDetailCtrl'
                    }
                }
            })

            //服务 - 职业机会 - 简历完善
            .state('app.tabs.jobsedit', {
                url: "/jobs_form/:id",
                views: {
                    'servicesContent': {
                        templateUrl: "templates/jobs_form.html",
                        controller: 'JobsFormlCtrl'
                    }
                }
            })


            //服务 - 职业机会 - 公司详情
            .state('app.tabs.company', {
                url: "/company/:id",
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

            //创业项目
            .state('app.tabs.project', {
                url: "/project",
                views: {
                    'moreContent': {
                        templateUrl: "templates/project.html",
                        controller: 'ProjectCtrl'
                    }
                }
            })

            //创业项目 详情
            .state('app.tabs.pdetail', {
                url: "/project/:id",
                views: {
                    'moreContent': {
                        templateUrl: "templates/project_detail.html",
                        controller: 'ProjectDetailCtrl'
                    }
                }
            })
            //创业项目 - 我的
            .state('app.tabs.projectmy', {
                url: "/project_my",
                views: {
                    'otherContent': {
                        templateUrl: "templates/project.html",
                        controller: 'ProjectMyCtrl'
                    }
                }
            })



            //我的服务 - 新增
            .state('app.tabs.projectadd', {
                url: "/project_add",
                views: {
                    'otherContent': {
                        templateUrl: "templates/project_form.html",
                        controller: 'ProjectAddCtrl'
                    }
                }
            })


            //我的服务 - 修改
            .state('app.tabs.projectedit', {
                url: "/project_edit/:id",
                views: {
                    'otherContent': {
                        templateUrl: "templates/project_form.html",
                        controller: 'ProjectEditCtrl'
                    }
                }
            })

            //人才展示
            .state('app.tabs.talent', {
                url: "/talent",
                views: {
                    'moreContent': {
                        templateUrl: "templates/talent.html",
                        controller: 'TalentCtrl'
                    }
                }
            })

            //人才展示 详情
            .state('app.tabs.tdetail', {
                url: "/talent/:id",
                views: {
                    'moreContent': {
                        templateUrl: "templates/talent_detail.html",
                        controller: 'TalentDetailCtrl'
                    }
                }
            })

            //人才展示 详情
            .state('app.tabs.about', {
                url: "/about",
                views: {
                    'moreContent': {
                        templateUrl: "templates/about.html"
                    }
                }
            })

            //注册
            .state('app.register', {
                url : '/register',
                templateUrl : 'templates/register.html',
                controller : 'RegisterCtrl'
            })

            //注册
            .state('app.register_user', {
                url : '/register_user',
                templateUrl : 'templates/register_user.html',
                controller : 'RegisterCtrl'
            })

            //注册
            .state('app.register_company', {
                url : '/register_company/:id',
                templateUrl : 'templates/register_company.html',
                controller : 'RegisterCtrl'
            })

            //我的收藏
            .state('app.tabs.favorites', {
                url : '/favorites',
                views: {
                    'otherContent': {
                        templateUrl : 'templates/favorites.html',
                        controller : 'FavoritesCtrl'
                    }
                }
            })

            //我的简历 - 编辑
            .state('app.tabs.cv', {
                url : '/cv',
                views: {
                    'otherContent': {
                        templateUrl : 'templates/cv.html',
                        controller : 'CvFormCtrl'
                    }
                }
            })

            //我的简历 - 编辑
            .state('app.tabs.cv2', {
                url : '/cv2',
                views: {
                    'otherContent': {
                        templateUrl : 'templates/cv2.html',
                        controller : 'Cv2FormCtrl'
                    }
                }
            })

            //注册
            .state('app.useredit', {
                url : '/useredit/:id',
                templateUrl : 'templates/user_form.html',
                controller : 'UserCtrl'
            })


            ;

        // 当没有被匹配时 跳转到app/home
        $urlRouterProvider.otherwise('/app/tabs/events');
    });

