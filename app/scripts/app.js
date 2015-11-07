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
}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.songPlayer = SongPlayer;
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
    
    $scope.volumeClass = function() {
    return {
      'fa-volume-off': SongPlayer.volume == 0,
      'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
      'fa-volume-up': SongPlayer.volume > 70
    }
  }

  SongPlayer.onTimeUpdate(function(event, time) {
    $scope.$apply(function(){
      $scope.playTime = time;
    });
  });

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
        currentVolume: 30,
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
        seek: function(time) {
            // Checks to make sure that a sound file is playing before seeking.
            if(currentSoundFile) {
            // Uses a Buzz method to set the time of the song.
            currentSoundFile.setTime(time);
            }
        },
        onTimeUpdate: function(callback) {
            return $rootScope.$on('sound:timeupdate', callback);
        },
        getTimePos: function() {
            if (currentSoundFile) {
                currentSoundFile.bind('timeupdate', function() {
                    return this.getTime() / this.getDuration();
                });
            }
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
            
            currentSoundFile.bind('timeupdate', function(e){
                $rootScope.$broadcast('sound:timeupdate', this.getTime());
            });
            
            this.play();
            this.setVolume(this.currentVolume);
        }
    };
}]);

//Directives
  
blocJams.directive('slider', ['$document', function($document){

  var calculateSliderPercentFromMouseEvent = function($slider, event) {
    var offsetX = event.pageX - $slider.offset().left;
    var sliderWidth = $slider.width();
    var offsetXPercent = (offsetX / sliderWidth);
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
  }

  return {
    templateUrl: '/templates/directives/slider.html',
    restrict: 'E',
    replace: true,
    scope: {
      onChange: '&'
    },
    link: function(scope, element, attributes) {
      scope.value = 0;
      scope.max = 100;
      var $seekBar = $(element);

      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0);
      });

      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });

      var numberFromValue = function(value, defaultValue) {
        if (typeof value === 'number') {
          return value;
        }

        if (typeof value === 'undefined') {
          return defaultValue;
        }

        if (typeof value === 'string') {
          return Number(value);
        }
      }

      var percentString = function() {
        var value = scope.value || 0;
        var max = scope.max || 100;
        percent = value / max * 100;
        return percent + "%";
      }

      scope.fillStyle = function() {
        return {width: percentString()};
      }

      scope.thumbStyle = function() {
        return {left: percentString()};
      }

      scope.onClickSlider = function(event) {
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.value = percent * scope.max;
        notifyCallback(scope.value);
      }

      scope.trackThumb = function() {
        $document.bind('mousemove.thumb', function(event){
          var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
          scope.$apply(function(){
            scope.value = percent * scope.max;
            notifyCallback(scope.value);
          });
        });

        $document.bind('mouseup.thumb', function() {
          $document.unbind('mousemove.thumb');
          $document.unbind('mouseup.thumb');
        });
      };

      var notifyCallback = function(newValue) {
        if (typeof scope.onChange === 'function') {
          scope.onChange({value: newValue});
        }
      };
    }
  };
}]);

blocJams.filter('timecode', function () {
    return function (timeInSeconds) {
    var time = parseFloat(timeInSeconds);
    
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    var output = minutes + ':';

    if (seconds < 10) {
      output += '0';
    }

    output += seconds;

    return output;
    };
});

