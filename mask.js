var mask = function(){

	var pref = {
		mask: undefined,
		overlay: undefined,
		size: "mask",
	}

	this.gen = function( image ){
		var output = {

			data: {
				width: 0,
				height: 0,
				domCan: undefined,
				canvas: undefined,
			},

			layers: {
				base: undefined,
				mask: undefined,
				over: undefined,
			},

			draw: function( src ){
				var ratio = 0,
					drawing = {
						x: 0,
						y: 0,
						w: 0,
						h: 0,
					},
					imgData;

				if (( this.data.width / src.width ) * src.height > this.data.height ){
					ratio = this.data.width / src.width;
				} else {
					ratio = this.data.height / src.height;
				}

				drawing.w = src.width * ratio;
				drawing.h = src.height * ratio;

				drawing.x = ( this.data.width - drawing.w ) / 2;
				drawing.y = ( this.data.height - drawing.h ) / 2;

				this.data.canvas.drawImage( src , drawing.x , drawing.y , drawing.w , drawing.h );
				imgData = this.data.canvas.getImageData( 0 , 0 , this.data.width , this.data.height );
				this.data.canvas.clearRect( 0 , 0 , this.data.width , this.data.height );

				return imgData;
			},

			init: function(){
				this.check();
				this.build();
				this.drawBase();
				this.drawMask();
				this.drawOver();
				this.applyAll();
				this.destroy();
			},

			check: function(){
				// find any errors
				if ( pref.size == "mask" || pref.size == "overlay" ){
					if ( pref.size == "mask" && pref.mask != undefined ){
						this.data.width = pref.mask.width;
						this.data.height = pref.mask.height;
					} else {
						error("mask must be defined to scale to mask");
					}
					if ( pref.size == "overlay" && pref.overlay != undefined ){
						this.data.width = pref.overlay.width;
						this.data.height = pref.overlay.height;
					} else {
						error("overlay must be defined to scale to overlay");
					}
				} else {
					error("invalid size definition: use a string 'mask'  or 'overlay'");
				}
			},

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

			drawBase: function(){
				this.layers.base = this.draw( image );
			},

			drawMask: function(){
				if ( typeof pref.mask != "undefined" ){
					this.layers.mask = this.draw( pref.mask );
				}
			},

			drawOver: function(){
				if ( typeof pref.overlay != "undefined" ){
					this.layers.over = this.draw( pref.overlay );
				}
			},

			applyAll: function(){
				
				// draw overlay on top of base image and store data to base layer
				if ( this.layers.over != undefined ){
					
					this.data.canvas.putImageData( this.layers.base , 0 , 0 );
					this.data.canvas.drawImage( pref.overlay , 0 , 0 );

					this.layers.base = this.data.canvas.getImageData( 0 , 0 , this.data.width , this.data.width );
					this.data.canvas.clearRect( 0 , 0 , this.data.width , this.data.height );

				}

				// apply mask
				if ( this.layers.mask != undefined ){
					var imageData = this.layers.mask.data,
						imageBase = this.layers.base.data;

					for ( var i = 0 , idur = imageData.length ; i < idur ; i += 4 ){
						imageBase[ i + 3 ] = imageData[ i + 3 ];
					}

					this.layers.base.data = imageBase;
				}
				
				image.style.width = this.data.width + "px";
				image.style.height = this.data.height + "px";

				this.data.canvas.putImageData( this.layers.base , 0 , 0 );
				image.src = this.data.domCan.toDataURL();
			},

			destroy: function(){
				
				this.data.domCan.parentNode.removeChild( this.data.domCan );

				this.data = {
					width: 0,
					height: 0,
					domCan: undefined,
					canvas: undefined,
				}

				this.layers = {
					base: undefined,
					mask: undefined,
					over: undefined,
				}
			}

		};

		output.init();
	}

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

	this.set = {
		size: function( string ){
			if ( typeof string != "undefined" ){
				pref.size = string;
			} else {
				pref.error("size must be defined");
			}
		},
		mask: function( src ){
			pref.mask = src;
		},
		overlay: function( src ){
			pref.overlay = src;
		},
	}

	var error = function( message ){
		var string = "mask.js err: " + message;
		console.log( string );
	}
}