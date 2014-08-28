/**
 * Created by admin on 14-8-28.
 */
angular.module('starter.services', ['starter.constant'])

.service('workServer',function($http,$q,appConfig){
    this.getWorkById = function(id){
        var def = $q.defer();
        $http.get(appConfig.restRoot + 'article.json').success(function(data){
            def.resolve(data);
        });
        return def.promise;
    }
});
