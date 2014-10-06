'use strict';

angular.module('app.services', ['ngResource','ngStorage'])
    .factory('restApi', function ($resource) {

        var RestApi  = {},
            BATEURL = 'http://121.40.146.123/danfei/server/php/';

        RestApi.Job = $resource(BATEURL + 'jobs/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'queryByComId':{method:'GET',isArray:true,params:{ cmd:'company' }},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 活动url
         */
        RestApi.Events = $resource(BATEURL + 'events/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true,params:{ cmd:0 ,id:10}},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'searchQuery': { method: 'GET',isArray:true,params:{ cmd:'search' }},
            'getOne':{method:'GET'},
            'update':{method:'PUT'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 创业服务
         */
        RestApi.Services = $resource(BATEURL + 'services/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 筛选创业服务
         */
        RestApi.ServicesFilter = $resource(BATEURL + 'services/:city/:industry/:start/:num',{},{
            'query': { method: 'GET',isArray:true,params:{start:0,num:30 }}
        });

        /**
         * 提交项目
         */
        RestApi.ServicesProject = $resource(BATEURL + 'services_project',{});

        /**
         * 创业项目
         */
        RestApi.Project = $resource(BATEURL + 'project/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 用户信息
         */
        RestApi.Users = $resource(BATEURL + 'users/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        RestApi.CheckLogin = $resource(BATEURL + 'login',{});

        /**
         * 公司信息
         */
        RestApi.Company = $resource(BATEURL + 'company/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });


        return RestApi;
    })
    //设置post header
    .config(function ($httpProvider) {
        $httpProvider.defaults.transformRequest = function (data) {
            var str = [];
            for (var p in data) {
                data[p] !== undefined && str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
            }
            return str.join('&');
        };
        $httpProvider.defaults.headers.put['Content-Type'] =
            $httpProvider.defaults.headers.post['Content-Type'] =
                'application/x-www-form-urlencoded; charset=UTF-8';
    })
    /**
     * share cate data
     */
    .service('morePop',function(){
        this.isShowPop = false;
        this.data = {mvalue: false,svalue: false};
    })
    /**
     * share login data
     */
    .service('loginData',function($localStorage){
        var _losData = $localStorage.loginData,
            _loginData = _losData || {};
        return {
            set : function(data){
                _loginData.user_name = data.user_name;
                _loginData.user_rtx = data.user_rtx;
                _loginData.user_id = data.user_id;
                _loginData.user_phone = data.user_phone;
                //cache
                $localStorage.loginData = _loginData;
            },
            get : function(){
                return _loginData;
            },
            getUserId : function(){
                //TODO TEST
               return _loginData.user_id || 1;
            },
            reset : function () {
                _loginData = {};
                delete $localStorage.loginData;
            }
        }
    })

    .service('popData',function(){
        //this.selectedId = 0;
        this.data = {id: 0};
    })

    .service('industryData',function(){
        return [
            {
                id : 0,
                name : '全部领域'
            },
            {
                id : 1,
                name : '互联网'
            },
            {
                id : 2,
                name : '移动互联网'
            },
            {
                id : 3,
                name : 'o2o'
            },
            {
                id : 4,
                name : '社交'
            }
        ]
    })
    .service('cityData',function(){
        return [
            {
                id : 0,
                name : '全部地区'
            },
            {
                id : 1,
                name : '北京'
            },
            {
                id : 2,
                name : '深圳'
            },
            {
                id : 3,
                name : '上海'
            },
            {
                id : 4,
                name : '广州'
            }
        ]
    });
