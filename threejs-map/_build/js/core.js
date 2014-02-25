/*	
		=========================================================================================
 		*
		*	{Title}
 		*
 		=========================================================================================
		*----------------------------------------------------------------------------------------
 		*
 		*	{About}
 		*
 		=========================================================================================
		*
		*   author          >>  Christopher Miles
		*   title			>>  Principal Creative Engineer, Labs @ DigitasLBi
		*   site            >>  www.ChristopherMil.es
		*   created         >>  xx Month 2013
		*   updated         >>  xx Month 2013
		*
		=========================================================================================
*/

//===============================================================================================
//-----------------------------------------------------------------------------------------------

$( document ).ready( function() {
	Init.scene();
	Init.states();
});

//===============================================================================================
//----------------------------------------------------------------------------------------------- THREE.JS

var SCENE_WIDTH	= 960,
	SCENE_HEIGHT = 700;

var scene, camera, renderer;

var controls;

var $container;

var VIEW_ANGLE 	= 25,
	ASPECT 		= SCENE_WIDTH / ( SCENE_HEIGHT * .85 ),
	NEAR 		= 0.1,
	FAR 		= 20000;

var animate = function() {
		
	requestAnimationFrame( animate );
	
	renderer.render( scene, camera );
	controls.update();
	
};

var states; /* THREE.Object3D */

//===============================================================================================
//----------------------------------------------------------------------------------------------- ANIMATE

var Animate = {
	
	test : function() {
		
		for ( var i = 0, len = states.children.length; i < len; i++ ) {
			var d = states.children[i].density;
			
			TweenLite.to( states.children[i], 2 + Math.random()*3, {
				densityStart: d,
				ease: Quad.easeOut,
				onUpdate:
					function() {
						
						if ( this.target.densityStart < 0 ) {
							// negative
							this.target.scale.set( 1, 1, -this.target.densityStart );
							this.target.position.setZ( this.target.densityStart*10 );
							
							// change r,g,b
							// states.children[0].material.color.r = 1
						} else {
							// positive
							this.target.scale.set( 1, 1, this.target.densityStart );
							this.target.position.setZ( 0 );
						}
					}
			});
		};
		
	}
	
};


//===============================================================================================
//----------------------------------------------------------------------------------------------- INIT

var Init = {
	
	//----------------------------------------------------------------------------------------------- Init.scene
	
	scene : function() {
	
		$container 	= $( '#webgl_' );
		
		renderer	= new THREE.WebGLRenderer();
		camera 		= new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
		
		scene 		= new THREE.Scene();
		
		scene.add( camera );
		
		camera.position.z = 300;
		
		renderer.setSize( SCENE_WIDTH, SCENE_HEIGHT );
		
		$container.append( renderer.domElement );
		
		var radius = 50,
			segments = 16,
			rings = 16;
		
		var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );
		
		/*var sphere = new THREE.Mesh(
			
			new THREE.SphereGeometry(
				radius,
				segments,
				rings
			),
			
			sphereMaterial
			
		);
		
		scene.add( sphere );*/
		
		/*var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshLambertMaterial({
		    color: 'blue' 
		  }));
		  
		
		cube.position.x = -112;
		cube.position.y = 42;*/
		
		var ambientLight = new THREE.AmbientLight(0x000044);
		scene.add( ambientLight );
		
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		
		var pointLight = new THREE.PointLight( 0xFFFFFF );
		scene.add( pointLight );
		
		
		animate();
	
	},
	
	//----------------------------------------------------------------------------------------------- Init.states
	
	states : function() {
		
		states = new THREE.Object3D();
		
		for ( var i = 0, len = statesData.features.length; i < len; i++ ) {
			var data = statesData.features[i];
			var props = data.properties;
			
			var name = props.name;
			
			if ( name == 'Alaska' || name == 'Hawaii' ) continue;
			
			var m = ThreeUtils.createMesh( statesData.features[i] );
			
			m.position.x += 10182.2942;
			m.position.y -= 3650.1861;
			//m.position.z -= 2000;
			
			m.name = name;
			
			m.density = props.density * .5;
			
			if ( Math.random() < .5 ) m.density *= -1;
			m.densityStart = 1;
			
			//m.scale.set( 1, 1, props.density * .5 );
			
			states.add( m );
		};
		
		states.position.z = -10000;
		
		states.rotation.x = -.5;
		
		scene.add( states );
		
		
		
		
	}
	
};


var ThreeUtils = {
	
	translateCoordinate : function( n ) {
		n *= 100;
		return n;
	}, 
	
	createMesh : function( data ) {
		
		var shape = new THREE.Shape();
		
		var c = data.geometry.coordinates[0];
		
		if ( data.geometry.type == 'MultiPolygon' ) c = data.geometry.coordinates[0][0];
		
		shape.moveTo( this.translateCoordinate( c[0][0] ), this.translateCoordinate( c[0][1] ) );
		
		for ( var i = 1, len = c.length; i < len; i++ ) {
			shape.lineTo( this.translateCoordinate( c[i][0] ), this.translateCoordinate( c[i][1] ) );
		}
		
		var extrudeSettings = { amount: 10, bevelEnabled: false, steps: 1 };
		var shape3d = shape.extrude( extrudeSettings );
		
		var color = Utils.rgb2hex( 43, 89, 80 + ( Math.random()*40 ) ); 
		//var color = '#2b597c';
		var material = new THREE.MeshLambertMaterial({color: color});
		
		var mesh = new THREE.Mesh( shape3d , material);
		
		return mesh;
		
	}
	
	
};

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

