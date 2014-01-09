var mask = function(){

	var pref = {
		mask: undefined,
		overlay: undefined,
		background: "rgba(0,0,0,0)",
		size: "mask",
	}

	this.gen = function( image , settings ){
		
		// if settings is defined, build those first
		if ( typeof settings != "undefined" ){
			this.settings( settings );
		}

		// determine what we should scale to
		
		var width = 0,
			height = 0;

		if ( pref.size == "mask" || pref.size == "overlay" ){
			
			if ( pref.size == "mask" && pref.mask != undefined ){

				width = pref.mask.width;
				height = pref.mask.height;

			} else {
				error("mask must be defined to scale to mask");
			}

			if ( pref.size == "overlay" && pref.overlay != undefined ){

				width = pref.overlay.width;
				height = pref.overlay.height;

			} else {
				error("overlay must be defined to scale to overlay");
			}

		} else {
		
			error("invalid size definition: use 'mask'  or 'overlay'");
		
		}

		// create the canvas we'll work with + the clipboard canvas
		var tempCanvas = document.createElement("canvas"),
			clipboard = document.createElement("canvas");
			
			tempCanvas.setAttribute("style","position:absolute;top:-" + height.toString() + "px;left:-" + width.toString() + "px;width:" + width.toString() + "px;height:" + height.toString() + "px;");
			clipboard.setAttribute("style","position:absolute;top:-" + height.toString() + "px;left:-" + width.toString() + "px;width:" + width.toString() + "px;height:" + height.toString() + "px;");

		// place in dom
		document.body.appendChild( tempCanvas );
		document.body.appendChild( clipboard );

		// scale canvas to match input
		var canvas = tempCanvas.getContext("2d"),
			paste = clipboard.getContext("2d");

			clipboard.width = tempCanvas.width = width;
			clipboard.height = tempCanvas.height = height;

		// draw the source image to fit on the end element: currently always covers
		
		
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
		mask: function( src ){
			pref.mask = src;
		},
		overlay: function( src ){
			pref.overlay = src;
		},
		background: function( style ){
			if ( typeof style != "undefined" ){
				pref.background = style;
			} else {
				pref.background = "rgba(0,0,0,0)";
			}
		},
		size: function( string ){
			if ( typeof string != "undefined" ){
				pref.size = string;
			} else {
				pref.error("size must be defined");
			}
		},
	}

	var error = function( message ){
		var string = "mask.js err: " + message;
		console.log( string );
	}
}