var blocJams = angular.module('blocJams', ['ui.router']);

blocJams.config(function($stateProvider, $locationProvider) {
 
    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
    });
    
    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })

});

blocJams.controller('Landing.controller', ['$scope', function($scope){
  $scope.tagline = "Turn the Music Up!";  
}]);

blocJams.controller('Collection.controller', ['$scope', function($scope){
    $scope.albums = [];
    for(i = 0; i < 12; i++){
        $scope.albums.push(angular.copy(albumPicasso));
    }
}]);

blocJams.controller('Album.controller', ['$scope', function($scope){
  $scope.albums = albumPicasso;  
}]);
                    