/*	
		=========================================================================================
 		*
		*	CustomVideoJS
 		*
 		=========================================================================================
		*----------------------------------------------------------------------------------------
 		*
 		*	Custom videoJS player for desktop / mobile
 		*
 		=========================================================================================
		*
		*   author          >>  Christopher Miles
		*   title			>>  Principal Creative Engineer, Labs @ DigitasLBi
		*   site            >>  www.ChristopherMil.es
		*   created         >>  14 Jan 2014
		*   updated         >>  14 Jan 2014
		*
		=========================================================================================
*/

//===============================================================================================
//----------------------------------------------------------------------------------------------- DO IT

var videoPlayer;

$( document ).ready( function() {
	
	//_.console.create( { width: 300 } );
	videoPlayer = new CustomVideoJS( 'di-video-player' );
	
	videoPlayer.$progressBar = $( '#video-controls-bar-progress' );
	videoPlayer.$scrubber = $( '#video-controls-scrubber' );
	videoPlayer.$playIcon = $( '#video-controls-btn-play' );
	videoPlayer.$pauseIcon = $( '#video-controls-btn-pause' );
	
	videoPlayer.$scrubberOver = $( '#video-controls-scrubber-over' );
	videoPlayer.$scrubberUnder = $( '#video-controls-scrubber-under' );
	
	videoPlayer.$marker = $( '#video-marker-title_' );
	videoPlayer.$markerTitle = $( '#video-marker-title' );
	videoPlayer.$markerTitle_ = $( '#video-marker-title_' );
	
	videoPlayer.create({
		
		playPauseBtn : '#video-controls-btn',
		
		ready : function( player ) {
			//player.play();
		},
		
		play : function( player ) {
			player.$playIcon.css( 'display', 'none' );
			player.$pauseIcon.css( 'display', 'block' );
		},
		
		pause : function( player ) {
			player.$pauseIcon.css( 'display', 'none' );
			player.$playIcon.css( 'display', 'block' );
		},
		
		playing : function( player ) {
			var p = Math.floor( player.currentPercent * 100 ) + '%';
			player.$scrubber.css( 'left', p );
			
			//console.log( player.currentTime );
		},
		
		buffering : function( player ) {
			var p = Math.ceil( player.percentLoaded * 100 ) + '%';
			player.$progressBar.css( 'width', p );
		}
		
	});
	
	videoPlayer.showMarker = function() {
		this.$scrubberOver.animate( { width: 20, height: 20, 'margin-top': -10, 'margin-left': -10 }, 200, 'easeOutQuad' );
		this.$scrubberUnder.animate( { width: 60, height: 60, 'margin-top': -30, 'margin-left': -30 }, 200, 'easeOutQuad' );
		this.$marker.delay( 100 ).animate( { top: 0, opacity: 1 }, 200, 'easeOutQuad' );
	};
	
	videoPlayer.hideMarker = function() {
		this.$marker.animate( { top: 30, opacity: 0 }, 100, 'easeOutQuad' );
		this.$scrubberOver.animate( { width: 34, height: 34, 'margin-top': -17, 'margin-left': -17 }, 100, 'easeOutQuad' );
		this.$scrubberUnder.animate( { width: 20, height: 20, 'margin-top': -10, 'margin-left': -10 }, 100, 'easeOutQuad' );
	};
	
	videoPlayer.updateMarker = function( title ) {
		this.$markerTitle.html( title );
		var w = title.length * 12;
		this.$marker.css( { width: w, 'margin-left': -w >> 1 } );
	};
	
	videoPlayer.barWidth = $( window ).width() - 60 - 10 - 100 - 17;
	
	videoPlayer.$bar = $( '#video-controls-bar_' );
	videoPlayer.$bar.css( { width: videoPlayer.barWidth } );
	
	videoPlayer.scrubber( '#video-controls-scrubber', {
		axis			: 'x',
		containment		: 'parent',
		cursor			: 'move',
		
		drag: function( event, ui ) {
			var posX = videoPlayer.$scrubber.position().left;
			var perc = posX / videoPlayer.barWidth ;
			
			if ( videoPlayer.MOBILE && perc > videoPlayer.percentLoaded ) {
				
				videoPlayer.$scrubber.trigger( 'mouseup' );
				
				var l = videoPlayer.percentLoaded * videoPlayer.barWidth;
				videoPlayer.$scrubber.css( { left: l });
				return;
			};
			
			videoPlayer.seekToPercent( perc );
			videoPlayer.$marker.css( { left: videoPlayer.$scrubber.position().left } );
		},
		
		stop : function( event, ui ) {
			videoPlayer.hideMarker();
		},
		
		onMarker : function( player, marker ) {
			console.log( "ON" );
			player.showMarker();
		},
		
		offMarker : function( player ) {
			console.log( "OFF" );
			player.hideMarker();
		}
	});
	
	videoPlayer.addMarker( 10, {
		name : 'The Rise',
		hitFirst : function( player, marker ) {
			//console.log( 'hitFirst', marker.name );
		},
		hit : function( player, marker ) {
			//console.log( 'hit', marker.name );
		},
		
		scrubbedOn : function( player, marker ) {
			//console.log( 'scrubbedOn', marker.name );
			player.updateMarker( marker.name );
			
		},
		
		scrubbedOff : function( player, marker ) {
			//console.log( 'scrubbedOff', marker.name );
		},
		
		scrubbedOnStop : function( player, marker ) {
			//console.log( 'scrubbedOnStop', marker.name );
			player.stop();
		}
	});
	
	videoPlayer.addMarker( 25, {
		name : 'The Crash',
		hitFirst : function( player, marker ) {
			console.log( 'hitFirst', marker.name );
		},
		hit : function( player, marker ) {
			console.log( 'hit', marker.name );
		},
		
		scrubbedOn : function( player, marker ) {
			console.log( 'scrubbedOn', marker.name );
			player.updateMarker( marker.name );
			
		},
		
		scrubbedOff : function( player, marker ) {
			console.log( 'scrubbedOff', marker.name );
		},
		
		scrubbedOnStop : function( player, marker ) {
			console.log( 'scrubbedOnStop', marker.name );
			
		}
	});
	
	videoPlayer.addMarker( 40, {
		name : 'Recovery',
		hitFirst : function( player, marker ) {
			console.log( 'hitFirst', marker.name );
		},
		hit : function( player, marker ) {
			console.log( 'hit', marker.name );
		},
		
		scrubbedOn : function( player, marker ) {
			console.log( 'scrubbedOn', marker.name );
			player.updateMarker( marker.name );
			
		},
		
		scrubbedOff : function( player, marker ) {
			console.log( 'scrubbedOff', marker.name );
		},
		
		scrubbedOnStop : function( player, marker ) {
			console.log( 'scrubbedOnStop', marker.name );
			
		}
	});
	
});



