angular.module('app.controllers', ['imageupload','angular-datepicker'])

    .controller('AppCtrl', function ($scope, $state,$stateParams,$ionicModal,$rootScope, loginData,$ionicLoading,$location,cityData,salaryData,eduData,experienceData,timeData,jobsData) {
// Create the login modal that we will use later
        //http://ionicframework.com/docs/api/service/$ionicModal/
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $ionicLoading.show({
            template: 'Loading...'
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
                $ionicLoading.hide();
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

        $scope.goReg = function(){
            $state.go('app.register_user');
            $scope.modal.hide();
        };

        //TODO 移到简历controller
        $scope.openMenu = function(type){
            $scope[type] = !$scope[type];
        };

        //是否显示搜索按钮
        $scope.jobsPage = ($state.current.url.indexOf('jobs') !== -1);
        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            $scope.jobsPage = (toState.url.indexOf('jobs') !== -1);
        });


        $scope.cityData = cityData;
        $scope.salaryData = salaryData;
        $scope.eduData = eduData;
        $scope.experienceData = experienceData;
        $scope.timeData = timeData;
        $scope.jobsData = jobsData;
        //重新整理数据
        $scope.cityData[0].name = '不限';
        $scope.salaryData[0].name = '不限';
        $scope.experienceData[0].name = '不限';
        $scope.eduData[0].name = '不限';
        $scope.jobsData[0].name = '不限';
        $scope.menuData = {
            city : '不限',
            salary : '不限',
            experience : '不限',
            edu : '不限',
            time : '不限',
            jobs : '不限'
        };

        $scope.searchCv = function () {
            $location.path('/app/tabs/jobs/' +
                $scope.menuData.city + '/' +
                $scope.menuData.salary + '/' +
                $scope.menuData.jobs + '/' +
                $scope.menuData.experience + '/' +
                $scope.menuData.edu + '/' +
                $scope.menuData.time
            );
        }



    })



    .controller('DetailCtrl', function ($scope, $stateParams,workServer) {
        workServer.getWorkById($stateParams.id).then(function (data) {
            $scope.data = data;
        })
    })

    .controller('JobsCtrl', function ($scope, restApi,salaryData,cityData,jobsData,$ionicLoading) {
        $scope.jobsPage = true;
        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }

        restApi.Job.query(function(ajax){
            done(ajax);
        });
        //$scope.salaryData = salaryData;
        //$scope.cityData = cityData;
        //$scope.jobsData = jobsData;
        ////用于第一次赛选的默认值
        //$scope.selectedCity = {id:0,name:'全部地区'};
        //$scope.selectedJobs = {id:0,name:'全部岗位'};
        //$scope.selectedSalary = {id:0,name:'全部薪酬'};

        //筛选岗位
        //$scope.changeJobs = function(jobs){
        //    $scope.selectedJobs = jobs;
        //    $scope.nodata = false;
        //    $scope.data = restApi.JobsFilter.query(
        //        {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
        //            done(ajax);
        //        }
        //    );
        //};
        //$scope.changeCity = function(city){
        //    $scope.selectedCity = city;
        //    $scope.nodata = false;
        //    $scope.data = restApi.JobsFilter.query(
        //        {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
        //            done(ajax);
        //        }
        //    );
        //};
        //$scope.changeSalary = function(salary){
        //    $scope.selectedSalary = salary;
        //    $scope.nodata = false;
        //    $scope.data = restApi.JobsFilter.query(
        //        {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
        //            done(ajax);
        //        }
        //    );
        //};
    })

    .controller('JobsSearchCtrl', function ($scope, restApi,$stateParams,$ionicLoading) {

        $scope.jobsPage = true;
        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }

        restApi.JobsSearch.query($stateParams,function(ajax){
            done(ajax);
        });
    })

    .controller('JobsDetailCtrl', function ($scope,$state, $stateParams,restApi,loginData,$ionicLoading) {
        $scope.userId = loginData.getUserId();
        var join = {uid:$scope.userId,jid:$stateParams.id};
        restApi.Job.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();

            //提交简历
            $scope.submitJob = function(){
                //判断是否登录
                if($scope.userId){
                    restApi.JoinJobs.save(join,function(data){
                        if(data.error){
                            alert(data.error);
                            $state.go('app.tabs.jobsedit')
                        }else{
                            //简历提交成功
                            $scope.isjoin = true;
                            $scope.joinBtnName = '已提交';
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

        if($scope.userId){
            //判断是否已经报名
            restApi.CheckIsJob.query(join,function(data){
                $scope.isjoin = data.data;
                if(data.data){
                    $scope.joinBtnName = '已提交'
                }
            });
        }

        //收藏
        $scope.collectEvt = function(jobsId){

            if($scope.userId){
                var collectData = {
                    favorites_user_id : $scope.userId,
                    favorites_publish_user_id : jobsId,
                    favorites_type : 2,
                    favorites_type_id : $stateParams.id
                };
                restApi.Collect.save(collectData,function(data){
                    if(data && data.favorites_id){
                        $scope.collect = '已收藏';
                    }
                })
            }else{
                $scope.modal.show();
            }
        };
        //赞
        $scope.zanEvt = function(){
            restApi.Job.zan($stateParams, function (ajax) {
                $scope.data = ajax.data;
                $scope.zan = true;
            })
        };

    })

    //events
    .controller('EventsCtrl', function ($scope,$ionicLoading, restApi, morePop,cityData,eStatusData) {
        var start = 0,
            num = 30,
            page = 1;

        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }

        morePop.pop.value = false;
        $scope.event_title = "活动列表";
        $scope.event_type = 'alllist';
        $scope.cityData = cityData;
        $scope.eStatusData = eStatusData;
        $scope.noMoreItemsAvailable = false;
        restApi.Events.query({cmd:start,id:num},function(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
            //$scope.noMoreItemsAvailable = true;
        });
        $scope.searchEvents = function(keyword){
            $scope.nodata = false;
            restApi.Events.searchQuery({id:keyword},function(ajax){
                done(ajax);
            })
        };


        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.nodata = false;
            restApi.EventsFilter.query({city:$scope.selectedCity.name,sort:'events_id'},function(ajax){
                done(ajax);
            });
        };

        //$scope.hotData = [{
        //    key : ''
        //}]

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

    .controller('EventsDetailCtrl', function ($scope,$state, $location,$stateParams,$ionicPopup,restApi, morePop, loginData,$ionicLoading) {
        var userId = loginData.getUserId(),
            join = {uid:userId,eid:$stateParams.id};
        morePop.pop.value = false;

        restApi.Events.getOne($stateParams, function (data) {
            data = data.data;
            $scope.data = data;
            $ionicLoading.hide();
            //判断用户是否登录，且是自己创建的活动
            if (userId && data.events_user_id == userId) {
                //可以控制
                $scope.control = true;
            }

            if (userId && data.events_user_id != userId) {
                //判断是否已经报名
                restApi.CheckIsJoin.query(join,function(data){
                    $scope.isjoin = data.data;
                    $scope.joinBtnName = '已报名'
                });
                //获取报名列表
                //$scope.joinData = restApi.EventsJoin.query($stateParams);
            }

        },function(){
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
        };

        //收藏
        $scope.collectEvt = function(eventsUid){

            if(userId){
                var collectData = {
                    favorites_user_id : userId,
                    favorites_publish_user_id : eventsUid,
                    favorites_type : 1,
                    favorites_type_id : $stateParams.id
                };
                restApi.Collect.save(collectData,function(data){
                    console.log(data);
                    
                    if(data && data.favorites_id){
                        $scope.collect = '已收藏';
                    }
                })
            }else{
                $scope.modal.show();
            }
        };
        //赞
        $scope.zanEvt = function(){
            restApi.Events.zan($stateParams, function (ajax) {
                $scope.data = ajax.data;
                $scope.zan = true;
            })
        };
        //分享
        //$scope.hideShareEvt = function(){
        //    $scope.share = false;
        //};
        //
        //$scope.showShareEvt = function(){
        //    $scope.share = true;
        //}

    })

    .controller('EventsMyCtrl', function ($scope, restApi, loginData,$ionicLoading) {
        var id = loginData.getUserId();
        if (id) {
            $scope.uselist = true;
            $scope.event_title = "我的活动";
            $scope.event_type = 'userlist';
            restApi.Events.userQuery({id: id},function(ajax){
                $scope.data = ajax;
                $ionicLoading.hide();
                if(!ajax.length){
                    $scope.nodata = true;
                }
            });
        }else{

        }
    })

    //活动表格 新增
    .controller('EventsAddFormCtrl', function ($scope,$http, restApi, $state, $ionicPopup,cityData,loginData,$ionicLoading) {
        $scope.data = {};
        $scope.events_title = "发布活动";
        $scope.events_btn = '发布活动';
        cityData.shift();
        $scope.cityData = cityData;
        $ionicLoading.hide();
        //提交表单
        $scope.eventsSubmit = function(events_form,image){
            console.log(image);
            
            if (events_form.$valid) {
                //userId 在外层control
                $scope.data.events_user_id = loginData.getUserId();
                image && ($scope.data.image = image.dataURL);
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

    })

    //活动表格 修改
    .controller('EventsEditFormCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData,$ionicLoading) {
        cityData.shift();
        $scope.cityData = cityData;
        $scope.events_title = '修改活动';
        $scope.events_btn = '修改活动';
        restApi.Events.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();
            if(ajax.data.events_img){
                $scope.editimage = ajax.data.events_img;
            }
        });

        //提交表单
        $scope.eventsSubmit = function(events_form,image){
            if (events_form.$valid) {
                //删除用户名 因为提交的时候不需要username
                delete  $scope.data.user_name;
                image && ($scope.data.image = image.dataURL);
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
    .controller('ServicesCtrl', function ($scope, restApi,industryData,cityData,$ionicLoading) {

        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }

        restApi.Services.query(function(ajax){
            done(ajax);
        });
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedIndustry = {id:0,name:'全部领域'};
        //筛选
        $scope.changeIndustry = function(industry){
            $ionicLoading.show();
            $scope.nodata = false;
            $scope.selectedIndustry = industry;
            restApi.ServicesFilter.query(
                {city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name},function(ajax){
                    done(ajax);
                }
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $ionicLoading.show();
            restApi.ServicesFilter.query({city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name},function(ajax){
                done(ajax);
            });
        };
    })

    .controller('ServicesMyCtrl', function ($scope, restApi,loginData,$ionicLoading) {
        var id = loginData.getUserId() || 1;
        if (id) {
            $scope.list_title = "我的服务";
            $scope.uselist = true;
            restApi.Services.userQuery({id: id},function(ajax){
                $scope.data = ajax;
                $ionicLoading.hide();
                if(!ajax.length){
                    $scope.nodata = true;
                }
            });
        }
    })


    .controller('ServicesDetailCtrl', function ($scope,$state, $stateParams,$ionicPopup, loginData,restApi,$ionicLoading) {
        $scope.userId = loginData.getUserId();
        restApi.Services.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();
            //判断用户是否登录，且是自己创建的活动
            if ($scope.userId && ajax.data.services_user_id == $scope.userId) {
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
            if($scope.userId){
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
        };


        //收藏
        $scope.collectEvt = function(servicesUid){

            if($scope.userId){
                var collectData = {
                    favorites_user_id : $scope.userId,
                    favorites_publish_user_id : servicesUid,
                    favorites_type : 2,
                    favorites_type_id : $stateParams.id
                };
                restApi.Collect.save(collectData,function(data){
                    if(data && data.favorites_id){
                        $scope.collect = '已收藏';
                    }
                })
            }else{
                $scope.modal.show();
            }
        };
        //赞
        $scope.zanEvt = function(){
            restApi.Services.zan($stateParams, function (ajax) {
                $scope.data = ajax.data;
                $scope.zan = true;
            })
        };

    })

    .controller('ServicesAddCtrl', function ($scope, $state, restApi, loginData,industryData,cityData,$ionicLoading) {
        $scope.data = {};
        industryData.shift();
        cityData.shift();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $ionicLoading.hide();
        //发布创业服务
        $scope.submitForm = function (signup_form,image) {
            $ionicLoading.show();
            //表单验证
            // TODO 详细验证信息需要设置
            if (signup_form.$valid) {
                $scope.data.services_user_id = loginData.getUserId();
                image && ($scope.data.image = image.dataURL);
                restApi.Services.save($scope.data, function (data) {
                    if (data && !data.error) {
                        $ionicLoading.hide();
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
    .controller('ServicesEditFormCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData,industryData,$ionicLoading) {
        cityData.shift();
        industryData.shift();
        $scope.cityData = cityData;
        $scope.industryData = industryData;
        $scope.form_title = '修改创业服务';
        $scope.form_btn = '修改服务';
        restApi.Services.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();
            if(ajax.data.services_img){
                $scope.editimage = ajax.data.services_img;
            }
        });

        //提交表单
        $scope.submitForm = function(events_form,image){
            if (events_form.$valid) {
                image && ($scope.data.image = image.dataURL);
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
    .controller('ProjectCtrl', function ($scope, restApi,industryData,cityData,$ionicLoading) {
        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }
        restApi.Project.query(function(ajax){
            done(ajax);
        });
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.selectedCity = {id:0,name:'全部地区'};
        $scope.selectedIndustry = {id:0,name:'全部领域'};
        //筛选
        $scope.changeIndustry = function(industry){
            $ionicLoading.show();
            $scope.nodata = false;
            $scope.selectedIndustry = industry;
            restApi.ProjectFilter.query(
                {city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name},function(ajax){
                    done(ajax);
                }
            );
        };
        $scope.changeCity = function(city){
            $ionicLoading.show();
            $scope.nodata = false;
            $scope.selectedCity = city;
            restApi.ProjectFilter.query({city:$scope.selectedCity.name,industry:$scope.selectedIndustry.name},function(ajax){
                done(ajax);
            });
        };
    })

    .controller('ProjectDetailCtrl', function ($scope, $state,$stateParams, $ionicPopup,loginData,restApi,$ionicLoading) {
        $scope.userId = loginData.getUserId();
        restApi.Project.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();
            //判断用户是否登录，且是自己创建的活动
            if ($scope.userId && ajax.data.project_user_id == $scope.userId) {
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
            if($scope.userId){
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

        //收藏
        $scope.collectEvt = function(jobsId){

            if($scope.userId){
                var collectData = {
                    favorites_user_id : $scope.userId,
                    favorites_publish_user_id : jobsId,
                    favorites_type : 5,
                    favorites_type_id : $stateParams.id
                };
                restApi.Collect.save(collectData,function(data){
                    if(data && data.favorites_id){
                        $scope.collect = '已收藏';
                    }
                })
            }else{
                $scope.modal.show();
            }
        };
        //赞
        $scope.zanEvt = function(){
            restApi.Project.zan($stateParams, function (ajax) {
                $scope.data = ajax.data;
                $scope.zan = true;
            })
        };
    })

    .controller('ProjectMyCtrl', function ($scope, restApi,loginData,$ionicLoading) {
        var id = loginData.getUserId();
        if (id) {
            $scope.list_title = "我的项目";
            $scope.uselist = true;
            restApi.Project.userQuery({id: id},function(ajax){
                $scope.data = ajax;
                $ionicLoading.hide();
                if(!ajax.length){
                    $scope.nodata = true;
                }
            });
        }
    })

    //发布创业项目
    .controller('ProjectAddCtrl', function ($scope, $state, restApi, loginData,industryData,cityData,stageData,$ionicLoading) {
        $scope.data = {};
        industryData.shift();
        cityData.shift();
        stageData.shift();
        $scope.industryData = industryData;
        $scope.cityData = cityData;
        $scope.stageData = stageData;
        $ionicLoading.hide();
        //发布创业服务
        $scope.submitForm = function (project_form,image) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (project_form.$valid) {
                $scope.data.project_user_id = loginData.getUserId();
                image && ($scope.data.image = image.dataURL);
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

    .controller('ProjectEditCtrl', function ($scope, restApi,$state, loginData, $stateParams,$location,$ionicPopup,cityData,industryData,stageData,$ionicLoading) {
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
            $ionicLoading.hide();
            if(ajax.data.project_img){
                $scope.editimage = ajax.data.project_img;
            }
        });

        //提交表单
        $scope.submitForm = function(project_form,image){
            if (project_form.$valid) {
                $ionicLoading.show();
                image && ($scope.data.image = image.dataURL);
                restApi.Project.update($scope.data, function (data) {
                    $ionicLoading.hide();
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
    .controller('TalentCtrl', function ($scope, restApi,salaryData,cityData,jobsData,$ionicLoading) {
        function done(ajax){
            $scope.data = ajax;
            $ionicLoading.hide();
            if(!ajax.length){
                $scope.nodata = true;
            }
        }

        restApi.Users.query(function(ajax){
            done(ajax)
        });
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
            $scope.nodata = false;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
                    done(ajax)
                }
            );
        };
        $scope.changeCity = function(city){
            $scope.selectedCity = city;
            $scope.nodata = false;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
                    done(ajax)
                }
            );
        };
        $scope.changeSalary = function(salary){
            $scope.selectedSalary = salary;
            $scope.nodata = false;
            $scope.data = restApi.TalentFilter.query(
                {city:$scope.selectedCity.name,jobs:$scope.selectedJobs.name,salary:$scope.selectedSalary.name},function(ajax){
                    done(ajax)
                }
            );
        };
    })

    .controller('TalentDetailCtrl', function ($scope,$state,$stateParams,$ionicLoading, restApi,loginData) {
        $scope.userId = loginData.getUserId();
        var userType = loginData.getUserType(),
            join = {cid:$scope.userId,uid:$stateParams.id};
        restApi.Users.getOne($stateParams,function(ajax){
            $scope.data = ajax.data;
            $ionicLoading.hide();
            //提交简历
            $scope.submitJob = function(){
                //判断是否登录
                if($scope.userId){
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

        if($scope.userId){
            //判断是否已经报名
            restApi.CheckIsCompany.query(join,function(data){
                $scope.isjoin = data.data;
                if(data.data){
                    $scope.joinBtnName = '已邀请'
                }
            });
        }

        //
        //收藏
        $scope.collectEvt = function(jobsId){

            if($scope.userId){
                var collectData = {
                    favorites_user_id : $scope.userId,
                    favorites_publish_user_id : jobsId,
                    favorites_type : 4,
                    favorites_type_id : $stateParams.id
                };
                restApi.Collect.save(collectData,function(data){
                    if(data && data.favorites_id){
                        $scope.collect = '已收藏';
                    }
                })
            }else{
                $scope.modal.show();
            }
        };
        //赞
        $scope.zanEvt = function(){
            restApi.Cv.zan($stateParams, function (ajax) {
                $scope.data = ajax.data;
                $scope.zan = true;
            })
        };


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
        var pageWidth = $window.innerWidth,
            tabWidth = $window.innerWidth/ 3,
            marginLeft = 0;
        if($window.innerWidth >= 450){
            pageWidth = 450;
            tabWidth = 150;
            marginLeft = ($window.innerWidth - 450) /2;
        }
        $scope.sLeft = (tabWidth/2 - 50) + marginLeft + 'px';
        $scope.mLeft = tabWidth * 2 + (tabWidth/2 - 50) + marginLeft + 'px';

        

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

    .controller('RegisterCtrl', function ($scope, $location, $state, restApi, loginData,cityData,$ionicLoading) {
        $scope.data = {};
        cityData.shift();
        $scope.cityData = cityData;
        $ionicLoading.hide();
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
    })

    .controller('CvFormCtrl', function ($scope, $state, restApi, loginData,cityData,jobsData,eduData,salaryData,sexData,experienceData,$ionicLoading) {
        var userId = loginData.getUserId();
        $scope.event_title = "我的简历";
        $scope.data = {};
        cityData.shift();
        $scope.cityData = cityData;
        $scope.jobsData = jobsData;
        $scope.eduData = eduData;
        $scope.salaryData = salaryData;
        $scope.sexData = sexData;
        $scope.experienceData = experienceData;

        restApi.Cv.getOne({id:userId},function(ajax){
            if(ajax.data){
                $scope.data = ajax.data;
                $scope.edit = true;
            }
            $ionicLoading.hide();
        });

        $scope.submitForm = function (cv_form,image) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (cv_form.$valid) {
                $scope.data.cv_user_id = userId;
                image && ($scope.data.image = image.dataURL);
                if($scope.edit){
                    restApi.Cv.update($scope.data, function (data) {
                        if (data && !data.error) {
                            $state.go('app.tabs.cv2');
                        } else {
                            alert(data.message);
                        }
                    })
                }else{
                    restApi.Cv.save($scope.data, function (data) {
                        if (data && !data.error) {
                            $state.go('app.tabs.cv2');
                        } else {
                            alert(data.message);
                        }
                    })
                }

            }
        };

        //关闭页面
        $scope.closePop = function () {
            $state.go('app.tabs.events');
        }
    })

    .controller('Cv2FormCtrl', function ($scope, $state, restApi, loginData,cityData,jobsData,eduData,salaryData,sexData,experienceData,$ionicLoading) {
        var userId = loginData.getUserId();
        $scope.data = {};
        cityData.shift();
        $scope.cityData = cityData;
        $scope.jobsData = jobsData;
        $scope.eduData = eduData;
        $scope.salaryData = salaryData;
        $scope.sexData = sexData;
        $scope.experienceData = experienceData;

        restApi.Cv.getOne({id:userId},function(ajax){
            if(ajax.data){
                $scope.data = ajax.data;
                $scope.edit = true;
            }
            $ionicLoading.hide();
        });

        $scope.submitForm = function (cv_form,image) {
            console.log($scope.data);
            //表单验证
            // TODO 详细验证信息需要设置
            if (cv_form.$valid) {
                $scope.data.cv_user_id = userId;
                image && ($scope.data.image = image.dataURL);
                if($scope.edit){
                    restApi.Cv.update($scope.data, function (data) {
                        if (data && !data.error) {
                            $state.go('app.tabs.cv2');
                        } else {
                            alert(data.message);
                        }
                    })
                }else{
                    restApi.Cv.save($scope.data, function (data) {
                        if (data && !data.error) {
                            $state.go('app.tabs.cv2');
                        } else {
                            alert(data.message);
                        }
                    })
                }

            }
        };

        //关闭页面
        $scope.closePop = function () {
            $state.go('app.tabs.events');
        }
    })


    .controller('shareCtrl',function(){

    });
