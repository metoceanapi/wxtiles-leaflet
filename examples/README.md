This folder contains examples of how to use different bit of functionality in tiles JS libary.
Everu example is a standalone HTML file
NOTE:  build before run examples.
```
npm run build
```

* getTile.html - How to pick data values from the mouse position.
* group.html - how to show and hide multiple layers same canvas.
* scalar.html - an example of how render a scalar value tempature.
* vector.html - an example of how render a vector value (u,v) wind.
* setStyle.html - how change the style of a layer dynamically.
* setTime.html - how select the timestamp of a layer.
* setupcomplete(promise).html - how to hook a callback to the setupcomplete event. 
This event is triggered when all the metadata from tiles.metoceanapi.com is loaded and the layer is about to be render.
After this event you are allow to read or set the library properties time, style.
