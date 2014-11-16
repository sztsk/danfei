'use strict';

angular.module('app.services', ['ngResource','ngStorage'])
    .factory('restApi', function ($resource) {

        var RestApi  = {},
            BATEURL = 'http://121.40.146.123/danfei/server/php/';

        if(window.location.host.indexOf('localhost') !== -1){
            BATEURL = 'http://localhost/github/danfei/server/php/index.php/';
        }

        RestApi.Job = $resource(BATEURL + 'jobs/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'queryByComId':{method:'GET',isArray:true,params:{ cmd:'company' }},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'zan':{method:'PATCH',params:{ cmd:'zan'}},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 搜索简历
         */
        RestApi.JobsSearch = $resource(BATEURL + 'jobs/:city/:salary/:jobs/:experience/:edu/:time',{},{
            'query': { method: 'GET',isArray:true}
        });

        //提交简历
        RestApi.JoinJobs = $resource(BATEURL + 'join/jobs/:id',{},{
            'query': { method: 'GET',isArray:true}
        });

        /**
         * 判断是否已经提交过简历
         */
        RestApi.CheckIsJob = $resource(BATEURL + 'check/jobs/:jid/user/:uid',{},{
            'query': { method: 'GET'}
        });
        /**
         * 职业筛选
         */
        RestApi.JobsFilter = $resource(BATEURL + 'jobs/:city/:salary/:jobs/:experience/:edu/:time/:start/:num',{},{
            'query': { method: 'GET',isArray:true,params:{start:0,num:30 }}
        });

        /**
         * 活动url
         */
        RestApi.Events = $resource(BATEURL + 'events/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true,params:{ cmd:0 ,id:10}},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'searchQuery': { method: 'GET',isArray:true,params:{ cmd:'search' }},
            'cityQuery': { method: 'GET',isArray:true,params:{ cmd:'city' }},
            'getOne':{method:'GET'},
            'zan':{method:'PATCH',params:{ cmd:'zan'}},
            'update':{method:'PUT'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        RestApi.EventsFilter = $resource(BATEURL + 'events/city/:city/:sort',{},{
            'query': { method: 'GET',isArray:true}
        });

        /**
         * 创业服务
         */
        RestApi.Services = $resource(BATEURL + 'services/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'userQuery': { method: 'GET',isArray:true,params:{ cmd:'user' }},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'zan':{method:'PATCH',params:{ cmd:'zan'}},
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
            'zan':{method:'PATCH',params:{ cmd:'zan'}},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 筛选创业服务
         */
        RestApi.ProjectFilter = $resource(BATEURL + 'project/:city/:industry/:start/:num',{},{
            'query': { method: 'GET',isArray:true,params:{start:0,num:30 }}
        });

        /**
         * 用户信息
         */
        RestApi.Users = $resource(BATEURL + 'users/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'getMin':{method:'GET',params:{cmd:'edit'}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });


        RestApi.CheckLogin = $resource(BATEURL + 'login',{});

        /**
         * 人才筛选
         */
        RestApi.TalentFilter = $resource(BATEURL + 'users/:city/:salary/:jobs/:start/:num',{},{
            'query': { method: 'GET',isArray:true,params:{start:0,num:30 }}
        });


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

        /**
         * 公司信息
         */
        RestApi.Cv = $resource(BATEURL + 'cv/:cmd/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'zan':{method:'PATCH',params:{ cmd:'zan'}},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        /**
         * 发出邀请
         */
        RestApi.JoinCompany = $resource(BATEURL + 'join/company/:id',{},{
            'query': { method: 'GET',isArray:true}
        });
        /**
         * 判断是否已经邀请
         */
        RestApi.CheckIsCompany = $resource(BATEURL + 'check/company/:cid/user/:uid',{},{
            'query': { method: 'GET'}
        });

        /**
         * 报名信息
         */
        RestApi.EventsJoin = $resource(BATEURL + 'join/events/:id',{},{
            'query': { method: 'GET',isArray:true}
        });
        /**
         * 判断是否已经报名
         */
        RestApi.CheckIsJoin = $resource(BATEURL + 'check/events/:eid/user/:uid',{},{
            'query': { method: 'GET'}
        });

        //收藏
        RestApi.Collect = $resource(BATEURL + 'collect/:uid',{},{
            'save': { method: 'POST'}
        });

        //收藏
        RestApi.Favorites = $resource(BATEURL + 'favorites/:uid',{},{
            'query': { method: 'GET'}
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
            $httpProvider.defaults.headers.patch['Content-Type'] =
            $httpProvider.defaults.headers.post['Content-Type'] =
                'application/x-www-form-urlencoded; charset=UTF-8';
    })
    /**
     * share cate data
     */
    .service('morePop',function(){
        this.isShowPop = false;
        this.pop = {mvalue: false,svalue: false};
    })
    /**
     * share login data
     */
    .service('loginData',function($localStorage){
        var _losData = $localStorage.loginData,
            _loginData = _losData || {};
        return {
            set : function(data){
                //console.log('set',data);
                _loginData.user_id = data.user_id;
                _loginData.user_type = data.user_type;
                _loginData.user_name = data.user_name;
                _loginData.user_phone = data.user_phone;
                _loginData.user_thum = data.user_thum;
                _loginData.user_vip = data.user_vip;

                //cache
                $localStorage.loginData = _loginData;
            },
            setUserType : function(user_type){
                _loginData.user_type = user_type;
            },
            /**
             * 设置用户头像
             * @param user_thum
             */
            setUserThum : function(user_thum){
                _loginData.user_thum = user_thum;
            },
            get : function(){
                return _loginData;
            },
            getUserId : function(){
                //TODO TEST
               return _loginData.user_id;
            },
            getUserType : function(){
                return _loginData.user_type;
            },
            reset : function () {
                _loginData = {user_name : null};
                delete $localStorage.loginData;
                return _loginData;
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
    })
    .service('jobsData',function(){
        return [
            {
                id : 0,
                name : '全部岗位'
            },
            {
                id : 1,
                name : '前端开发'
            },
            {
                id : 2,
                name : '后台开发'
            },
            {
                id : 3,
                name : '产品经理'
            },
            {
                id : 4,
                name : '产品运营'
            }
        ]
    })
    .service('salaryData',function(){
        return [
            {
                id : 0,
                name : '全部薪酬'
            },
            {
                id : 1,
                name : '2K以下'
            },
            {
                id : 2,
                name : '2K-5K'
            },
            {
                id : 3,
                name : '5K-10K'
            },
            {
                id : 4,
                name : '10K-15K'
            },
            {
                id : 5,
                name : '15K-25K'
            },
            {
                id : 6,
                name : '25K-50K'
            },
            {
                id : 7,
                name : '50以上'
            }
        ]
    })
    .service('sexData',function(){
        return [
            {
                id : 0,
                name : '男'
            },
            {
                id : 1,
                name : '女'
            }
        ]
    })
    .service('eduData',function(){
        return [
            {
                id : 0,
                name : '全部学历'
            },
            {
                id : 10,
                name : '大专'
            },
            {
                id : 1,
                name : '本科'
            },
            {
                id : 1,
                name : '硕士'
            },
            {
                id : 1,
                name : '博士'
            },
            {
                id : 1,
                name : '其他'
            }
        ]
    })
    .service('experienceData',function(){
        return [
            {
                id : 0,
                name : '经验不限'
            },
            {
                id : 10,
                name : '应届毕业生'
            },
            {
                id : 1,
                name : '1年以下'
            },
            {
                id : 2,
                name : '1-3年'
            },
            {
                id : 3,
                name : '3-5年'
            },
            {
                id : 4,
                name : '5-10年'
            }
            ,
            {
                id : 5,
                name : '10年以上'
            }
        ]
    })
    .service('timeData',function(){
        return [
            {
                id : 0,
                name : '不限'
            },
            {
                id : 10,
                name : '今天'
            },
            {
                id : 1,
                name : '3天内'
            },
            {
                id : 2,
                name : '一周内'
            },
            {
                id : 3,
                name : '一月内'
            }
        ]
    })

    .service('stageData',function(){
        return [
            {
                id : 0,
                name : '全部阶段'
            },
            {
                id : 1,
                name : '天使轮'
            },
            {
                id : 2,
                name : 'A轮'
            },
            {
                id : 3,
                name : 'B轮'
            },
            {
                id : 4,
                name : 'C轮'
            },
            {
                id : 5,
                name : 'C轮以上'
            },
            {
                id : 6,
                name : '未融资'
            }
        ]
    })

    .service('eStatusData',function(){
        return [
            {
                id : 0,
                name : '全部状态'
            },
            {
                id : 1,
                name : '未开始'
            },
            {
                id : 2,
                name : '已结束'
            },
            {
                id : 3,
                name : '进行中'
            }
        ]
    })

    .service('timePicker',function(){
        return ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
    })
;


