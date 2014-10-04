'use strict';

angular.module('app.services', ['ngResource','ngStorage'])
    .factory('restApi', function ($resource) {

        var RestApi  = {},
            BATEURL = 'http://localhost/github/danfei/server/php/';

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
            'query': { method: 'GET',isArray:true},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'getOne':{method:'GET'},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 创业服务
         */
        RestApi.Services = $resource(BATEURL + 'services/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 创业项目
         */
        RestApi.Project = $resource(BATEURL + 'project/:id',{},{
            'query': { method: 'GET',isArray:true},
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
        this.data = {value: false};
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
    });
