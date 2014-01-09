# mask

A javascript library designed to let you easily mask and texture images on the fly.

## Usage

Include mask.js in your head
    
    <script src="mask.js"></script>
    
Usually you'll want to wait until your images have loaded before using this library. For the sake of simplicity, this demo will initialize mask on window load. This guarantees that our images have loaded.

    <script>
        window.onload = function(){
            var imgMask = new mask();
        }
    </script>
    
First, define your settings.

    <script>
        window.onload = function(){
            var imgMask = new mask();
            
            imgMask.settings({
				mask: document.getElementById("mask"),
				overlay: document.getElementById("over"),
				size: "mask",
			});
        }
    </script>
    
Next we tell our mask function to generate the new image.

    <script>
        window.onload = function(){
            var imgMask = new mask();
            
            imgMask.settings({
				mask: document.getElementById("mask"),
				overlay: document.getElementById("over"),
				size: "mask",
			});

            imgMask.gen( document.getElementById("base"));
        }
    </script>
    
That is all the script you need to do to start exporting.
For a more thorough example, see the example index page.

## Settings

The following are all options you can set to determine the style of your output image. These commands are assuming you've initialized the mask function to the variable `imgMask` and that your content has fully loaded.

In addition to being able to set all these preferences individually, you can optionally define them with one object using the settings function:

    imgMask.settings({
        mask: img,
        overlay: img,
        size: string,
        aInvert: bool,
        cInvert: bool
    });
    
Anywhere between an individual preference and all of them at once can be set in this manner. Invalid properties will be ignored and will not throw an error.

------------

### Mask

This sets the image to be used for masking your image. The image element is passed to this function.
    
    imgMask.set.mask( img );
    
Defining a mask is not required. To remove a previous mask when reusing your `imgMask` variable, set the mask to `undefined`.

Default value: `undefined`
    
------------

### Overlay

This sets the image to be used for overlaying your image. The image element is passed to this function.
    
    imgMask.set.overlay( img );
    
Defining an overlay is not required. To remove a previous overlay when reusing your `imgMask` variable, set the overlay to `undefined`.

Default value: `undefined`

------------

### Size

Size determines what image to scale your outputted image to. It currently behaves in the same manner as the `cover` setting for background sizing in CSS.

    imgMask.set.size( string );

There must always be a size set. The available strings are `mask`, `overlay`, and `base`: base being your original image.
    
Default value: `base`
    
------------

### aInvert

aInvert tells the mask to invert the way it handles alpha values. By default, lower alphas are more transparent while higher alphas are opaque.

    imgMask.set.aInvert( bool );
    
Default value: `false`
    
------------

### cInvert

cInvert tells the mask to invert the way it handles chromatic values. By default, darker colors are more transparent while brighter colors are opaque.

    imgMask.set.cInvert( bool );
    
Default value: `false`
    
------------