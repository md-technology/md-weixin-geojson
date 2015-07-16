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
                        url: '^/{userName}/{albumName}',
                        templateUrl: 'geojson/display.tpl.html',
                        controller: 'GeojsonCtrl',
                        resolve: {
                            album: ['$stateParams', 'Albums', function ($stateParams, Albums) {
                                return Albums.getBy($stateParams.userName, $stateParams.albumName);
                            }]
                        }
                    })
                ;
            }])
        .controller('GeojsonCtrl', ['$scope', '$log', '$timeout', 'album', 'ClusterControl', '$FeatureCollection', GeojsonCtrl])
        .factory('$FeatureCollection', [function () {
            return {
                tranform: tranform,
                detransform: detransform
            };

            function tranform(featureCollection) {
                var features = [];
                for(var i in featureCollection.features) {
                    var feature = featureCollection.features[i];
                    var newFeature = {
                        type: feature.type,
                        properties: feature.properties||{},
                        geometry: feature.geometry
                    };
                    if(newFeature.properties.style && angular.isObject(newFeature.properties.style)) {
                        newFeature.properties.style = JSON.stringify(newFeature.properties.style);
                    }
                    if(feature.id) {
                        newFeature.id = feature.id;
                    }
                    features.push(newFeature);
                }
                var fc = {
                    type: featureCollection.type,
                    properties: angular.copy(featureCollection.properties)||{},
                    features: features
                };
                if(fc.properties.style) {
                    fc.properties.style = JSON.stringify(fc.properties.style);
                }
                return fc;
            }

            function detransform(featureCollection) {
                featureCollection = featureCollection || {
                        type: 'FeatureCollection',
                        properties: {style: {}},
                        features: []
                    };
                if(angular.isString(featureCollection.properties.style)) {
                    featureCollection.properties.style =
                        JSON.parse(featureCollection.properties.style);
                }
                angular.forEach(featureCollection.features, function(feature, key) {
                    if(feature.properties && feature.properties.style &&
                        angular.isString(feature.properties.style)) {
                        feature.properties.style = JSON.parse(feature.properties.style);
                    }
                });

                return featureCollection;
            }
        }])
    ;

    var LOG_TAG = "GeoJSON: ";
    function GeojsonCtrl($scope, $log, $timeout, album, ClusterControl, $FeatureCollection) {
        var clusterControl;
        $scope.setPageTitle(album.title);
        if(album.map) {
            $scope.setBaseLayer(album.map);
        }
        if(album.featureCollection) {
            album.featureCollection = $FeatureCollection.detransform(album.featureCollection);
            setGeoJson(album.featureCollection);
        }
        addCluster(album);

        function addCluster(album) {
            $scope.getMap().then(function(map) {
                clusterControl = new ClusterControl(map, album.title);
                clusterControl.addPhotos(album.photos);
            });
        }

        function setGeoJson(geojson) {
            try {
                $scope.setGeojson({
                    data: geojson,
                    style: function (feature) {
                        return angular.extend({}, geojson.properties.style, feature.properties.style);
                    },
                    resetStyleOnMouseout: true,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(buildPopup(feature.properties)[0]);
                    }
                });

            } catch (ex) {
                $log.debug(LOG_TAG + ex);
            } finally {
            }
        }

        function buildPopup(properties) {
            var html = angular.element('<table></table>');
            for(var name in properties) {
                if(name != "style") {
                    var row = angular.element('<tr></tr>');
                    var propName = angular.element('<td>'+name+':</td>');
                    var propValue = angular.element('<td>'+properties[name]+'</td>');
                    row.append(propName);
                    row.append(propValue);
                    html.append(row);
                }
            }
            return html;
        }

        $scope.$on('leafletDirectiveMap.geojsonCreated', function(e, geoJSON) {
            var bounds = geoJSON.getBounds();
            if(bounds.isValid()) {
                $scope.getMap().then(function(map) {
                    // 页面转向时fitBounds会不起作用，不知道原因，暂时先用延时
                    $timeout(function() {
                        map.fitBounds(bounds);
                    },1000);
                });
            }
        });
    }

})();