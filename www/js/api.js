'use strict';

angular.module('app.services', ['ngResource'])
    .factory('restApi', function ($resource) {

        var RestApi  = {},
            BATEURL = 'http://localhost/github/danfei/server/php/';

        RestApi.Job = $resource(BATEURL + 'jobs/:id',{},{
            'query': { method: 'GET',isArray:true},
            'getOne':{method:'GET',params:{}},
            'update':{method:'PATCH'},
            'save':{method:'POST'},
            'delete':{method:'DELETE'}
        });

        return RestApi;
    });
