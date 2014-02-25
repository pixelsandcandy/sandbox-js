/*	
		=========================================================================================
 		*
		*	Demand Institute - Housing Data Visualization
 		*
 		=========================================================================================
		*----------------------------------------------------------------------------------------
 		*
 		*	Exploring the data before and after the housing bubble burst .
 		*
 		=========================================================================================
		*
		*   authors         >>  Christopher Miles + Amanda Kassay
		*   				>>  Creative Engineers @ DigitasLBi
		*
		*   created         >>  07 Jan 2013
		*   updated         >>  07 Jan 2013
		*
		=========================================================================================
*/

//===============================================================================================
//----------------------------------------------------------------------------------------------- DO IT

$( document ).ready( function() {
	DI.init();
});


//----------------------------------------------------------------------

var map, tileLayer, markerLayer, gridLayer, gridControl, topPane;

var Layer = {
	
	states: null
	
};


//===============================================================================================
//----------------------------------------------------------------------------------------------- MAPBOX - EXTENSION

var AnimateLayer = function( layer, style, time, tween ) {
	
	layer._fillColor = false;
	layer._fillOpacity = false;
	
	var props;
	
	if ( tween == undefined ) props = {};
	else props = tween;
	
	if ( style.fillColor && layer.options && layer.options.fillColor ) {
		layer._fillColor = true;
		
		var startColor = Utils.hex2rgb( layer.options.fillColor );
		
		layer.fillColorR = startColor.r;
		layer.fillColorG = startColor.g;
		layer.fillColorB = startColor.b;
		
		var endColor = Utils.hex2rgb( style.fillColor );
		
		props.fillColorR = endColor.r;
		props.fillColorG = endColor.g;
		props.fillColorB = endColor.b;
		
	}
	
	if ( style.fillOpacity != undefined && layer.options ) {
		layer._fillOpacity = true;
		
		if ( layer.options.fillOpacity ) layer.fillOpacity = layer.options.fillOpacity;
		else layer.fillOpacity = 0;
		
		props.fillOpacity = style.fillOpacity;
		
	}
	
	props.onUpdate = function() {
		var style = {};
		
		if ( this.target._fillColor ) {
			style.fillColor = Utils.rgb2hex( this.target.fillColorR, this.target.fillColorG, this.target.fillColorB );
		}
		
		if ( this.target._fillOpacity ) {
			style.fillOpacity = Math.round( this.target.fillOpacity * 100 ) * .01;
		}
		
		//console.log( style );
		
		this.target.setStyle( style );
		
	};
	
	TweenLite.to( layer, time, props );
	
};

//---------------------------------------------------------------------- MODIFIER

var Modify = {
	
	Map : function( m ) {
		
		m.addTileLayer = function( mbTiles, name, zIndex ) {
			return L.mapbox.tileLayer( mbTiles ).setZIndex( zIndex ).addTo( this );
		};
		
		m.addMarkerLayer = function( mbTiles, name, zIndex ) {
			return L.mapbox.markerLayer( mbTiles ).setZIndex( zIndex ).addTo( this );
		};
		
		m.addGridLayer = function( mbTiles, name ) {
			return L.mapbox.gridLayer( mbTiles ).addTo( this );
		};
		
		m.addGridControl = function( gridLayer, options ) {
			return L.mapbox.gridControl( gridLayer, options ).addTo( this );
		};
		
		m.removeGroup = function( o ) {
			if ( o.className && o.className == 'InteractiveTileGroup' ) {
				this.removeLayer( o.tileLayer );
				this.removeLayer( o.gridLayer );
				this.removeLayer( o.gridControl );
			}
		};
		
		m.addGroup = function( o ) {
			if ( o.className && o.className == 'InteractiveTileGroup' ) {
				o.tileLayer.addTo( this );
				o.gridLayer.addTo( this );
				o.gridControl.addTo( this );
			}
		};
		
	},
	
	GridControl : function( gc ) {
		
		gc._mouseover = function(o) {
			if ( !this._map ) return;
	        if (o.data) {
	        	
	            L.DomUtil.addClass(this._map._container, 'map-clickable');
	        } else {
	            L.DomUtil.removeClass(this._map._container, 'map-clickable');
	        }
	        
	        
	
	        if (this._pinned) return;
	
	        var content = this._template('teaser', o.data);
	        if (content) {
	            this._show(content, o);
	        } else {
	            this.hide();
	        }
	    };
	    
	    gc._click = function( o ) {
	    	if ( !o || !o.data ) return;
	    	console.log( o );
	    };
		
	},
	
	InteractiveTileGroup : function( itg ) {
		Modify.GridControl( itg.gridControl );
	}
	
};

//---------------------------------------------------------------------- GROUPS

