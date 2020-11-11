let facemesh;
let video;
let predictions = [];
let eyes;

function preload() {
    eyes = loadImage("imgs/eyes.jpg");
}

function setup() {
  createCanvas(640, 480);
    
    
    video = createCapture(VIDEO);
    video.size(640, 480);
    //video.position(0,0);
    video.hide();

  facemesh = ml5.facemesh(video, modelReady);

  facemesh.on("predict", results => {
    predictions = results;
  });
  
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
    background(0);
    blendMode(DIFFERENCE);
    
    //lines 37-54 is from IDM Image Processing in p5.js:
    //https://idmnyu.github.io/p5.js-image/Filters/vid_filter.html
    capimg = video.get(); // copying frames
	
	if(capimg.width > 0) {
		capimg.loadPixels(); // getting pixel array
		
		for(var i = 0; i < capimg.pixels.length; i += 4)
		{	
			var r = capimg.pixels[i+0];
			var g = capimg.pixels[i+1];
			var b = capimg.pixels[i+2];
			
			capimg.pixels[i+0] = mouseX;
			capimg.pixels[i+1] = g;
			capimg.pixels[i+2] = mouseY;
		}
		capimg.updatePixels();
		image(capimg, 0, 0, width, height);
	}
    
    
    drawFaceMask()
    
//    pixelDensity(1);
//    loadPixels();
//    for (var x = 0; x < width; x++) {
//        for (var y = 0; y < width; y++) {
//            var index = (x + y * width) * 4;
//            
//            let r = pixels[index];
//            let g = pixels[index+1];
//            let b = pixels[index+2];
//            let a = pixels[index+3];
//                        
//            if (r === 0 && g === 255 && b === 0) {
//                pixels[index+3] = 0;
//            }
//        }
//    }
//    updatePixels();

}

//code reference from ml5.js Facemesh:
//https://github.com/tensorflow/tfjs-models/tree/master/facemesh
function drawFaceMask() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
     
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

        noStroke();
        fill(255, 255, 255, 20);
        rectMode(CENTER);
        rect(x,y,30,30);
    }
  }
    
}