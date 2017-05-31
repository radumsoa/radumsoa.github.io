var headers = ["Sensor","Current","Min","Average","Max"];
var sensors = [];
var numSensors = 3;

var max_vals = [];
var min_vals = [];
var curr_vals = [];
var total_vals = [];
var count = [0, 0, 0, 0, 0];
var table = document.getElementById("sensor-table");

//fill area color for graphs
var colors = ['rgba(67,178,97,0.5)','rgba(247,24,113,0.5)','rgba(249,191,42,0.5)',
  'rgba(12,129,140,0.5)','rgba(152,224,233,0.5)'];

//line color for graphs
var colors_outlines = ['rgba(67,178,97,1)','rgba(247,24,113,1)','rgba(249,191,42,1)',
  'rgba(12,129,140,1)','rgba(152,224,233,1)'];

var datapoints1 = [];
var datapoints2 = [];
var datapoints3 = [];
var timepoints1 = [];
var timepoints2 = [];
var timepoints3 = [];

function convert_spl(data){

	var temp = Math.abs(data*0.003125-1.65)/60;
	temp = 20*Math.log(temp/0.00002)/Math.log(10);
	if (temp < 0)
		temp = 0;
	return temp;
}

function store_local(){
  $.getJSON( "http://gw-bd.ccs.miami.edu:8080/sensor/001", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      datapoints1.push(convert_spl(parseInt(val.volume)));
      timepoints1.push(convert_spl(parseInt(val.ts)));
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
  });
  $.getJSON( "http://gw-bd.ccs.miami.edu:8080/sensor/002", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      datapoints2.push(parseInt(convert_spl(val.volume)));
      timepoints2.push(parseInt(convert_spl(val.ts)));
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
  });
  $.getJSON( "http://gw-bd.ccs.miami.edu:8080/sensor/003", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      datapoints3.push(parseInt(convert_spl(val.volume)));
      timepoints3.push(parseInt(convert_spl(val.ts)));
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
  });
}

function create_table(){
	var headers = ["Sensor","Current","Min","Average","Max"];
	
	var row = table.insertRow(0);
	for (var i = 0; i < headers.length; i++){
		var temp_cell = row.insertCell(i);
		temp_cell.innerHTML = headers[i];
	}
	for (var i = 0; i < numSensors; i++){
		var temp_row = table.insertRow(i+1);
		for (var j = 0; j < headers.length; j++){
			var temp_cell = temp_row.insertCell(j);
			//temp_cell.innerHTML = "("+i+","+j+")";
		}
		max_vals.push(0);
		min_vals.push(999);
		curr_vals.push(0);
		total_vals.push(0);
	}
}

create_table();

var chart = new SmoothieChart({millisPerPixel:24,scaleSmoothing:0.119,grid:{fillStyle:'#192026',strokeStyle:'rgba(255,255,255,0.4)',millisPerLine:10000,verticalSections:8},labels:{fontSize:13},maxValue: 80, minValue: 0,timestampFormatter:SmoothieChart.timeFormatter}),
    canvas = document.getElementById('index-smoothie-chart');

// Data
for (var i = 0; i < numSensors; i++){
	sensors.push(new TimeSeries());
}

// Add a random value to each line every second
setInterval(function() {
	var next_value = [datapoints1.pop(), datapoints2.pop(),datapoints3.pop()];
	var next_time = [timepoints1.pop(), timepoints2.pop(),timepoints3.pop()];
	for (var i = 0; i < numSensors; i++){
		count[i]++;
		var maxchanged = false;
		var minchanged = false;
		var averagechanged = false;

		
		if (next_value[i] > max_vals[i]){ 
			maxchanged = true;
			max_vals[i] = next_value[i]; 
		}
		if (next_value[i] < min_vals[i]){ 
			minchanged = true;
			min_vals[i] = next_value[i]; 
		}
		curr_vals[i] = next_value[i];
		if (next_value[i] > 0 && next_value[i] < 10000)
			total_vals[i] += next_value[i];
		
		table.rows[i+1].cells[0].innerHTML = "<span style='background: "+colors_outlines[i]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>Sensor "+(i+1)+"</span>";
		//current
		table.rows[i+1].cells[1].innerHTML = Number(Math.round(100*curr_vals[i],2)/100).toFixed(2);
		//min
		if (minchanged){
			table.rows[i+1].cells[2].innerHTML = "<span style='background: "+colors_outlines[i]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>"+(Math.round(100*min_vals[i],2)/100).toFixed(2)+"</span>";
		}
		else{
			table.rows[i+1].cells[2].innerHTML = "<span style='padding: 3px; font-weight: 500; border-radius: 5px'>"+(Math.round(100*min_vals[i],2)/100).toFixed(2)+"</span>";
		}
		

		//average
		table.rows[i+1].cells[3].innerHTML = (Math.round(100*total_vals[i]/(count[i]),2)/100).toFixed(2);

		//max
		if (maxchanged){
			table.rows[i+1].cells[4].innerHTML = "<span style='background: "+colors_outlines[i]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>"+(Math.round(100*max_vals[i],2)/100).toFixed(2)+"</span>";
		}
		else{
			table.rows[i+1].cells[4].innerHTML = "<span style='padding: 3px; font-weight: 500; border-radius: 5px'>"+(Math.round(100*max_vals[i],2)/100).toFixed(2)+"</span>";
		}
		var t = next_time[i];
		//console.log(t);
		//2017 05 19 15 25 54 156
		//YYYYMMDDHHMMSSmil
		//76543210987654321
		var temp = new Date(
			 Math.floor(t/Math.pow(10,13)), //year
		   Math.floor(((t/Math.pow(10,11))%100)-1), //month
			Math.floor((t/Math.pow(10,9))%100), //day
			Math.floor((t/Math.pow(10,7))%100), //hour
			Math.floor((t/Math.pow(10,5))%100), //minute
			Math.floor((t/Math.pow(10,3))%100), //second
			 Math.floor(t%1000)); // millisecond
		//console.log("     temp: "+temp);
		//console.log("curr date: "+ (new Date()));
		temp = temp.getTime();
		//console.log(temp);
		//console.log(new Date().getTime());
		sensors[i].append(new Date().getTime()+1000, next_value[i]);
	}
}, 1000);



for (var i = 0; i < numSensors; i++){
	chart.addTimeSeries(sensors[i], {lineWidth:4,strokeStyle:colors_outlines[i]});
}
chart.streamTo(canvas, 500);