var GridGroup = function( mbTiles, options ){
	var o = {};
	
	o.className = 'GridGroup';
	o.gridLayer = L.mapbox.gridLayer( mbTiles );
	
	if ( options ) o.gridControl = L.mapbox.gridControl( o.gridLayer , options );
	else o.gridControl = L.mapbox.gridControl( o.gridLayer );
	
	return o;
};

var InteractiveTileGroup = function( mbTiles, name, zIndex, options ) {
	
	var o = {};
	
	o.className = 'InteractiveTileGroup';
	o.name = name;
	o.tileLayer = L.mapbox.tileLayer( mbTiles ).setZIndex( zIndex );
	o.tileLayer.tileBundle = o;
	
	var options = options ? options : {};
	
	o.grid = new GridGroup( mbTiles, options );
	o.gridLayer = o.grid.gridLayer;
	o.gridControl = o.grid.gridControl;
	
	o.addTo = function( m ) {
		
		this.tileLayer.addTo( m );
		this.gridLayer.addTo( m );
		this.gridControl.addTo( m );
		
	};
	
	return o;

};



//===============================================================================================
//----------------------------------------------------------------------------------------------- DEMAND INSTITUTE

var DI = {
	
	//------------------------------------------- PUBLIC
	init : function() {
		
		this._setup.map();
		//this._setup.layers();
		
	},
	
	//------------------------------------------- PRIVATE
	
	_setup : {
		
		map : function() {
			
			map = L.mapbox.map( 'di-map' ).setView( [ 40.98, -98.09 ], 4 );
			Modify.Map( map );
			
			map.addTileLayer( 'creatologist.fizoajor', 'Background', 1 );
			
			itlA = new InteractiveTileGroup( 'creatologist.me31h5mi', 'Earthquakes', 3, { follow: true } );
			itlB = new InteractiveTileGroup( 'creatologist.0i2otj4i', 'Cities', 4, { follow: true } );
			
			Modify.InteractiveTileGroup( itlA );
			Modify.InteractiveTileGroup( itlB );
			
			map.addGroup( itlA );
			map.addGroup( itlB );
			
			
			
			// TEST
			
			/*topPane.appendChild( itlA.tileLayer.getContainer() );
			topPane.appendChild( itlB.tileLayer.getContainer() );
			itlA.tileLayer.setZIndex( 10 );
			itlB.tileLayer.setZIndex( 11 );*/
			//console.log( topPane );
			
			//$('.leaflet-overlay-pane').insertBefore('.leaflet-marker-pane');
			
			
			/*$('.leaflet-objects-pane').insertBefore('.leaflet-layer:first');
			$('.leaflet-objects-pane').css( { 'z-index': 1 });*/
			
			//$('.leaflet-overlay-pane').insertAfter('.leaflet-layer:last');
			//$('.leaflet-overlay-pane').css( { 'z-index': 1 });
			
		},
		
		layers : function() {
			
			var getStyle = function( feature ) {
				return {
		            weight: 2,
		            opacity: 0.1,
		            color: 'black',
		            fillOpacity: 0.8,
		            /*fillColor: getColor(feature.properties.density)*/
		            fillColor: '#4e7396'
		        };
			};
			
			var getColor = function( d ) {
		        return d > 1000 ? '#8c2d04' :
		            d > 500  ? '#cc4c02' :
		            d > 200  ? '#ec7014' :
		            d > 100  ? '#fe9929' :
		            d > 50   ? '#fec44f' :
		            d > 20   ? '#fee391' :
		            d > 10   ? '#fff7bc' :
		            '#ffffe5';
		   };
		   
		   var stateClick = function(feature, layer){
				layer.on({
					click : function(e) { console.log( e ); }
				});
			};
			
			Layer.states = L.geoJson( statesData, {
				style: getStyle,
				onEachFeature: stateClick
			}).addTo( map );
			
			//Layer.states.bringToBack();
			//topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
			//topPane = map._createPane('leaflet-top-pane', map.getPanes().objectsPane );
			
			/*var l = Layer.states.getLayers();
			for ( var i = 0, len = l.length; i < len; i ++ ) {
				
			}
			//console.log( l );
			
			Layer.statesGroup = L.featureGroup( Layer.states.getLayers() ).setZIndex( 1 ).addTo( map );*/
			
			Layer.states.getLayerByName = function( id ) {
				for ( var key in this._layers ) {
					var obj = this._layers[ key ];
					if ( obj.feature.properties.name == id ) return this._layers[ key ];
				}
			};
			
		}
		
	}
	
};



//===============================================================================================
//----------------------------------------------------------------------------------------------- UTILS

var Utils = {
	
	hex2rgb : function( hex ) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });
	
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	
	rgb2hex : function( r, g, b ) {
		 return "#" + Utils.componentToHex(r) + Utils.componentToHex(g) + Utils.componentToHex(b);
	},
	
	componentToHex : function( c ) {
		c = parseInt( c );
		var hex = c.toString(16);
   		return hex.length == 1 ? "0" + hex : hex;
	}
	
	
};

















