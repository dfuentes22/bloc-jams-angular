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

// Controllers

blocJams.controller('Landing.controller', ['$scope', function($scope){
  $scope.tagline = "Turn the Music Up!";  
}]);

blocJams.controller('Collection.controller', ['$scope', function($scope){
    $scope.albums = [];
    for(i = 0; i < 12; i++){
        $scope.albums.push(angular.copy(albumPicasso));
    }
}]);

blocJams.controller('Album.controller', ['$scope','SongPlayer', function($scope, SongPlayer){
    $scope.album = albumPicasso;
    $scope.pauseSong = function(song) {
        SongPlayer.pause();
    };
    $scope.playSong = function(song) {
        SongPlayer.setSong($scope.album, song);  
    };
}]);

// Services

blocJams.service('SongPlayer', function() {
    
    var currentSoundFile = null;
    
    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    
    // Create variables in the global scope to hold current song/album information
    
    
    return {
        currentAlbum: null,
        currentlyPlayingSongNumber: null,
        currentVolume: 80,
        currentSongFromAlbum: null,
        
        play: function() {
            currentSoundFile.play();
            this.playing = true;
        },
        
        pause: function() {
            currentSoundFile.pause();
            this.playing = false;
        },
        
        setSong: function(album, song) {
            console.log(song);
    
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            
            this.currentAlbum = album;
            this.currentSongFromAlbum = song;
            
            
            currentSoundFile = new buzz.sound(this.currentSongFromAlbum.audioUrl, {
            // #2
                formats: [ 'mp3' ],
                preload: true
            });
    
            // setVolume(currentVolume);
            
            this.play();
        }
    }
});
                    