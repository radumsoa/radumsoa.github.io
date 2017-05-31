
var bgcolor;
var button;
var txt;
var img_floorplan, img_rad_logo;
var canv;
var canv_height, canv_width;
var img_offset_x, img_offset_y, img_width, img_height;
var arr;
var refresh_interval = 0;
var sensor_arr = [];
var sensor_new = [];
var sensor_arr_total = [];
var sensor_min = [];
var sensor_max = [];
var sensorsX = [225, 433, 232, 551, 547];
var sensorsY = [215, 400, 418, 424, 251];
var vert_lines = [];
var data_count = 0;
var b1, b2;

var datapoints1 = [];
var datapoints3 = [];

function store_local(){
  $.getJSON( "http://bdapp1.ccs.miami.edu/iot/sensor/001?count=40", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      datapoints1.push(val.volume);
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
  });

  $.getJSON( "http://bdapp1.ccs.miami.edu/iot/sensor/003?count=40", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      datapoints3.push(val.volume);
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
  });
}

function setup() {
  canv_height = windowWidth/1.5;
  canv_width = windowWidth;
  arr = new Array(5);
  for (var i = 0; i < 5; i++){
    sensor_arr[i] = round(getRandom((i+1)*2, (i+1)*5));
    sensor_arr_total[i] = sensor_arr[i];
    sensor_new[i] = sensor_arr[i];
    sensor_min[i] = sensor_arr[i];
    sensor_max[i] = sensor_arr[i];
    arr[i] = new Array(100); 
    vert_lines[i] = canv_width/5*i;
  }

  //frameRate(4);
  
  canv = createCanvas(windowWidth, canv_height);
  bgcolor = color(51);
  img_floorplan = loadImage("floorplan.png");
  //img_rad_logo = loadImage("radlogo.png");
  b1 = color(255,100,200);
  b2 = color(0);
  // button.mousePressed(changeStyle);
}



function updateVals(){
  for (var i = 0; i < 5; i++){

  stroke(i*50, 255, 255);
  fill(i*50, 255, 255);
  if (refresh_interval == 50){
    for (var j = 0; j < 5; j++){
      sensor_new[j] = round(sensor_new[j]+getRandom(-2,2));
      if (sensor_new[i] > 25)
        sensor_new[i] = 25;
      if (sensor_new[i] < 0)
        sensor_new[i] = 0;
      sensor_arr_total[j] += sensor_new[j];
      data_count++;
      refresh_interval = 0;
      if (sensor_new[i] < sensor_min[i])
        sensor_min[i] = sensor_new[i];
      if (sensor_new[i] > sensor_max[i])
        sensor_max[i] = sensor_new[i];
    }
  }
  if (sensor_new[i] > 25)
        sensor_new[i] = 25;
      if (sensor_new[i] < 0)
        sensor_new[i] = 0;
  

  if (sensor_arr[i] < sensor_new[i]){
    sensor_arr[i]+=0.1;
  }
  else if (sensor_arr[i] > sensor_new[i]){
    sensor_arr[i]-=0.1;
  }
  //console.log(sensor_new[i]);

  var val = sensor_arr[i];
  //drawCircles(sensorsX[i], sensorsY[i], val);
  amplitude(i, val);
 }
}

function draw() {
 colorMode(RGB, 255);
 background(200, 200, 200);
 colorMode(HSB, 255);
 
 drawFloorplan();

 
 drawVerticalGuide();
 updateVals();
 colorMode(RGB, 255);
 setGradient(0, 0, canv_width/2, canv_height/2+10, 
   color(200,200,200,255), color(200,200,200,0));
 max_min();

}

