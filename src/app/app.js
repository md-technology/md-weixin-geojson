angular.module('md-weixin-geojson', [
    'ngMaterial',
    'templates-app',
    'templates-common',
    'ui.router',
    'leaflet-directive',
    'app.core',
    'app.geojson',
    'app.components'
])
//.value('serverBaseUrl', 'http://localhost:8080')
    .value('serverBaseUrl', 'http://www.photoshows.cn')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider) {

            //$locationProvider.html5Mode(false).hashPrefix('!');

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '',
                    template: '<div ui-view flex layout-fill layout="column"></div>',
                    controller: function () {
                    },
                    resolve: {}
                })
            ;
        }])
    .value('staticCtx', 'http://static.photoshows.cn')
    //.value('staticCtx', 'http://test.photoshows.cn')
    .run(['$rootScope', function run($rootScope) {

    }])
    .controller('AppCtrl', ['$rootScope', '$scope', '$log', 'leafletData',
        function AppCtrl($rootScope, $scope, $log, leafletData) {

            $rootScope.$on('$stateChangeStart',
                function (event, viewConfig) {
                    $log.debug("$stateChangeStart");
                    $scope.viewLoading = true;
                });


            $rootScope.$on('$viewContentLoading',
                function (event, viewConfig) {
                    $log.debug("$viewContentLoading");
                    //$scope.viewLoading = true;
                });

            $scope.$on('$viewContentLoaded',
                function (event) {
                    $log.debug("$viewContentLoaded");
                    $scope.viewLoading = false;
                });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $log.debug("$stateChangeSuccess");
                //if ( angular.isDefined( toState.data.pageTitle ) ) {
                //  $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
                //}
            });

            angular.extend($scope, {
                defaults: {},
                options: {
                    drawControl: true
                    //editable: true
                }
            });

            angular.extend($scope, {
                center: {
                    lat: 34,
                    lng: 110,
                    zoom: 6
                },
                layers: {
                    baselayers: {},
                    overlays: {}
                }
            });

            var controlLayers = L.control.layersManager({}, {}, {autoZIndex: false});
            controlLayers.addMap({
                id: "1",
                name: "高德地图",
                baseLayer: 'AMap.Base'
            });

            leafletData.getMap('main-map').then(function (map) {
                controlLayers.addTo(map);
            });

            $scope.setBaseLayer = function (map) {
                controlLayers.addMap(map);
            };

            $scope.geojson = {};
            $scope.setGeojson = function (geojson) {
                $scope.geojson = geojson;
            };

            $scope.getMap = function () {
                return leafletData.getMap('main-map');
            };

            $scope.setPageTitle = function (title) {
                $scope.pageTitle = title;
            };


        }])

;

