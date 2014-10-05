angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, restApi, loginData) {
// Create the login modal that we will use later
        //http://ionicframework.com/docs/api/service/$ionicModal/
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.data = {};
        $scope.doLogin = function () {
            console.log('Doing login', $scope.data);
            restApi.CheckLogin.save($scope.data, function (data) {
                if (data.error) {
                    alert(data.message);
                } else {
                    loginData.set(data);
                    $scope.closeLogin();
                }
            });
        };

    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })

    .controller('DetailCtrl', function ($scope, $stateParams,workServer) {
        workServer.getWorkById($stateParams.id).then(function (data) {
            $scope.data = data;
            console.log(data, '123');
        })
    })

    .controller('JobsCtrl', function ($scope, restApi) {
        $scope.data = restApi.Job.query();
        console.log($scope.data);
    })

    .controller('JobsDetailCtrl', function ($scope, $stateParams,restApi) {
        $scope.data = restApi.Job.getOne({id: $stateParams.id});
        console.log($scope.data);
    })

    //events
    .controller('EventsCtrl', function ($scope, restApi, morePop) {
        var start = 0,
            num = 30,
            page = 1;
        morePop.data.value = false;
        $scope.event_title = "活动列表";
        $scope.event_type = 'alllist';
        $scope.noMoreItemsAvailable = false;
        $scope.data = restApi.Events.query({cmd:start,id:num},function(){
            //$scope.noMoreItemsAvailable = true;
        });
        //$scope.searchEvents = function(keyword){
        //    $scope.data = restApi.Events.searchQuery({id:keyword})
        //
        //};
        ////翻页
        //$scope.loadMore = function(){
        //    page++;
        //    start = num * page;
        //    restApi.Events.query({cmd:start,id:num},function(data){
        //        $scope.data.push(data);
        //        $scope.$broadcast('scroll.infiniteScrollComplete');
        //    });
        //};

    })

    .controller('EventsDetailCtrl', function ($scope,$state, $location,$stateParams,$ionicPopup,restApi, morePop, loginData) {
        morePop.data.value = false;
        restApi.Events.getOne($stateParams, function (data) {
            data = data.data;
            $scope.data = data;
            //判断用户是否登录，且是自己创建的活动
            var userId = loginData.getUserId();
            if (userId && data.events_user_id == userId) {
                //可以控制
                $scope.control = true;
            }
        },function(){
            $scope.hideBackButton = true;
            $state.go('app.tabs.events');
        });

        $scope.removeEvents = function(){

            $ionicPopup.confirm({
                title: '提醒',
                template: '该活动删除后无法恢复，确定要删除该活动吗？',
                buttons: [
                    { text: '取消' },
                    {
                        text: '确定删除',
                        type: 'button-assertive',
                        onTap: function(e) {
                            restApi.Events.delete($stateParams,function(){
                                $state.go('app.tabs.eventsmy');
                            });
                        }
                    }]
            });
        }

    })

    .controller('EventsMyCtrl', function ($scope, restApi, loginData) {
        var id = loginData.getUserId() || 1;
        if (id) {
            $scope.event_title = "我的活动";
            $scope.event_type = 'userlist';
            $scope.data = restApi.Events.userQuery({id: id});
        }
    })

    //活动表格 新增
    .controller('EventsAddFormCtrl', function ($scope, restApi, loginData, $stateParams) {
        console.log($stateParams);
    })

    //活动表格 新增
    .controller('EventsEditFormCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup) {
        //var eventsId = $stateParams.id;
        $scope.events_title = '修改活动';
        $scope.events_btn = '修改活动';
        restApi.Events.getOne($stateParams,function(data){
            $scope.data = data.data;
        });

        //提交表单
        $scope.eventsSubmit = function(events_form){
            if (events_form.$valid) {
                restApi.Events.update($scope.data, function (data) {
                    if (data && !data.error) {
                        $ionicPopup.alert({
                            title: '提示!',
                            template: '活动修改成功！'
                        }).then(function (res) {
                            $state.go('app.tabs.eventsmy');
                        });

                    } else {
                        alert(data.message);
                    }
                })
            }
        };

    })


    //services
    .controller('ServicesCtrl', function ($scope, restApi,industryData,cityData) {
        $scope.data = restApi.Services.query();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedIndustry = {id:0,name:'全部领域'};
        //筛选
        $scope.changeIndustry = function(industry){
            $scope.selectedIndustry = industry;
            $scope.data = restApi.ServicesFilter.query(
                {city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name}
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.data = restApi.ServicesFilter.query({city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name});
        };
    })

    .controller('ServicesMyCtrl', function ($scope, restApi,loginData) {
        var id = loginData.getUserId() || 1;
        if (id) {
            $scope.event_title = "我的服务";
            $scope.uselist = true;
            $scope.data = restApi.Services.userQuery({id: id});
        }
    })


    .controller('ServicesDetailCtrl', function ($scope,$state, $stateParams,$ionicPopup, restApi) {
        restApi.Services.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
        },function(){
            //错误则直接退出
            $state.go('app.tabs.services');
        });

        //提交项目
        $scope.submitProject = function(){
            var sid = $stateParams.id;
            //弹出浮层
            var myPopup = $ionicPopup.show({
                templateUrl: "templates/inc.project_list.html",
                title: '请选择你的项目',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '确定',
                        type: 'button-positive',
                        //TODO 待解救 选中问题
                        onTap: function(e) {
                            return 1;
                        }
                    }
                ]
            });
            //确认
            myPopup.then(function(res) {
                restApi.ServicesProject.save({sid:sid,pid:res});
                // An alert dialog
                var alertPopup = $ionicPopup.alert({
                    title: '提示!',
                    template: '项目提交成功！'
                });
                alertPopup.then(function(res) {
                    $state.go('app.tabs.services');
                });

            });
        }
    })

    .controller('IncProjectController', function ($scope, $stateParams,restApi,loginData) {
        var id = loginData.getUserId();
        $scope.data = restApi.Project.userQuery({id: id});

        $scope.change = function(item) {
            console.log("Selected Serverside, text:", item.text, "value:", item.value);
        };
    })



    .controller('CompanyCtrl', function ($scope, $stateParams,restApi) {
        $scope.companyData = restApi.Company.getOne($stateParams);
        $scope.jobsData = restApi.Job.queryByComId($stateParams);
    })

    //创业项目
    .controller('ProjectCtrl', function ($scope, restApi) {
        $scope.data = restApi.Project.query();
        console.log($scope.data);
    })

    .controller('ProjectDetailCtrl', function ($scope, restApi) {
        $scope.data = restApi.Project.getOne({id: 1});
        console.log($scope.data);
    })

    //人才展示
    .controller('TalentCtrl', function ($scope, restApi) {

        $scope.data = restApi.Users.query();
        console.log($scope.data);
    })

    .controller('TalentDetailCtrl', function ($scope, restApi) {
        $scope.data = restApi.Users.getOne({id: 1});
        console.log($scope.data);
    })


    .controller('HomeController', ['$scope', '$state', function ($scope, $state) {
        $scope.navTitle = 'Tab Page';
        console.log(12);
//        $scope.leftButtons = [{
//            type: 'button-icon icon ion-navicon',
//            tap: function(e) {
//                $scope.toggleMenu();
//            }
//        }];
    }])

    .controller('NavController', function ($scope, $ionicSideMenuDelegate, $ionicModal, loginData, restApi) {
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };

        $scope.loginData = loginData.get();

        $scope.logout = function () {
            loginData.reset();
            $scope.loginData = {};
        };


    })


    .controller('TabsController', function ($scope, morePop,$location,$window) {
        //$scope.isShowPop = morePop.isShowPop;
        $scope.data = morePop.data;
        //设置二级菜单位置信息
        var tabWidth = $window.innerWidth/4;
        $scope.sLeft = tabWidth * 2 + (tabWidth/2 - 35) + 'px';
        $scope.mLeft = tabWidth * 3 + (tabWidth/2 - 35) + 'px';

        

        $scope.moreClick = function () {
            morePop.data.mvalue = morePop.data.mvalue === false;
            morePop.data.svalue = false;
        };

        $scope.servicesClick = function(){
            morePop.data.svalue = morePop.data.svalue === false;
            morePop.data.mvalue = false;
        };

        $scope.hideShowPop = function () {
            morePop.data.svalue = false;
            morePop.data.mvalue = false;
        };
        //跳转到家园页面
        $scope.goHome = function () {
            $location.href = 'http://www.baidu.com';
        }
    })

    .controller('RegisterCtrl', function ($scope, $location, restApi, loginData) {
        $scope.data = {};
        //loginData.set({
        //    user_name :'hugo'
        //})
        //注册用户
        $scope.registerUser = function (signup_form) {
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                restApi.Users.save($scope.data, function (data) {
                    if (data && data.error === false) {
                        loginData.set($scope.data);
                        alert(data.message);
                        $location.path('/app/tabs/events');
                    } else {
                        alert(data.message);
                    }

                })
            }
        };

        //关闭注册页面
        $scope.closeReg = function () {
            $location.path('/app/tabs/events');
        }
    });
