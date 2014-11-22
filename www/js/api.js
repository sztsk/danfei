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

    //表单验证
    .factory('validation', function () {
        return {
            events : function(events_form){

                if(events_form.events_quota.$invalid && !events_form.events_quota.$pristine){
                    return '活动名额必须是数字！';
                }else if(events_form.events_title.$invalid && !events_form.events_title.$dirty){
                    return '活动标题必须填写';
                }else if(events_form.datepicker.$invalid && !events_form.datepicker.$dirty){
                    return '活动时间必须填写';
                }else if(events_form.events_quota.$invalid && !events_form.events_quota.$dirty){
                    return '活动名额必须填写';
                }else if(events_form.events_detail.$invalid && !events_form.events_detail.$dirty){
                    return '活动详情必须填写';
                }else if(events_form.events_address.$invalid && !events_form.events_address.$dirty){
                    return '地址及交通必须填写';
                }
            },
            signup : function(signup_form){
                if(signup_form.user_phone.$invalid && !signup_form.user_phone.$pristine){
                    return '手机号码必须是11位数字！';
                }else if(signup_form.user_rtx.$invalid && !signup_form.user_rtx.$pristine){
                    return 'RTX名字必须是英文';
                }else if(signup_form.user_name.$invalid && !signup_form.user_name.$pristine){
                    return '姓名必须是中文';
                }else if(signup_form.user_phone.$invalid && !signup_form.user_phone.$dirty){
                    return '手机号码必须填写';
                }else if(signup_form.user_password.$invalid && !signup_form.user_password.$dirty){
                    return '密码必须填写';
                }else if(signup_form.user_rtx.$invalid && !signup_form.user_rtx.$dirty){
                    return 'RTX英文名必须填写';
                }else if(signup_form.user_nice_name.$invalid && !signup_form.user_nice_name.$dirty){
                    return '用户昵称必须填写';
                }else if(signup_form.user_name.$invalid && !signup_form.user_name.$dirty){
                    return '真实姓名必须填写';
                }else if(signup_form.user_leave_department.$invalid && !signup_form.user_leave_department.$dirty){
                    return '单飞部门必须填写';
                }else if(signup_form.user_leader.$invalid && !signup_form.user_leader.$dirty){
                    return '部门GM必须填写';
                }
            },
            project : function(project_form){
                if(project_form.project_financing.$invalid && !project_form.project_financing.$pristine){
                    return '融资金额必须是数字！';
                }else if(project_form.project_financing.$invalid && !project_form.project_financing.$dirty){
                    return '融资金额必须填写！';
                }else if(project_form.project_name.$invalid && !project_form.project_name.$dirty){
                    return '项目名称必须填写！';
                }else if(project_form.project_founder.$invalid && !project_form.project_founder.$dirty){
                    return '创始人必须填写！';
                }else if(project_form.project_founder_intro.$invalid && !project_form.project_founder_intro.$dirty){
                    return '创始人介绍必须填写！';
                }else if(project_form.project_user_num.$invalid && !project_form.project_user_num.$dirty){
                    return '团队人数必须填写！';
                }else if(project_form.datepicker.$invalid && !project_form.datepicker.$dirty){
                    return '创业时间必须填写！';
                }else if(project_form.project_brief.$invalid && !project_form.project_brief.$dirty){
                    return '一句话描述项目 必须填写！';
                }else if(project_form.project_intro.$invalid && !project_form.project_intro.$dirty){
                    return '项目介绍必须填写！';
                }
            },
            services : function(services_form){
                if(services_form.services_organization_name.$invalid && !services_form.services_organization_name.$dirty){
                    return '组织名称必须填写！';
                }else if(services_form.services_content.$invalid && !services_form.services_content.$dirty){
                    return '可提供的服务必须填写！';
                }else if(services_form.services_client.$invalid && !services_form.services_client.$dirty){
                    return '代表客户必须填写！';
                }else if(services_form.services_organization_intro.$invalid && !services_form.services_organization_intro.$dirty){
                    return '组织简介必须填写！';
                }
            },
            cv : function(cv_form){
                if(cv_form.cv_qq.$invalid && !cv_form.cv_qq.$pristine){
                    return 'QQ必须是数字！';
                }else if(cv_form.cv_en_name.$invalid && !cv_form.cv_en_name.$dirty){
                    return '英文名必须填写！';
                }else if(cv_form.cv_ch_name.$invalid && !cv_form.cv_ch_name.$dirty){
                    return '中文名必须填写！';
                }else if(cv_form.cv_birth.$invalid && !cv_form.cv_birth.$dirty){
                    return '出生年月必须填写！';
                }else if(cv_form.cv_email.$invalid && !cv_form.cv_email.$dirty){
                    return '邮箱必须填写！';
                }else if(cv_form.cv_qq.$invalid && !cv_form.cv_qq.$dirty){
                    return 'QQ必须填写！';
                }else if(cv_form.cv_wx.$invalid && !cv_form.cv_wx.$dirty){
                    return '微信号必须填写！';
                }else if(cv_form.cv_education.$invalid && !cv_form.cv_education.$dirty){
                    return '教育背景必须填写！';
                }
            }
        };
    });
;


