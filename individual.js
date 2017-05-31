var headers = ["Sensor","Current","Min","Average","Max"];
var sensors = [];
var numSensors = 1;

var max_vals = [];
var min_vals = [];
var curr_vals = [];
var total_vals = [];
var count = [0, 0];
var table = document.getElementById("sensor-table");
var colors = ['rgba(67,178,97,0.5)','rgba(247,24,113,0.5)','rgba(249,191,42,0.5)',
  'rgba(12,129,140,0.5)','rgba(152,224,233,0.5)'];
var colors_outlines = ['rgba(67,178,97,1)','rgba(247,24,113,1)','rgba(249,191,42,1)',
  'rgba(12,129,140,1)','rgba(152,224,233,1)'];
var sensornum = document.getElementById("sensornum").innerHTML;

var datapoints1 = [];
var datapoints3 = [];

function convert_spl(data){

	var temp = Math.abs(data*0.003125-1.65)/60;
	temp = 20*Math.log(temp/0.00002)/Math.log(10);
	if (temp < 0)
		temp = 0;
	return temp;
}

function store_local(){
	var str = "http://gw-bd.ccs.miami.edu:8080/sensor/00"+sensornum;
	console.log(str);
  $.getJSON( str, function( data ) {
    var items = [];
    var numitems = 0;
    $.each( data, function( key, val ) {
    	numitems++;
      datapoints1.push(convert_spl(parseInt(val.volume)));
      //items.push( "<li id='" + key + "'>" +val.ts+": "+ val.volume + "</li>" );
    });
    if (numitems == 0){
    	throw new Error("api isn't working properly");
    }
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

var chart = new SmoothieChart({millisPerPixel:24,scaleSmoothing:0.119,grid:{fillStyle:'#192026',strokeStyle:'rgba(255,255,255,0.4)',millisPerLine:10000,verticalSections:8},maxValue: 80, minValue: 0,labels:{fontSize:13},timestampFormatter:SmoothieChart.timeFormatter}),
    canvas = document.getElementById('smoothie-chart');

// Data
for (var i = 0; i < numSensors; i++){
	sensors.push(new TimeSeries());
}

// Add a random value to each line every second
setInterval(function() {
	var next_value = [datapoints1.pop(), datapoints3.pop()];
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
		
		table.rows[i+1].cells[0].innerHTML = "<span style='background: "+colors_outlines[sensornum-1]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>Sensor "+sensornum+"</span>";
		//current
		table.rows[i+1].cells[1].innerHTML = Number(Math.round(100*curr_vals[i],2)/100).toFixed(2);
		//min
		if (minchanged){
			table.rows[i+1].cells[2].innerHTML = "<span style='background: "+colors_outlines[sensornum-1]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>"+(Math.round(100*min_vals[i],2)/100).toFixed(2)+"</span>";
		}
		else{
			table.rows[i+1].cells[2].innerHTML = "<span style='padding: 3px; font-weight: 500; border-radius: 5px'>"+(Math.round(100*min_vals[i],2)/100).toFixed(2)+"</span>";
		}
		

		//average
		table.rows[i+1].cells[3].innerHTML = (Math.round(100*total_vals[i]/(count[i]),2)/100).toFixed(2);

		//max
		if (maxchanged){
			table.rows[i+1].cells[4].innerHTML = "<span style='background: "+colors_outlines[sensornum-1]+"; padding: 3px; color: #223; font-weight: 500; border-radius: 5px'>"+(Math.round(100*max_vals[i],2)/100).toFixed(2)+"</span>";
		}
		else{
			table.rows[i+1].cells[4].innerHTML = "<span style='padding: 3px; font-weight: 500; border-radius: 5px'>"+(Math.round(100*max_vals[i],2)/100).toFixed(2)+"</span>";
		}
		

		sensors[i].append(new Date().getTime(), next_value[i]);
	}
}, 1000);


chart.addTimeSeries(sensors[0], {lineWidth:4,strokeStyle:colors_outlines[sensornum-1],fillStyle:colors[sensornum-1]});
chart.streamTo(canvas, 500);