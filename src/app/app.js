angular.module( 'md-weixin-geojson', [
    'templates-app',
    'templates-common',
    'ui.router',
    'leaflet-directive',
    'app.core',
    'app.geojson'
])

.config( ['$stateProvider', '$urlRouterProvider',
      function myAppConfig ( $stateProvider, $urlRouterProvider ) {

          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '',
                  template: '<div ui-view flex layout-fill layout="column"></div>',
                  controller: function(){},
                  resolve: {}
              })
          ;
}])

.run( function run () {
})

.controller( 'AppCtrl', ['$scope', 'leafletData', function AppCtrl ( $scope, leafletData ) {

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            //if ( angular.isDefined( toState.data.pageTitle ) ) {
            //  $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
            //}
          });

        angular.extend($scope, {
            defaults: {
            },
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

      //var layer = L.tileLayer.provider("MapBox.Streets");
      var layer = L.tileLayer.provider("AMap.Base");

      leafletData.getMap('main-map').then(function(map) {
        layer.addTo(map);
      });

        $scope.geojson = {};
        $scope.setGeojson = function(geojson) {
            $scope.geojson = geojson;
        };

        $scope.getMap = function() {
            return leafletData.getMap('main-map');
        };

        $scope.setPageTitle = function(title) {
            $scope.pageTitle = title;
        };

}])

;