var CustomVideoJS = function( id ) {
	
	videojs.options.flash.swf 	= 'video-js.swf';
	
	if ( window ) {
		window.PLAYBACK_SPEED = {
			HALF			: 0.5,
			NORMAL			: 1.0,
			DOUBLE			: 2.0,
			FASTEST			: 4.0,
			REVERSE			: 1.0,
			REVERSE_HALF	: 0.5
		};
	}
	
	//
	
	this.id 				= id;
	this.options 			= null;
	
	this.MOBILE				= false;
	this.INIT				= false;
	
	//
	
	this.duration			= 0;
	this.volume				= 1;
	
	this.percentLoaded		= 0;
	
	this.playbackRate		= 1.0;
	
	this.currentPercent		= 0;
	this.currentTime		= 0;
	
	this.playing			= false;
	this.userAction			= false;
	
	this.scrubberOptions	= {};
	this.scrubbing			= false;
	this.$_scrubber			= null;
	
	//
	
	this.ready				= false;
	this.player				= null;
	this.video				= null;
	
	//
	
	this.markers			= [];
	this.markersReady		= false;
	
	this.onMarker			= false;
	this._onMarker			= false;
	
	//
	
	this.create				= function( options ) {
		
		var self = this;
		this.options = options || {};
		
		if ( videojs._CustomVideoJS_IS_MOBILE != undefined ) {
			this.MOBILE = videojs._CustomVideoJS_IS_MOBILE;
		} else {
			this.MOBILE = videojs.TOUCH_ENABLED;
			videojs._CustomVideoJS_IS_MOBILE = videojs.TOUCH_ENABLED;
			videojs.TOUCH_ENABLED = false;
		}
		
		if ( options.pathFlashSWF ) videojs.options.flash.swf = options.pathFlashSWF;
		
		//
		
		this.handle.customVideoJS = this;
		
		this.player = videojs( this.id, { nativeControlsForTouch: false, bigPlayButton: false });
		this.player.customVideoJS = this;
		
		setTimeout( function() {
			
			if ( !self.MOBILE ) {
				self.play();
				setTimeout( function() { self.pause(); self.INIT = true; self.handle.ready(); }, 1 );
			} else {
				self.INIT = true;
				self.handle.ready();
			}
			
			
		}, 1000 );
		
		//
		
		this.play = function() {
			self.userAction = true;
			self.player.play();
		};
		
		this.stop = function() {
			self.userAction = true;
			self.player.pause();
		};
		
		this.pause = function() {
			self.userAction = true;
			self.player.pause();
		};
		
		this.setVolume = function( v ) {
			if ( v < 0 ) {
				self.say( 'volume MIN = 0.0' );
				v = 0;
			} else if ( v > 1 ) {
				self.say( 'volume MAX = 1.0' );
				v = 1;
			}
			self.volume = v;
			self.player.volume( v );
		};
		
		this.seekToPercent = function( t ) {
			if ( t > 1 ) {
				self.say( 'seekToPercent MAX = 1.0' );
				return;
			}
			self.currentPercent = t;
			self.currentTime = t * self.duration;
			self.player.currentTime( self.currentTime );
		};
		
		this.seekToTime = function( t ) {
			if ( t > self.duration ) {
				self.say( 'seekToTime MAX = video duration' );
				return;
			}
			self.currentTime = t;
			self.currentPercent = t / self.duration;
			self.player.currentTime( t );
		};
		
		this.togglePlayPause = function() {
			self.handle.togglePlayPause();
		};
		
		this.playbackSpeed = function( r ) {
			if ( !self.video ) return;
			if ( r > 4 ) self.say( 'WARNING: audio might not work if playbackRate > 4' );
			this.playbackRate = r;
			self.video.playbackRate = r;
		};
		
		
		//
		
		$( '.vjs-big-play-button' ).css( 'display', 'none' );
		$( '.vjs-control-bar' ).css( 'display', 'none' );
		
		//
		
		this.player.on( 'play', this.handle.play );
		this.player.on( 'pause', this.handle.pause );
		this.player.on( 'ended', this.handle.ended );
		
		if ( this.options.playPauseBtn ) $( this.options.playPauseBtn ).click( function() {
			self.handle.togglePlayPause();
		} );
		
		//
		
		this.player.on( 'timeupdate', function( e ) {
			if ( self.scrubbing ) return;
			
			self.currentPercent = e.target.currentTime / e.target.duration;
			if ( isNaN( self.currentPercent ) ) return;
			
			if ( self.currentPercent > .99 ) {
				self.currentPercent = 1;
				self.currentTime = e.target.duration;
			} else {
				self.currentTime = self.currentPercent * e.target.duration;
			}
			
			self.handle.playing();
			
			if ( !self.markersReady && self.currentPercent != 0 ) {
        		
        		for ( var i = 0, len = self.markers.length; i < len; i ++ ) {
        			self.markers[i].init( self.currentPercent, e.target.duration, self );
        		}
        		self.markersReady = true;
        	}
		});
		
        this.player.on( 'progress', function( e ) {
        	if ( e.target.buffered.length < 1 ) return;
        	
        	self.percentLoaded = e.target.buffered.end( 0 ) / e.target.duration;
        	if ( self.percentLoaded > .99 ) self.percentLoaded = 1;
        	
        	self.handle.buffering();
        });
        
        this.player.on( 'durationchange', function( e ) {
        	self.duration = e.target.duration;
        	self.video = e.target;
        });
        
        this.say = function( msg ) {
        	if ( console && console.log ) {
        		console.log( '[CustomVideoJS] ' + msg );
        	}
        };
        
	};
	
	this.addMarker = function( time, options ) {
		
		var m = new CustomVideoJSMarker( time, options, this );
		
		this.markers.push( m );
		
	};
	
	this.scrubber = function( el, options ) {
		
		options._scrubbedOn = false;
		
		this.scrubberOptions = options;
		
		var self = this;
		
		this.$_scrubber = $( el );
		
		if ( options.start ) {
			this.scrubberOptions._start = this.scrubberOptions.start;
			this.scrubberOptions.start = function( event, ui ) {
				if ( self.MOBILE && !self.ready ) {
					self.$_scrubber.trigger( 'mouseup' );
					setTimeout( function() { self.$_scrubber.css( ui.originalPosition ); }, 1 );
					return;
				}
				self.scrubbing = true;
				self.onMarker = false;
				self.scrubberOptions._start();
			};
		} else {
			this.scrubberOptions.start = function( event, ui ) {
				if ( self.MOBILE && !self.ready ) {
					self.$_scrubber.trigger( 'mouseup' );
					setTimeout( function() { self.$_scrubber.css( ui.originalPosition ); }, 1 );
					return;
				}
				self.scrubbing = true;
				self.onMarker = false;
			};
		}
		
		if ( options.drag ) {
			this.scrubberOptions._drag = this.scrubberOptions.drag;
			this.scrubberOptions.drag = function() {
				if ( !self.ready ) return;
				self.scrubberOptions._drag();
				
				if ( self.markersReady ) {
					self.onMarker = false;
					
					for ( var i = 0, len = self.markers.length; i < len; i ++ ) {
						 self.markers[i].checkScrub( self );
					}
					
					if ( !self.onMarker && self._onMarker ) {
						self._onMarker = false;
						if ( self.scrubberOptions.offMarker ) self.scrubberOptions.offMarker( self );
					}
				}
			};
		} else {
			this.scrubberOptions.drag = function() {
				if ( !self.ready ) return;
				
				if ( self.markersReady ) {
					self.onMarker = false;
					
					for ( var i = 0, len = self.markers.length; i < len; i ++ ) {
						 self.markers[i].checkScrub( self );
					}
					
					if ( !self.onMarker && self._onMarker ) {
						self._onMarker = false;
						if ( self.scrubberOptions.offMarker ) self.scrubberOptions.offMarker( self );
					}
				}
			};
		}
		
		if ( options.stop ) {
			this.scrubberOptions._stop = this.scrubberOptions.stop;
			this.scrubberOptions.stop = function() {
				if ( !self.ready ) return;
				self.scrubbing = false;
				
				if ( self.markersReady ) {
					for ( var i = 0, len = self.markers.length; i < len; i ++ ) {
						 self.markers[i].checkScrub( self, true );
					}
				}
				self.scrubberOptions._stop();
				if ( !self.playing && !self.userAction ) self.play();
			};
		} else {
			this.scrubberOptions.stop = function() {
				if ( !self.ready ) return;
				self.scrubbing = false;
				if ( self.markersReady ) {
					for ( var i = 0, len = self.markers.length; i < len; i ++ ) {
						 self.markers[i].checkScrub( self, true );
					}
				}
				if ( !self.playing && !self.userAction ) self.play();
			};
		}
		
		this.$_scrubber.draggable( this.scrubberOptions );
		
	};
	
	this.handle = {
		
		ready : function() {
			if ( !this.customVideoJS.ready ) {
				this.customVideoJS.ready = true;
				if ( this.customVideoJS.options.ready ) this.customVideoJS.options.ready( this.customVideoJS );
			}
			
		},
		
		init	: function( self ) {
			if ( self.options.init ) self.options.init( self );
		},
		
		playing : function() {
			var c = this.customVideoJS;
			if ( c.options.playing ) c.options.playing( c );
			
			if ( !c.markersReady ) return;
			for ( var i = 0, len = c.markers.length; i < len; i++ ) {
				c.markers[ i ].update( c );
			}
		},
		
		togglePlayPause : function() {
			
			var c = this.customVideoJS;
				c.userAction = true;
			
			if ( !c.playing ) c.player.play(); 
			else c.player.pause();
			
		},
		
		buffering : function() {
			
			if ( this.customVideoJS.options.buffering ) this.customVideoJS.options.buffering( this.customVideoJS ); 
			
		},
		
		play : function() {
			//console.log( 'play' );
			
			var c = this.customVideoJS;
			
			if ( !c.INIT ) return;
				c.playing = true;
			
			if ( c.options.play )  c.options.play( c ); 
			
			//Video.player.play();
			c.userAction = false;
		},
		
		pause : function() {
			//console.log( 'pause' );
			
			var c = this.customVideoJS;
			if ( !c.INIT ) return;
				c.playing = false;
			
			//Video.player.pause();
			if ( c.options.pause ) c.options.pause( c );
			
			// buffering - try to keep playing
			if ( !c.userAction && c.percentLoaded != 1 ) c.play();
			
			c.userAction = false;
		},
		
		ended : function() {
			//console.log( 'ended' );
			
			var c = this.customVideoJS;
				c.playing = false;
			
			if ( c.options.finishedPlaying ) c.options.finishedPlaying( c );
			
		}
		
	};
	
	var CustomVideoJSMarker = function( time, options ) {
		
		this.time 			= time;
		this.percentage 	= true;
		
		// we're automatically assuming if ( time < 1 ) then it's percentage based
		// if not it's time based
		if ( time > 1 ) this.percentage = false;
		
		// if ( time < 1 ) and user wants it to be time based they should set timeIsPercent: false
		if ( options.timeIsPercent != undefined ) this.percentage = options.timeIsPercent;
		
		this._hitFirst 		= false;
		this._hit			= false;
		this._scrubbedOn	= false;
		
		for ( var key in options ) {
			this[key] = options[key];
		}
		
		this.init = function( percentageChange, duration, playerRef ) {
			//console.log( 'percentageChange: ' + percentageChange );
			//console.log( 'duration: ' + duration );
			
			if ( playerRef.MOBILE && percentageChange < .005 ) percentageChange = .005;
			if ( !playerRef.MOBILE && percentageChange > .01 ) percentageChange = .005;
			
			if ( this.percentage ) {
				
				this.startTimeHit = this.time - percentageChange;
				
				this.update = function( player ) {
					
					if ( player.currentPercent > this.time ) {
						
						if ( this._hit ) this._hit = false;
						
					} else if ( player.currentPercent > this.startTimeHit ) {
						
						if ( !this._hit ) {
							
							if ( !this._hitFirst ){
								this._hitFirst = true;
								if ( this.hitFirst ) this.hitFirst( player, this );
							}
							
							this._hit = true;
							if ( this.hit ) this.hit( player, this );
						}
						
					}
				};
				
				this.startTimeScrub = this.time - ( percentageChange * 1.5 );
				this.endTimeScrub 	= this.time + percentageChange;
				
				this.checkScrub = function( player, onStop ) {
					
					if ( player.currentPercent > this.startTimeScrub ) {
						if ( player.currentPercent < this.endTimeScrub ) {
							player.onMarker = true;
							
							if ( !player._onMarker ) {
								player._onMarker = true;
								if ( player.scrubberOptions.onMarker ) player.scrubberOptions.onMarker( player, this );
							}
							if ( onStop ) {
								if ( this.scrubbedOnStop ) this.scrubbedOnStop( player, this );
							} else {
								if ( !this._scrubbedOn ) {
									this._scrubbedOn = true;
									if ( this.scrubbedOn ) this.scrubbedOn( player, this );
								}
							}
						} else {
							if ( this._scrubbedOn ) {
								this._scrubbedOn = false;
								if ( this.scrubbedOff ) this.scrubbedOff( player, this );
							}
						}
					} else {
						if ( this._scrubbedOn ) {
							this._scrubbedOn = false;
							if ( this.scrubbedOff ) this.scrubbedOff( player, this );
						}
					}
				};
			} else {
				
				this.startTimeHit = this.time - ( percentageChange * duration );
				//console.log( 'startTimeHit: ' + this.startTimeHit );
				
				this.update = function( player ) {
					
					if ( player.currentTime > this.time ) {
						
						if ( this._hit ) this._hit = false;
						
						
					} else if ( player.currentTime > this.startTimeHit ) {
						
						if ( !this._hit ) {
							
							if ( !this._hitFirst ) {
								this._hitFirst = true;
								if ( this.hitFirst ) this.hitFirst( player, this );
							}
							
							this._hit = true;
							if ( this.hit ) this.hit( player, this );
						}
						
					}
				};
				
				this.startTimeScrub = this.time - ( percentageChange * 1.5 * duration );
				this.endTimeScrub 	= this.time + ( percentageChange * duration );
				
				this.checkScrub = function( player, onStop ) {
					
					if ( player.currentTime > this.startTimeScrub ) {
						if ( player.currentTime < this.endTimeScrub ) {
							player.onMarker = true;
							
							if ( !player._onMarker ) {
								player._onMarker = true;
								if ( player.scrubberOptions.onMarker ) {
									player.scrubberOptions.onMarker( player, this );
								}
							}
							if ( onStop ) {
								if ( this.scrubbedOnStop ) this.scrubbedOnStop( player, this );
							} else {
								if ( !this._scrubbedOn ) {
									this._scrubbedOn = true;
									if ( this.scrubbedOn ) this.scrubbedOn( player, this );
								}
								
							}
						} else {
							if ( this._scrubbedOn ) {
								this._scrubbedOn = false;
								if ( this.scrubbedOff ) this.scrubbedOff( player, this );
							}
						}
					} else {
						if ( this._scrubbedOn ) {
							this._scrubbedOn = false;
							if ( this.scrubbedOff ) this.scrubbedOff( player, this );
						}
					}
				};
				
			}
			
		};
		
		
	};
	
};