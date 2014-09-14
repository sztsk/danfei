'use strict';

angular.module('app.restApi', ['ngResource'])
    .factory('RestApi', function ($resource) {

        var RestApi  = {},
            BATEURL = 'data/';

        RestApi.Job = $resource(BATEURL + 'article.json',{},{
            getAll: { method: 'GET' },
            update:{method:'PUT',params:{}}
        });

        return RestApi;
    });
