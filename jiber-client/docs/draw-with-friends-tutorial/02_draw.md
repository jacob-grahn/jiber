# Draw

## Create an html Page
We'll start off with creating the actual html page, here's a tutorial of how to do this if you dont know how, or it's your first time: https://www.w3schools.com/html/html_editors.asp

## Add a canvas
### Creating the Canvas in HTML
##### Creating a Canvas in HTML is quite simple, all you need to do is use the canvas tag, an example of this is
``` html
<canvas id="line-canvas" width="500" height="500"></canvas>
```
##### This code will create a canvas with the id of "line-canvas" which we will later use to access the canvas using Javascript. The width and height are also set to 500 for this canvas as clearly shown.

__Example Code to access this in Javascript is as follows__
``` javascript
const canvas = document.getElementById('line-canvas')
const ctx = canvas.getContext('2d')
```
##### This code will get the canvas with the given id of "line-canvas" and also get the context of the canvas so that we can draw onto it. It's also taken directly from the draw-with-friends example project included with jiber so you can reference it there.

## Draw something on the canvas
##### Say we wanted to create a simple rectangle with a width and height of 250, to do this we would use the code as follows.
``` javascript
//Change the fill color to red which has a hex value of #FF0000
ctx.fillStyle = "#FF0000";
//Create the rectangle with an x and y of 0, and a width and height of 250 the fillRect functions takes in the x, y, width, height all in that order
ctx.fillRect(0, 0, 250, 250);
```
##### Also i'd like to just take a quick moment to mention that if you get stuck there's a ton of resources around you, you can do a quick google search or use the official https://www.w3schools.com/ website which has a bunch of documentation for html and java and even more!

## Finishing up
#### So now that you've gained some new knowledge, I encourage you to try to get it all working on your own but if you're a little bit stuck I created a quick example you could use as reference: https://codepen.io/GambitAnimating/pen/LeGaRL
##### Also here's a great website if you want to get your own hex codes so that you can change the color of what you draw: http://htmlcolorcodes.com
