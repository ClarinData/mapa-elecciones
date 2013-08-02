//changes left buttons status.

function updateButton(option){
	console.log("run updateButton to " + option);
	var arr = ["#btn_voto","#btn_prov","#btn_part"];
	
	for (var i = 0; i < arr.length ; i ++ ){
		d3.select(arr[i]).classed("btnIna", false);
		d3.select(arr[i]).classed("btnAct", true);
	}
	
	d3.select("#"+option).classed("btnAct", false);
	d3.select("#"+option).classed("btnIna", true);
}

// updates data of top right, bottom right and bars of middle right pannels
function updateBars(){
	console.log("run Updatebars");
	//functions on barsprototipe.js to be pasted with data
	
	
	//update top - id: bar_map_tit	
	//update middle - id: bar_map_arg
	//update bottom - id: bar_map_tot
}
