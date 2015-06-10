/**
 * Created by tiwen.wang on 6/10/2015.
 */
(function() {

    'use strict';

    angular.module('app.core', ['restangular'])
        //.value('serverBaseUrl', 'http://localhost:8080')
        .value('serverBaseUrl', 'http://www.photoshows.cn')
        .factory('ApiRestangular', ['Restangular', 'serverBaseUrl',
            function(Restangular, serverBaseUrl) {
                return Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(serverBaseUrl+'/api/rest');
                });
            }])
        .factory('GeoJSONs', ['ApiRestangular', GeoJSONServiceFactory]);

    function GeoJSONServiceFactory(Restangular) {
        var service = Restangular.service('geojson');

        return {
            create: create,
            get: getGeoJSON,
            update: update,
            search: search,
            my: my
        };

        function create(geoJSON) {
            return service.post(geoJSON);
        }

        function getGeoJSON(id) {
            return service.one(id).get();
        }

        function update(geoJSON) {
            return service.one().post(geoJSON.id, geoJSON);
        }

        function search(query, page, size) {
            return service.one().get({query: query, page: page, size: size});
        }

        function my(page, size) {
            return service.one('my').get({page: page, size: size});
        }
    }
})();