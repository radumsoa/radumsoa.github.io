var img_floorplan; //floorplan image 
var canv; //main canvas
var canv_height, canv_width; //dimensions for canv 
var img_offset_x, img_offset_y, img_width, img_height;
var width_height_ratio = 1.5;
var sensor_vals = []; //the current value displayed on sensors
var sensor_vals_new = []; //the value to display next  
var divoverlay, divoverlay_visible;
var sensorsX = [225, 433, 232, 551, 547];
var sensorsY = [215, 400, 418, 424, 251];

var overlay_opacity = 255;
var counter = 0;


var datapoints1 = [];
var newdata = [];



function setup() {
  //store_local();

  //retrieve_local();
  divoverlay_visible = false;
  //arr = new Array(2);
  
  for (var i = 0; i < 2; i++){
    //arr[i] = new Array(100);
    sensor_vals[i] = 0;
    sensor_vals_new[i] = sensor_vals[i];
  }

  frameRate(20);

  canv_height = windowWidth/width_height_ratio;

  canv = createCanvas(0, 0);
  canv.parent('planwrapper');
  img_floorplan = loadImage("floorplan.png");
  //img_rad_logo = loadImage("radlogo.png");
  
}


function draw() {
 
 if (datapoints1.length == 0 ){
    store_local();
    console.log("called store_local");
 }

 //store_local();
 if (counter %20 == 0){
  sensor_vals_new[0] = datapoints1.pop();//Math.floor(getRandom(10,20)); 
  sensor_vals_new[1] = datapoints3.pop();
  console.log("sensor1: "+sensor_vals_new[0]+", sensor3: "+sensor_vals_new[1]);
 }
 if (counter == 20*30){
  counter=0;

  //store_local();
    //console.log("called store_local");
 }
 else{
  counter++;
 }
 background(25, 32, 38);
 
 img_offset_x = 0.5*450;
 img_offset_y = 0;//0.2*img_floorplan.height/img_floorplan.width*500;
 img_width = 450;//windowWidth;
 img_height = 450;//0.5*img_floorplan.height/img_floorplan.width*windowWidth;

 //logo_height = 0.2*windowWidth;
 //logo_width = 0.2*windowWidth*img_rad_logo.height/img_rad_logo.width;

 image(img_floorplan, 0, 0, img_width, img_height);
 //image(img_rad_logo, img_offset_x/8, img_offset_y/3, logo_height, logo_width);
 fill(0,0,0,0);
 strokeWeight(2);
 for (var i = 0; i < 2; i++){
  stroke(255-i*50, 150-i*30, 0);
  
  var val = Math.floor(sensor_vals_new[i]);

  if (sensor_vals[i] < sensor_vals_new[i]){
    sensor_vals[i]++;
  }
  else if (sensor_vals[i] > sensor_vals_new[i]){
    sensor_vals[i]--;
  }

  if (counter %20 == 0){
    sensor_vals_new[0] = datapoints1.pop();
    sensor_vals_new[1] = datapoints3.pop();
  }


  //amplitude(i, val);
  //drawCircles(sensorsX[i],sensorsY[i], val, i); 
  drawBar(sensorsX[i], sensorsY[i], sensor_vals[i], i);
 }
 /*console.log(sensor_vals[0]+" "+sensor_vals[1]+" "+sensor_vals[2]+" "+sensor_vals[3]+" "+sensor_vals[4]);
 console.log(sensor_vals_new[0]+" "+sensor_vals_new[1]+" "+sensor_vals_new[2]+" "+sensor_vals_new[3]+" "+sensor_vals_new[4]);*/
 
}


function mousePressed(){
  console.log("x: "+mouseX+", y: "+mouseY);
}
function getRandom(min, max){
  return random(max-min)+min;
}


function drawBar(x, y, w, j){
  w=w/50;


  strokeWeight(0);
  w = Math.round(w);
  fill(colors_outlines[j]);
  stroke(colors_outlines[j]);
  for (var i = w-1; i >= 0; i--){
    rect(img_offset_x*x/200-img_offset_x, y-450*i/120,
      15,2);
  }
  //console.log(w);
}
function drawCircles(x, y, w, j){

  strokeWeight(1);
  stroke(colors_outlines[j]);
  w = Math.round(w);
  fill(colors[j]);
    ellipse(img_offset_x*x/200-img_offset_x, y-450*i/120-25,
      w*5,w*5);
    //rect(img_offset_x*x/200-img_offset_x, y-450*i/120,
    //  10,2);
  
}