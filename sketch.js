let video;
let poseNet;
let pose;
let t = 255;

let numPixel = 100;
let oX = 0;
let speedB = 0;

let rO;

let screenTransparencyA = 0;
let textTransparencyA = 0;

let block = [];
let obstacle = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
  
    rO = random(-2,2);
}

function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
}

function modelLoaded() {
    console.log('poseNet ready');
}

function draw() {
    //flip video
    push();
      translate(video.width, 0);
      scale(-1,1);
      image(video,0,0);
    pop();  
  
    //draw ice blocks
    for (let x=0; x<numPixel; x++) {
        for (let y=0; y<numPixel; y++) {
            if (y == 0 || y == 1 || y == 10 || y == 11) {
                drawBlock(x,y);
            }
        }
    }
    
    for (let x=0; x<numPixel; x+=15) {
        drawTopObstacle(x);
        drawBottomObstacle(x);
    }
  
    //draw helicopter
    if (pose) {
      push();
        //flip helicopter
        translate(video.width, 0);
        scale(-1,1);
        
        drawHelicopter();
      pop();
    
        //draw crashed screen
        noStroke();
        fill(255, 0, 0, 0 + screenTransparencyA);
        rect(width/2, height/2, width, height);
        fill(255, 255, 255, 0 + textTransparencyA);
        textSize(40);
        textFont('Roboto Mono');
        textAlign(CENTER);
        text('YOU CRASHED', width/2, height/2);
        textSize(10);
        text('Press S to Start Again', width/2, height/5*3);
        
        //helicopter bumps into blocks
        for (let b of block) {
          
          nX = video.width-pose.nose.x;
          nY = pose.nose.y;
        
          if (nX+20 > b.x && nX-20 < b.x+40 && nY+15 > b.y && nY-15 < b.y+40) {
            screenTransparencyA = 255;
            textTransparencyA = 255;
            speedB = 0
          } 
        }
        
          for (let o of obstacle) {
            if (nX+20 > o.x && nX-20 < o.x+40 && nY+15 > o.y && nY-15 < o.y+40) {
              screenTransparencyA = 255;
              textTransparencyA = 255;
              speedB = 0;
            }
          }
      
          if (nY-15 < 80 || nY+15 > 400) {
            screenTransparencyA = 255;
            textTransparencyA = 255;
            speedB = 0;
          } 
    }  
}

function drawBlock(x, y) {
  noStroke();
  fill(215,235,240);
  rectMode(CENTER);
  rect(x*40+20+oX, y*40+20, 39, 39, 5, 5, 5, 5);
}

function drawTopObstacle(a) {
  for (let x=0; x<numPixel; x++) {
    for (let y=0; y<numPixel; y++) {
      let upO = (y <= -x+14+a && -y >= -x+2+a && y <= 4);
        if (upO) {
          drawBlock(x, y);
          oX = oX-speedB;
          block.push({
            x: (40*x)+oX,
            y: 40*y,
          })
      }      
    }
  }
}
      
function drawBottomObstacle(a) {
  for (let x=8; x<numPixel; x++) {
    for (let y=0; y<numPixel; y++) {
      let dnO = (-y <= -x+10+a && y >= -x+20+a && y >= 7);
        if (dnO) {
          drawBlock(x, y);
          obstacle.push({
            x: (40*x)+oX,
            y: 40*y,
          })
          //oX = oX-speed;
      }      
    }
  }
}
    
function drawHelicopter() {
  noFill();
  stroke(255,0,0);
  rect(pose.nose.x, pose.nose.y, 40, 30);
  
  noStroke();
  fill(255,200,0);
  rect(pose.nose.x-5, pose.nose.y, 25, 20, 5, 5, 5, 5);
  rect(pose.nose.x+10, pose.nose.y-7.5, 10, 5);
  rect(pose.nose.x)
  
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    screenTransparencyA = 0;
    textTransparencyA = 0;
    speedB = 0.05;
    oX = 0;
  }
}