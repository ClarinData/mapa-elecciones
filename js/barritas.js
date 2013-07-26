var list = d3.select("#bar_map_arg").append("div");


function dibuja(data){
	
	
	var box = list.selectAll("div")
	      .data(data);


	 box.enter().append("div");
	 
	 box
	 		.style("background-color", function(d,i){console.log(col[i]);return col[i];})
	 		.style("height", "30px")
	 		.transition()
			.duration(300) 
			.style("width", function(d) { console.log(d.votos);return d.votos +"px"; });
	
	box.exit()
	 		.transition()
			.duration(100) 
			.style("opacity", 0)
			.remove();
	
	

}



dibuja(datosTotales);


function update(){
	datosTotales = 
 [
  { 
   "nombre": "F3PV",
   "votos": 150,
   "porcentaje": 30
  }, {
   "nombre": "GE3T",
   "votos": 100,
   "porcentaje": 10
}];
}


var barras = new Object({id : "bar_map_arg" });

barras.mostrar= {
	total: (function () {
		dibuja(datosTotales);
	}),

	parcial: (function () {
		//llamo al armado parcial
		update();

	})
};
