/**
 * Created by tiwen.wang on 6/10/2015.
 */
(function() {

    'use strict';

    angular.module('app.core', ['restangular'])

        .factory('ApiRestangular', ['Restangular', 'serverBaseUrl',
            function(Restangular, serverBaseUrl) {
                return Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(serverBaseUrl+'/api/rest');
                });
            }])
        .factory('GeoJSONs', ['ApiRestangular', GeoJSONServiceFactory])
        .factory('Albums',   ['ApiRestangular', AlbumsServiceFactory]);

    function AlbumsServiceFactory(Restangular) {
        var service = Restangular.service('album');
        return {
            get: get,
            getBy: getBy,
            create: create,
            modify: modify,
            remove: remove,
            setCover: setCover,
            addPhotos: addPhotos,
            removePhotos: removePhotos,
            deletePhotos: deletePhotos,
            modifyFC: modifyFC,
            removeFeature: removeFeature
        };

        function get(id) {
            return service.one(id).get();
        }

        function getBy(username, name) {
            return service.one().get({username: username, name: name});
        }

        function create(album) {
            return service.one().post('', album);
        }

        function modify(id, album) {
            return service.one(id).post('', album);
        }

        function remove(id) {
            return service.one(id).remove();
        }

        function setCover(id, cover) {
            return service.one(id).post('cover', cover);
        }

        function addPhotos(id, photoIds) {
            return service.one(id).post('add', photoIds);
        }

        function removePhotos(id, photoIds) {
            return service.one(id).post('remove', photoIds);
        }

        function deletePhotos(id, photoIds) {
            return service.one(id).post('delete', photoIds);
        }

        function modifyFC(id, fc) {
            return service.one(id).post('fc', fc);
        }

        function removeFeature(id, featureId) {
            return service.one(id).one('fc', featureId).remove();
        }
    }
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