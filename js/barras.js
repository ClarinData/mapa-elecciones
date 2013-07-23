//variables de testeo.
var colores = ["#76a4c1","#cd8581","#d3c56b","#bbc5a0","#9988b3","#6f6f6f"]; //colores planos ; alpha .4 para las barras 

var datosTotales = [
				{"n": "Frente para Victoria", 	"v": "107525233" , 	"p": "30.23%"},
				{"n": "Union Cívica Radical", 	"v": "10254856" , 	"p": "20.31%"},
				{"n": "Aliados K", 				"v": "9452654" , 	"p": "10.32%"},
				{"n": "PJ no K", 				"v": "2621487" , 	"p": "4.56%"},
				{"n": "FAP", 					"v": "342123" , 	"p": "3.32%"},
				{"n": "Otros", 					"v": "14121" , 		"p": "2.05%"}
			];




//mustra los totales de las fuerzas politicas
function muestroTotales(datos){
	var ancho = 290; //ancho del div
	var temp, mayor= Number.NEGATIVE_INFINITY;
	
	//saco el mayor	
	for (var i = 0;  i< datos.length; i++) {  
		temp = parseInt(datos[i].v);
    	if (temp > mayor){
    		mayor = temp;
   		} 
	}
	
	var desplazaX = d3.scale.linear() 
		.domain([0, mayor])
		.range(["0px", "290px"]);
		
	var detalle_lista = d3.select("#bar_map_arg").selectAll("div")
		.data(datos);
		
	detalle_lista.enter().append("div")
		.attr("width", "0px")
		.attr("background-color", function(d,i){ return colores[i];})
		.text( function(d) {  return miles(d.v);} )
		.transition()
		.duration(2500)
		.attr("width", function(d){ return desplazaX(d.v);  });
		
	detalle_lista.exit().remove();
		
}


//armo objeto y le asigno eventos 
var barras = new Object({id : "bar_map_arg" });

barras.mostrar= {
	total: (function () {
		muestroTotales(datosTotales);
	}),

	parcial: (function () {
		//llamo al armado parcial
		//muestroTotales(otrosDatos);
	})
};