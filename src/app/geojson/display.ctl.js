/**
 * Created by tiwen.wang on 6/10/2015.
 */
(function () {
    'use strict';
    angular.module('app.geojson', [])
        .config(['$logProvider', '$urlRouterProvider', '$stateProvider',
            function ($logProvider, $urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.geojson', {
                        url: '/{id}',
                        templateUrl: 'geojson/display.tpl.html',
                        controller: 'GeojsonCtrl',
                        resolve: {
                            id: ['$stateParams', function ($stateParams) {
                                return $stateParams.id;
                            }]
                        }
                    })
                ;
            }])
        .controller('GeojsonCtrl', ['$scope', '$log', 'id', 'GeoJSONs', 'leafletData', GeojsonCtrl])
    ;

    var LOG_TAG = "GeoJSON: ";
    function GeojsonCtrl($scope, $log, id, GeoJSONs, leafletData) {

        GeoJSONs.get(id).then(function(geoJSON) {
            $scope.setPageTitle(geoJSON.name);
            if(angular.isString(geoJSON.data)) {
                geoJSON.data = JSON.parse(geoJSON.data);
            }
            if(geoJSON.data.properties &&
                geoJSON.data.properties.style) {
                geoJSON.style = geoJSON.data.properties.style;
            }
            setGeoJson(geoJSON);
        });

        function setGeoJson(geoJSON) {
            try {
                $scope.setGeojson({
                    data: geoJSON.data,
                    style: function (feature) {
                        return angular.extend({}, geoJSON.style, feature.properties.style);
                    },
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(feature.properties.name);
                    }
                });

            } catch (ex) {
                $log.debug(LOG_TAG + ex);
            } finally {
            }

            leafletData.getGeoJSON('main-map').then(function(geoJSON) {
                $scope.getMap().then(function(map) {
                    map.fitBounds(geoJSON.getBounds());
                });

            });
        }
    }

})();