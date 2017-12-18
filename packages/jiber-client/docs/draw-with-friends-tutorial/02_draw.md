# Draw

## Create an html Page

## Add a canvas
### Creating the Canvas in Javascript
##### Creating a Canvas in Javascript is quite simple, all you need to do is use the canvas tag, an example of this is
``` html
<canvas id="line-canvas" width="500" height="500"></canvas>
```
##### This code will create a canvas with the id of "line-canvas" which we will later use to access it using Javascript. The width and height are also set to 500 for this canvas as clearly shown.

__Example Code to access this in Javascript is as follows__
``` javascript
const canvas = document.getElementById('line-canvas')
const ctx = canvas.getContext('2d')
```
##### This code will get the canvas with the given id of "line-canvas" and also get the context of the canvas so that we can draw onto it. It's also taken directly from the draw-with-friends example project included with jiber so you can reference it there.

## Draw something on the canvas
