angular.module('app.controllers', ['imageupload'])

    .controller('AppCtrl', function ($scope, $state,$ionicModal, restApi, loginData) {
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
        /**
         * 判断用户是否登录
         * @param url
         */
        $scope.checkLogin = function(url){
            var userId = loginData.getUserId();
            console.log(userId,loginData);
            $scope.userId = userId;
            if(userId){
                $state.go(url)
            }else{
                $scope.modal.show();
            }
        };

        // Perform the login action when the user submits the login form
        $scope.data = {};
        $scope.doLogin = function () {
            restApi.CheckLogin.save($scope.data, function (ajax) {
                var data = ajax.data;
                if (data.error) {
                    alert(data.message);
                } else {
                    $scope.loginData = data;
                    loginData.set(data);
                    $scope.closeLogin();
                }
            });
        };

    })



    .controller('LoginCtrl', function ($scope) {
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

    .controller('JobsCtrl', function ($scope, restApi,salaryData,cityData,jobsData) {
        $scope.data = restApi.Job.query();
        $scope.salaryData = salaryData;
        $scope.cityData = cityData;
        $scope.jobsData = jobsData;

        //用于第一次赛选的默认值
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedJobs = {id:0,name:'全部岗位'};
        $scope.selectedSalary = {id:0,name:'全部薪酬'};

        //筛选岗位
        $scope.changeJobs = function(jobs){
            $scope.selectedJobs = jobs;
            $scope.data = restApi.JobsFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.data = restApi.JobsFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
        $scope.changeSalary = function(salary){
            $scope.selectedSalary = salary;
            $scope.data = restApi.JobsFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
    })

    .controller('JobsDetailCtrl', function ($scope,$state, $stateParams,restApi,loginData) {
        var userId = loginData.getUserId(),
            join = {uid:userId,jid:$stateParams.id};
        restApi.Job.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            //提交简历
            $scope.submitJob = function(){
                //判断是否登录
                if(userId){
                    restApi.JoinJobs.save(join,function(data){
                        if(data.error){
                            alert(data.error);
                            $state.go('app.tabs.jobsedit')
                        }else{
                            //简历提交成功
                            alert('简历提交成功！');
                        }
                    })
                }else{
                    alert('请登录后再提交简历!');
                    $scope.modal.show();
                }

            }

        },function(){
            //错误则直接退出
            $state.go('app.tabs.jobs');
        });

        if(userId){
            //判断是否已经报名
            restApi.CheckIsJob.query(join,function(data){
                $scope.isjoin = data.data;
                $scope.joinBtnName = '已提交'
            });
        }
    })

    //events
    .controller('EventsCtrl', function ($scope, restApi, morePop) {
        var start = 0,
            num = 30,
            page = 1;
        morePop.pop.value = false;
        $scope.event_title = "活动列表";
        $scope.event_type = 'alllist';
        $scope.noMoreItemsAvailable = false;
        $scope.data = restApi.Events.query({cmd:start,id:num},function(){
            //$scope.noMoreItemsAvailable = true;
        });
        $scope.searchEvents = function(keyword){
            $scope.data = restApi.Events.searchQuery({id:keyword})

        };
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
        var userId = loginData.getUserId(),
            join = {uid:userId,eid:$stateParams.id};
        morePop.pop.value = false;

        restApi.Events.getOne($stateParams, function (data) {
            data = data.data;
            $scope.data = data;
            //判断用户是否登录，且是自己创建的活动
            if (userId && data.events_user_id == userId) {
                //可以控制
                $scope.control = true;
            }
        },function(){
            $scope.hideBackButton = true;
            $state.go('app.tabs.events');
        });

        /**
         * 删除活动
         */
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
        };


        if(userId){
            //判断是否已经报名
            restApi.CheckIsJoin.query(join,function(data){
                $scope.isjoin = data.data;
                $scope.joinBtnName = '已报名'
            });
            //获取报名列表
            $scope.joinData = restApi.EventsJoin.query($stateParams);
        }
        

        /**
         * 报名
         */
        $scope.joinEvents = function(){
            if(userId){
                restApi.EventsJoin.save(join);
                $ionicPopup.alert({
                    title: '提示',
                    template: '报名成功！'
                });
            }else{
                $scope.modal.show();
            }
        }

    })

    .controller('EventsMyCtrl', function ($scope, restApi, loginData,$ionicModal) {
        var id = loginData.getUserId();
        if (id) {
            $scope.event_title = "我的活动";
            $scope.event_type = 'userlist';
            $scope.data = restApi.Events.userQuery({id: id});
        }else{

        }
    })

    //活动表格 新增
    .controller('EventsAddFormCtrl', function ($scope,$http, restApi, $state, $ionicPopup,cityData,loginData) {
        $scope.data = {};
        $scope.events_title = "发布活动";
        $scope.events_btn = '发布活动';
        cityData.shift();
        $scope.cityData = cityData;
        //提交表单
        $scope.eventsSubmit = function(events_form){
            if (events_form.$valid) {
                //userId 在外层control
                $scope.data.events_user_id = loginData.getUserId();
                restApi.Events.save($scope.data, function (data) {
                    if (data && !data.error) {
                        $ionicPopup.alert({
                            title: '提示!',
                            template: '活动发布成功！'
                        }).then(function (res) {
                            $state.go('app.tabs.eventsmy');
                        });

                    } else {
                        alert(data.message);
                    }
                })
            }
        };


        $scope.upload = function(image) {
            console.log(1243,image);
            restApi.Upload.img(image);
        };
    })

    //活动表格 修改
    .controller('EventsEditFormCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData) {
        cityData.shift();
        console.log($stateParams);
        
        $scope.cityData = cityData;
        $scope.events_title = '修改活动';
        $scope.events_btn = '修改活动';
        restApi.Events.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
        });

        //提交表单
        $scope.eventsSubmit = function(events_form){
            if (events_form.$valid) {
                //删除用户名 因为提交的时候不需要username
                delete  $scope.data.user_name;
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
            $scope.list_title = "我的服务";
            $scope.uselist = true;
            $scope.data = restApi.Services.userQuery({id: id});
        }
    })


    .controller('ServicesDetailCtrl', function ($scope,$state, $stateParams,$ionicPopup, loginData,restApi) {
        var userId = loginData.getUserId();
        restApi.Services.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;

            //判断用户是否登录，且是自己创建的活动
            if (userId && ajax.data.services_user_id == userId) {
                //可以控制
                $scope.control = true;
            }
        },function(){
            //错误则直接退出
            $state.go('app.tabs.services');
        });



        //提交项目
        $scope.submitProject = function(){
            var sid = $stateParams.id;
            if(userId){
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
            }else{
                $scope.modal.show();
            }

        };

        $scope.removeForm = function(){
            console.log('removeForm');

            $ionicPopup.confirm({
                title: '提醒',
                template: '该服务删除后无法恢复，确定要删除该服务吗？',
                buttons: [
                    { text: '取消' },
                    {
                        text: '确定删除',
                        type: 'button-assertive',
                        onTap: function(e) {
                            restApi.Services.delete($stateParams,function(){
                                $state.go('app.tabs.servicesmy');
                            });
                        }
                    }]
            });
        }
    })

    .controller('ServicesAddCtrl', function ($scope, $state, restApi, loginData,industryData,cityData) {
        $scope.data = {};
        industryData.shift();
        cityData.shift();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        //发布创业服务
        $scope.submitForm = function (signup_form) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                $scope.data.services_user_id = loginData.getUserId();
                restApi.Services.save($scope.data, function (data) {
                    if (data && !data.error) {
                        alert('创业服务发布成功！');
                        $state.go('app.tabs.servicesmy');
                    } else {
                        alert(data.message);
                    }

                })
            }
        };
        $scope.closePage = function(){
            $state.go('app.tabs.servicesmy');
        }
    })

    //活动表格 修改
    .controller('ServicesEditFormCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData,industryData) {
        cityData.shift();
        industryData.shift();
        $scope.cityData = cityData;
        $scope.industryData = industryData;
        $scope.form_title = '修改创业服务';
        $scope.form_btn = '修改服务';
        restApi.Services.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
        });

        //提交表单
        $scope.submitForm = function(events_form){
            if (events_form.$valid) {
                //删除用户名 因为提交的时候不需要username
                restApi.Services.update($scope.data, function (data) {
                    if (data && !data.error) {
                        $ionicPopup.alert({
                            title: '提示!',
                            template: '服务修改成功！'
                        }).then(function (res) {
                            $state.go('app.tabs.servicesmy');
                        });

                    } else {
                        alert(data.message);
                    }
                })
            }
        };

        $scope.closePage = function(){
            $state.go('app.tabs.servicesmy');
        }

    })

    .controller('IncProjectController', function ($scope, $stateParams,restApi,loginData) {
        var userId = loginData.getUserId();
        $scope.data = restApi.Project.userQuery({id: userId});

        $scope.change = function(item) {
            console.log("Selected Serverside, text:", item.text, "value:", item.value);
        };
    })



    .controller('CompanyCtrl', function ($scope, $stateParams,restApi) {
        $scope.companyData = restApi.Company.getOne($stateParams);
        $scope.jobsData = restApi.Job.queryByComId($stateParams);
    })

    //创业项目
    .controller('ProjectCtrl', function ($scope, restApi,industryData,cityData) {
        $scope.data = restApi.Project.query();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedIndustry = {id:0,name:'全部领域'};
        //筛选
        $scope.changeIndustry = function(industry){
            $scope.selectedIndustry = industry;
            $scope.data = restApi.ProjectFilter.query(
                {city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name}
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.data = restApi.ProjectFilter.query({city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name});
        };
    })

    .controller('ProjectDetailCtrl', function ($scope, $state,$stateParams, $ionicPopup,loginData,restApi) {
        var userId = loginData.getUserId();
        restApi.Project.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;

            //判断用户是否登录，且是自己创建的活动
            if (userId && ajax.data.project_user_id == userId) {
                //可以控制
                $scope.control = true;
            }
        },function(){
            //错误则直接退出
            $state.go('app.tabs.services');
        });



        //提交项目
        $scope.submitProject = function(){
            var sid = $stateParams.id;
            if(userId){
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
            }else{
                $scope.modal.show();
            }

        };

        $scope.removeForm = function(){

            $ionicPopup.confirm({
                title: '提醒',
                template: '该项目删除后无法恢复，确定要删除该项目吗？',
                buttons: [
                    { text: '取消' },
                    {
                        text: '确定删除',
                        type: 'button-assertive',
                        onTap: function(e) {
                            restApi.Project.delete($stateParams,function(){
                                $state.go('app.tabs.projectmy');
                            });
                        }
                    }]
            });
        }
    })

    .controller('ProjectMyCtrl', function ($scope, restApi,loginData) {
        var id = loginData.getUserId();
        if (id) {
            $scope.list_title = "我的项目";
            $scope.uselist = true;
            $scope.data = restApi.Project.userQuery({id: id});
        }
    })

    //发布创业项目
    .controller('ProjectAddCtrl', function ($scope, $state, restApi, loginData,industryData,cityData,stageData) {
        $scope.data = {};
        industryData.shift();
        cityData.shift();
        stageData.shift();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.stageData = stageData;
        //发布创业服务
        $scope.submitForm = function (signup_form) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                $scope.data.project_user_id = loginData.getUserId();
                restApi.Project.save($scope.data, function (data) {
                    if (data && !data.error) {
                        alert('创业项目发布成功！');
                        $state.go('app.tabs.projectmy');
                    } else {
                        alert(data.message);
                    }

                })
            }
        };

        $scope.closePage = function(){
            $state.go('app.tabs.servicesmy');
        }
    })

    .controller('ProjectEditCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData,industryData,stageData) {
        cityData.shift();
        industryData.shift();
        stageData.shift();
        $scope.cityData = cityData;
        $scope.industryData = industryData;
        $scope.stageData = stageData;
        $scope.form_title = '修改创业项目';
        $scope.form_btn = '修改项目';
        restApi.Project.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
        });

        //提交表单
        $scope.submitForm = function(events_form){
            if (events_form.$valid) {
                //删除用户名 因为提交的时候不需要username
                restApi.Project.update($scope.data, function (data) {
                    if (data && !data.error) {
                        $ionicPopup.alert({
                            title: '提示!',
                            template: '项目 修改成功！'
                        }).then(function (res) {
                            $state.go('app.tabs.projectmy');
                        });

                    } else {
                        alert(data.message);
                    }
                })
            }
        };

        $scope.closePage = function(){
            $state.go('app.tabs.servicesmy');
        }

    })

    //人才展示
    .controller('TalentCtrl', function ($scope, restApi,salaryData,cityData,jobsData) {
        $scope.data = restApi.Users.query();
        $scope.salaryData = salaryData;
        $scope.cityData = cityData;
        $scope.jobsData = jobsData;

        //用于第一次赛选的默认值
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedJobs = {id:0,name:'全部岗位'};
        $scope.selectedSalary = {id:0,name:'全部薪酬'};

        //筛选岗位
        $scope.changeJobs = function(jobs){
            $scope.selectedJobs = jobs;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
        $scope.changeSalary = function(salary){
            $scope.selectedSalary = salary;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name}
            );
        };
    })

    .controller('TalentDetailCtrl', function ($scope,$state,$stateParams, restApi,loginData) {
        var userId = loginData.getUserId(),
            userType = loginData.getUserType(),
            join = {cid:userId,uid:$stateParams.id};
        restApi.Users.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            //提交简历
            $scope.submitJob = function(){
                //判断是否登录
                if(userId){
                    if(userType == 2){
                        restApi.JoinCompany.save(join);
                        $scope.isjoin = true;
                        $scope.joinBtnName = '已邀请';
                        alert('已成功发出邀请！');
                    }else{
                        alert('必须企业账户才能发出邀请，请升级为企业账户!');
                        $state.go('app.register_company');
                    }

                }else{
                    alert('请登录后再发出邀请!');
                    $scope.modal.show();
                }

            }

        },function(){
            //错误则直接退出
            $state.go('app.tabs.jobs');
        });

        if(userId){
            //判断是否已经报名
            restApi.CheckIsCompany.query(join,function(data){
                $scope.isjoin = data.data;
                if(data.data){
                    $scope.joinBtnName = '已邀请'
                }
            });
        }


    })

    .controller('FavoritesCtrl', ['$scope', '$state', function ($scope, $state) {
        $scope.navTitle = 'Tab Page';
    }])


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

    .controller('NavController', function ($scope, $state,$ionicSideMenuDelegate, $ionicModal, loginData) {
        //$scope.showMenu = function () {
        //    $ionicSideMenuDelegate.toggleLeft();
        //};
        //$scope.showRightMenu = function () {
        //    $ionicSideMenuDelegate.toggleRight();
        //};

        $scope.loginData = loginData.get();
        
        console.log($scope.loginData);


        $scope.logout = function () {
            $scope.loginData = loginData.reset();
            $state.go('app.tabs.events');
        };


    })


    .controller('TabsController', function ($scope, morePop,$location,$window) {
        //$scope.isShowPop = morePop.isShowPop;
        $scope.pop = morePop.pop;
        //设置二级菜单位置信息
        var tabWidth = $window.innerWidth/4;
        $scope.sLeft = tabWidth * 2 + (tabWidth/2 - 50) + 'px';
        $scope.mLeft = tabWidth * 3 + (tabWidth/2 - 50) + 'px';

        

        $scope.moreClick = function () {
            morePop.pop.mvalue = morePop.pop.mvalue === false;
            morePop.pop.svalue = false;
        };

        $scope.servicesClick = function(){
            morePop.pop.svalue = morePop.pop.svalue === false;
            morePop.pop.mvalue = false;
        };

        $scope.hideShowPop = function () {
            morePop.pop.svalue = false;
            morePop.pop.mvalue = false;
        };
        //跳转到家园页面
        $scope.goHome = function () {
            window.location.href = 'http://wsq.qq.com/reflow/263237005';
        }
    })

    .controller('RegisterCtrl', function ($scope, $location, $state, restApi, loginData,cityData) {
        $scope.data = {};
        cityData.shift();
        $scope.cityData = cityData;
        //注册用户
        $scope.registerUser = function (signup_form) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                $scope.data.user_type = 1;//个人
                restApi.Users.save($scope.data, function (data) {
                    if (data && !data.error) {
                        $scope.data.user_id = data.user_id;
                        loginData.set($scope.data);
                        alert('注册成功！');
                        $location.path('/app/tabs/events');
                    } else {
                        alert(data.message);
                    }

                })
            }
        };

        $scope.registerCompany = function (signup_form) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                $scope.data.user_type = 2;//创业者
                $scope.data.user_id = loginData.getUserId();
                restApi.Users.update($scope.data, function (data) {
                    if (data && !data.error) {
                        //更新用户类别
                        loginData.setUserType($scope.data.user_type);
                        alert('认证成功！');
                        $location.path('/app/tabs/events');
                    } else {
                        alert(data.message);
                    }
                })
            }
        };



        //关闭注册页面
        $scope.closeReg = function () {
            $state.go('app.tabs.events');
        }
    });
