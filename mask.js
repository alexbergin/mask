var mask = function(){

	// preferences are stored here
	var pref = {

		mask: undefined,
		overlay: undefined,
		size: "base",
		aInvert: false,
		cInvert: false,

	}

	// builds the output image
	this.gen = function( image ){

		var output = {

			// settings and canvas variables
			data: {

				width: 0,
				height: 0,
				domCan: undefined,
				canvas: undefined,

			},

			// image data is stored here
			layers: {

				base: undefined,
				mask: undefined,
				over: undefined,

			},

			// this does the things
			init: function(){

				this.check();
				this.build();
				this.drawBase();
				this.drawMask();
				this.drawOver();
				this.applyAll();
				this.destroy();

			},

			// draws the image on the canvas and returns the image data
			// if save is undefined then canvas is cleared; keeps image data if save is set to true
			// this draws everything similar to 'cover' and this is the function you want to modify
			// if you're looking to change that functionality

			draw: function( src , save ){

				var ratio = 0,
					drawing = {
						x: 0,
						y: 0,
						w: 0,
						h: 0,
					},
					imgData;

				// determine output ratio
				if (( this.data.width / src.width ) * src.height > this.data.height ){
					ratio = this.data.width / src.width;
				} else {
					ratio = this.data.height / src.height;
				}

				// applies the ratio
				drawing.w = src.width * ratio;
				drawing.h = src.height * ratio;

				drawing.x = ( this.data.width - drawing.w ) / 2;
				drawing.y = ( this.data.height - drawing.h ) / 2;

				// draw the image to cover the canvas
				this.data.canvas.drawImage( src , drawing.x , drawing.y , drawing.w , drawing.h );

				// return the image data and clear the canvas if save is undefined or false
				if ( typeof save == "undefined" || save == false ){
					imgData = this.data.canvas.getImageData( 0 , 0 , this.data.width , this.data.height );
					this.data.canvas.clearRect( 0 , 0 , this.data.width , this.data.height );

					return imgData;
				}

			},

			// sees if the preferences you've set will work
			check: function(){

				// find any errors
				if ( pref.size == "mask" || pref.size == "overlay" || pref.size == "base" ){
					
					// pref.size must be mask, overlay, or base

					if ( pref.size == "mask" && pref.mask != undefined ){
						this.data.width = pref.mask.width;
						this.data.height = pref.mask.height;
					} else {
						if ( pref.size != "overlay" && pref.size != "base" ){
							error("mask must be defined to scale to mask");
						}
					}
					
					if ( pref.size == "overlay" && pref.overlay != undefined ){
						this.data.width = pref.overlay.width;
						this.data.height = pref.overlay.height;
					} else {
						if ( pref.size != "mask" && pref.size != "base" ){
							error("overlay must be defined to scale to overlay");
						}
					}

					if ( pref.size == "base" ){
						this.data.width = image.width;
						this.data.height = image.height;
					}

				} else {
					error("invalid size definition: use a string 'mask'  or 'overlay'");
				}

			},

			// constructs the temporary canvas
			build: function(){

				// create the canvas we'll work with
				this.data.domCan = document.createElement("canvas");
				this.data.domCan.setAttribute("style","position:absolute;top:-" + this.data.height.toString() + "px;left:-" + this.data.width.toString() + "px;width:" + this.data.width.toString() + "px;height:" + this.data.height.toString() + "px;");
			
				// place in dom
				document.body.appendChild( this.data.domCan );

				// create 2d context and scale correctly
				this.data.canvas = this.data.domCan.getContext("2d");
				this.data.domCan.width = this.data.width;
				this.data.domCan.height = this.data.height;

			},

			// draws the base image
			drawBase: function(){

				this.layers.base = this.draw( image );

			},

			// draws the clipping mask
			drawMask: function(){

				if ( typeof pref.mask != "undefined" ){
					this.layers.mask = this.draw( pref.mask );
				}

			},

			// draws the cover image over everything;
			// is still clipped
			drawOver: function(){

				if ( typeof pref.overlay != "undefined" ){
					this.layers.over = this.draw( pref.overlay );
				}

			},

			// generates the output image
			applyAll: function(){
				
				// draw overlay on top of base image and store data to base layer
				if ( this.layers.over != undefined ){
					
					this.data.canvas.putImageData( this.layers.base , 0 , 0 );
					this.draw( pref.overlay , true );

					this.layers.base = this.data.canvas.getImageData( 0 , 0 , this.data.width , this.data.width );
					this.data.canvas.clearRect( 0 , 0 , this.data.width , this.data.height );

				}

				// apply mask
				if ( this.layers.mask != undefined ){
					var imageData = this.layers.mask.data,
						imageBase = this.layers.base.data;

					for ( var i = 0 , idur = imageData.length ; i < idur ; i += 4 ){
						var initA = imageData[ i + 0 ] + imageData[ i + 1 ] + imageData[ i + 2 ];

						if ( pref.cInvert != true ){
							if ( pref.aInvert != true ){
								initA = ( 255 - ( initA / 3 )) * ( imageData[ i + 3 ] / 255 );
							} else {
								initA = ( 255 - ( initA / 3 )) * (( 255 - imageData[ i + 3 ] ) / 255 );
							}
						} else {
							if ( pref.aInvert != true ){
								initA = ( initA / 3 ) * ( imageData[ i + 3 ] / 255 );
							} else {
								initA = ( initA / 3 ) * (( 255 - imageData[ i + 3 ] ) / 255 );
							}
						}
						
						imageBase[ i + 3 ] = initA;
					}

					this.layers.base.data = imageBase;
				}
				
				// apply changes to source image
				image.style.width = this.data.width + "px";
				image.style.height = this.data.height + "px";

				this.data.canvas.putImageData( this.layers.base , 0 , 0 );
				image.src = this.data.domCan.toDataURL();

			},

			// remove the temporary canvas to not clutter the dom
			destroy: function(){

				this.data.domCan.parentNode.removeChild( this.data.domCan );

			}

		};

		// initiate
		output.init();
	}

	// applys settings en masse
	this.settings = function( prefs ){

		if ( typeof prefs != "undefined" ){
            var props = [];
            for( var properties in this.set ){
                if ( this.set.hasOwnProperty( properties )){
                    props.push( properties.toString() );   
                }
            }
            for( var i = 0 , idur = props.length ; i < idur ; i++ ){
                if ( prefs.hasOwnProperty( props[i] )){
                    this.set[ props[i] ]( prefs[ props[i] ]);
                }
            }
        } else {
            error( "no preferences defined" );
        }

	}

	// define individual settings
	this.set = {

		// src must be a string
		size: function( string ){
			if ( typeof string != "undefined" ){
				pref.size = string;
			} else {
				pref.error("size must be defined");
			}
		},

		// src must be an image object
		mask: function( src ){
			pref.mask = src;
		},

		// src must be an image object
		overlay: function( src ){
			pref.overlay = src;
		},

		// bool must be boolean (obviously)
		aInvert: function( bool ){
			pref.aInvert = bool;
		},

		// bool must be boolean (obviously)
		cInvert: function( bool ){
			pref.cInvert = bool;
		},

	}

	// logs internal errors and stops the script to prevent known errors
	var error = function( message ){

		var string = "mask.js err: " + message;
		console.log( string );
		return;
		
	}
}