//===============================================================================================
//----------------------------------------------------------------------------------------------- TESTING ZONE

var layerUpdate = function( layer, o) {
	layer.setStyle( o );
};

var testObj = { r: 0, g: 0, b: 255 };

var TEST = {
	
	colors : function() {
		var layers = Layer.states.getLayers();
		for ( var i = 0, len = layers.length; i < len; i++ ) {
			var layer = layers[i];
			AnimateLayer( layer, { fillColor: Utils.rgb2hex( Math.random()*255, Math.random()*255, Math.random()*255 ) }, 1 );
		}
	},
	
	fadeOut : function() {
		var layers = Layer.states.getLayers();
		for ( var i = 0, len = layers.length; i < len; i++ ) {
			var layer = layers[i];
			AnimateLayer( layer, { fillOpacity: 0 }, Math.random()*3 );
		}
	},
	
	fadeIn : function() {
		var layers = Layer.states.getLayers();
		for ( var i = 0, len = layers.length; i < len; i++ ) {
			var layer = layers[i];
			AnimateLayer( layer, { fillOpacity: 1 }, Math.random()*3 );
		}
	},
	
	animateColor : function() {
		
		
		var a = [];
		
		for ( key in Layer.states._layers ) {
			//console.log( key );
			var obj = Layer.states._layers[ key ];
			if ( !obj.options || !obj.options.fillColor ) continue;
			
			/*obj.startColor = Utils.hex2rgb( obj.options.fillColor );
			obj.endColor = Utils.hex2rgb( "#00ff93" );
			obj.color = obj.startColor;*/
			
			var startColor = Utils.hex2rgb( obj.options.fillColor );
			obj.r = startColor.r;
			obj.g = startColor.g;
			obj.b = startColor.b;
			
			a.push( key );
		}
		
		/*
		for ( var i = 0, len = a.length; i < len; i++ ) {
			var obj = Layer.states._layers[ a[ i ] ];
			var color = Utils.hex2rgb( obj.options.fillColor );
			var endColor = Utils.hex2rgb( "#00ff93" );
			
			TweenLite.to( obj, .5, {
				r: endColor.r,
				g: endColor.g,
				b: endColor.b,
				ease: "Elastic.easeOut",
				onUpdate:
					function() {
						this.target.setStyle( { fillColor: Utils.rgb2hex( color.r, color.g, color.b ) } );
					}
			});
		}
		
		return;*/
		
		/*for ( var i = 0, len = a.length; i < len; i++ ) {
			var obj = Layer.states._layers[ a[i] ];
			obj.id = i;
			if ( !obj.options || !obj.options.fillColor ) continue;
			var color = Utils.hex2rgb( obj.options.fillColor );
			var endColor = Utils.hex2rgb( "#00ff93" );
			TweenLite.to( color, .5, {
				r: endColor.r,
				g: endColor.g,
				b: endColor.b,
				ease: "Elastic.easeOut",
				onUpdate:
					function() {
						console.log( i );
						//console.log( obj.id );
						obj.setStyle( { fillColor: Utils.rgb2hex( color.r, color.g, color.b ) } );
					}
			});
		}*/
		
		
		
		for ( var i = 0, len = a.length; i < len; i++ ) {
			var obj = Layer.states._layers[ a[i] ];
			obj.id = i;
			if ( !obj.options || !obj.options.fillColor ) continue;
			var color = Utils.hex2rgb( obj.options.fillColor );
			var endColor = Utils.hex2rgb( "#ff0000" );
			
			TweenLite.to( obj, 1, {
				r: endColor.r,
				g: endColor.g,
				b: endColor.b,
				ease: "Elastic.easeOut",
				onUpdate:
					function() {
						//console.log( obj.id );
						this.target.setStyle( { fillColor: Utils.rgb2hex( this.target.r, this.target.g, this.target.b ) } );
					}
			});
		}
		
		return;
		
		for ( var i = 0, len = a.length; i < len; i++ ) {
			var obj = Layer.states._layers[ a[i] ];
			obj.id = i;
			if ( !obj.options || !obj.options.fillColor ) continue;
			var color = Utils.hex2rgb( obj.options.fillColor );
			var endColor = Utils.hex2rgb( "#00ff93" );
			TweenLite.to( color, .5, {
				r: endColor.r,
				g: endColor.g,
				b: endColor.b,
				ease: "Elastic.easeOut",
				onUpdate:
					function() {
						console.log( i );
						//console.log( obj.id );
						obj.setStyle( { fillColor: Utils.rgb2hex( color.r, color.g, color.b ) } );
					}
			});
		}
	}
	
};
























