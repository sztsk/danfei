angular.module('app.controllers',[])

    .controller('AppCtrl', function ($scope,$ionicModal,restApi,loginData) {
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
            restApi.CheckLogin.save($scope.data,function(data){
                if(data.error){
                    alert(data.message);
                }else{
                    loginData.set(data);
                    $scope.closeLogin();
                }
            });
        };

    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('DetailCtrl',function($scope ,workServer){
        workServer.getWorkById(1).then(function(data){
            $scope.data = data;
            console.log(data,'123');
        })
    })

    .controller('JobsCtrl',function($scope ,restApi){
        $scope.data = restApi.Job.query();
        console.log($scope.data);
    })

    .controller('JobsDetailCtrl',function($scope ,restApi){
        $scope.data = restApi.Job.getOne({id:1});
        console.log($scope.data);
    })

    //events
    .controller('EventsCtrl',function($scope ,restApi,morePop){
        morePop.data.value = false;

        $scope.data = restApi.Events.query();
    })

    .controller('EventsDetailCtrl',function($scope ,restApi,morePop){
        morePop.data.value = false;
        $scope.data = restApi.Events.getOne({id:1});
        console.log($scope.data);
    })

    //services
    .controller('ServicesCtrl',function($scope ,restApi){
        $scope.data = restApi.Services.query();
        console.log($scope.data);
    })

    .controller('ServicesDetailCtrl',function($scope ,restApi){
        $scope.data = restApi.Services.getOne({id:1});
        console.log($scope.data);
    })

    .controller('CompanyCtrl',function($scope ,restApi){
        $scope.companyData = restApi.Company.getOne({id:1});
        $scope.jobsData = restApi.Job.queryByComId({id:1});
    })

    //创业项目
    .controller('ProjectCtrl',function($scope ,restApi){
        $scope.data = restApi.Project.query();
        console.log($scope.data);
    })

    .controller('ProjectDetailCtrl',function($scope ,restApi){
        $scope.data = restApi.Project.getOne({id:1});
        console.log($scope.data);
    })

    //人才展示
    .controller('TalentCtrl',function($scope ,restApi){

        $scope.data = restApi.Users.query();
        console.log($scope.data);
    })

    .controller('TalentDetailCtrl',function($scope ,restApi){
        $scope.data = restApi.Users.getOne({id:1});
        console.log($scope.data);
    })




    .controller('HomeController', [ '$scope', '$state', function($scope, $state) {
        $scope.navTitle = 'Tab Page';
        console.log(12);
//        $scope.leftButtons = [{
//            type: 'button-icon icon ion-navicon',
//            tap: function(e) {
//                $scope.toggleMenu();
//            }
//        }];
    }])

    .controller('NavController',function($scope,$ionicSideMenuDelegate,$ionicModal,loginData,restApi){
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };

        $scope.loginData =loginData.get();

        $scope.logout = function () {
            loginData.reset();
            $scope.loginData = {};
        };


    })


    .controller('TabsController', function ($scope,morePop) {
        //$scope.isShowPop = morePop.isShowPop;
        $scope.data = morePop.data;
        
        $scope.moreClick = function(){
            morePop.data.value = morePop.data.value === false;
            console.log(morePop.isShowPop,$scope.isShowPop,$scope.data);
        };

        $scope.hideShowPop = function(){
            morePop.data.value = false;
        };
        //跳转到家园页面
        $scope.goHome = function(){
            $window.location.href = 'http://www.baidu.com';
        }
    })

    .controller('RegisterCtrl', function ($scope, $location,restApi,loginData) {
        $scope.data = {};
        //loginData.set({
        //    user_name :'hugo'
        //})
        //注册用户
        $scope.registerUser = function(signup_form){
            //表单验证
            // TODO 详细验证信息需要设置
            if(signup_form.$valid){
                restApi.Users.save($scope.data,function(data){
                    if(data && data.error === false){
                        loginData.set($scope.data);
                        alert(data.message);
                        $location.path('/app/tabs/events');
                    }else{
                        alert(data.message);
                    }

                })
            }
        };

        //关闭注册页面
        $scope.closeReg = function(){
            $location.path('/app/tabs/events');
        }
    });
