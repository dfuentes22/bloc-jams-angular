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
    $scope.playSong = function(song) {
        SongPlayer.setSong($scope.album, song); 
    };
    
    $scope.previousSong = function(){
        SongPlayer.previousSong();  
    };
    
    $scope.nextSong = function() {
        SongPlayer.nextSong();  
    };
    
    $scope.songPlayer = SongPlayer;

    
}]);

// Services

blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {
    
    var currentSoundFile = null;
    
    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    
    
    return {
        isPlaying: false,
        currentAlbum: null,
        currentVolume: 80,
        currentSongFromAlbum: null,
        
        play: function() {
            this.isPlaying = true;
            currentSoundFile.play();
            console.log(this.isPlaying);
        },
        
        pause: function() {
            currentSoundFile.pause();
            this.isPlaying = false;
        },
        
        setVolume: function(volume){
            if(currentSoundFile) {
                currentSoundFile.setVolume(volume);   
            }
            this.currentVolume = volume;
        },
        
        setSong: function(album, song) {
            console.log(song);
    
            if (currentSoundFile) {
                currentSoundFile.pause();
            }
            
            this.currentAlbum = album;
            this.currentSongFromAlbum = song;
            
            
            currentSoundFile = new buzz.sound(song.audioUrl, {
            // #2
                formats: [ 'mp3' ],
                preload: true
            });
            
            this.play();
            this.setVolume(this.currentVolume);
        },
        
        playButton: function() {
            console.log(song);
    
            if (currentSoundFile) {
                currentSoundFile.pause();
            }
            
            this.currentAlbum = album;
            this.currentSongFromAlbum = song;
            
            
            currentSoundFile = new buzz.sound(song.audioUrl, {
            // #2
                formats: [ 'mp3' ],
                preload: true
            });
            
            this.play();
            this.setVolume(this.currentVolume);
        },
        previousSong: function() {
            var index = trackIndex(this.currentAlbum, this.currentSongFromAlbum);
            index--;
            if (index < 0) {
                index = this.currentAlbum.songs.length - 1;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
        nextSong: function() {
            var index = trackIndex(this.currentAlbum, this.currentSongFromAlbum);
            index++;
            if (index >= this.currentAlbum.songs.length) {
                index = 0;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
        getTimePos: function() {
            if (currentSoundFile) {
                currentSoundFile.bind('timeupdate', function() {
                    return this.getTime() / this.getDuration();
                });
            }
        }
    }
}]);
                    