function amplitude(index, value){
  colorMode(HSB, 255);
  strokeWeight(2);
  var amp = value/-100;//random(-400,-50)/2000;
  arr[index].push(amp);
  //stroke(255);
  noFill();
  push();
  //translate(0, -height/2);
  beginShape();
  for (var i = 0; i < arr[index].length; i++) {
    //var y = map(arr[index][i], 0, 1, height, 0);
    vertex(i, 
            arr[index][i]*canv_height*2+10+canv_width/3);
  }
  endShape();
  //stroke(50,100,40);
  
  ellipse(i,10+round(arr[index][arr[index].length-1]*canv_height*2+
    canv_width/3),10,10);
  pop();
  while (arr[index].length > canv_width*.8) {
    arr[index].splice(0, 1);
  }
  
}

function mousePressed(){
  console.log("x: "+mouseX+", y: "+mouseY);
}
function getRandom(min, max){
  return random(max-min)+min;
}
function drawCircles(x, y, w){
  for (var i = 0; i < w; i++){
    //stroke(255-(i*15), 100+i*15, i*5);
    ellipse(img_offset_x*x/200,img_offset_y*y/81,
    img_width*i/50,img_height*i/50);
  }
  
}

function drawVerticalGuide(){
  
  if (windowWidth/50 > 20)
    textSize(20);
  else
    textSize(windowWidth/50);
  fill(0,0,0,0);
  refresh_interval++;
  stroke(0);
  strokeWeight(1);
  line(canv_width*0.8, 5, canv_width*0.8, canv_height/2+15);
  var incr = 25;
  for (var i = 0; i <= incr; i++){
    if (i%5 == 0){
      stroke(0);
      line(canv_width*0.8-5, canv_height/2*i/incr+10, 
        canv_width*0.8+5, canv_height/2*i/incr+10);
      text(25-i, canv_width*0.8+10, canv_height/2*i/incr+15);
    }
    else{
      line(canv_width*0.8-1, canv_height/2*i/incr+10, 
        canv_width*0.8+1, canv_height/2*i/incr+10);
    }
  }

}

function drawFloorplan(){
  img_offset_x = 10;//0.25*windowWidth;
  img_offset_y = 0.4*img_floorplan.height/img_floorplan.width*windowWidth;
  img_width = 0.25*windowWidth;
  img_height = 0.25*img_floorplan.height/img_floorplan.width*windowWidth;
  image(img_floorplan, img_offset_x, img_offset_y, img_width, img_height);
}

function max_min(){
  fill(50,50,50);
  rect(img_width+30,img_offset_y,canv_width-img_width-80,
    canv_height-img_offset_y-10);
  textSize(windowWidth/40);
  fill(255);
  text("#", img_width+50, img_offset_y+img_height/7);
  text("cur", img_width+(canv_width*2/16*1)+50, img_offset_y+img_height/7);
  text("min", img_width+(canv_width*2/16*2)+50, img_offset_y+img_height/7);
  text("avg", img_width+(canv_width*2/16*3)+50, img_offset_y+img_height/7);
  text("max", img_width+(canv_width*2/16*4)+50, img_offset_y+img_height/7);
  for (var i = 0; i < 5; i++){
    colorMode(HSB, 255);
    fill(i*50, 255, 255);
    text((i+1), img_width+50, img_offset_y+(i+2)*img_height/7);
    text(sensor_new[i], img_width+(canv_width*2/16*1)+50, 
      img_offset_y+(i+2)*img_height/7);
    text(sensor_min[i], img_width+(canv_width*2/16*2)+50, 
      img_offset_y+(i+2)*img_height/7);
    text(round(sensor_arr_total[i]/data_count), 
      img_width+(canv_width*2/16*3)+50, 
      img_offset_y+(i+2)*img_height/7);
    text(sensor_max[i], img_width+(canv_width*2/16*4)+50, 
      img_offset_y+(i+2)*img_height/7);
    //console.log("yo");
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
      //console.log("i: "+i+", y+h: "+(y+h));
    }
  
}

function windowResized(){
  canv_height = windowWidth/1.5;
  canv_width = windowWidth;
  resizeCanvas(windowWidth, canv_height);
}