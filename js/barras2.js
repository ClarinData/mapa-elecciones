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



function muestroTotales(datos){
	var traslado = 20; //traslado h las barras
		
	var width = 290,
	    height = 400;

	var index = d3.range(datos.length),
	    valores = index.map(function(d,i){ return datos[i].v;});

	var x = d3.scale.linear()
	    .domain([0, Math.max.apply(Math, valores)])
	    .range([0, width - 90]); // - espacio para la etiqueta
	    
	var y = d3.scale.ordinal()
	    .domain(index)
	    .rangeRoundBands([0, height], .1);
	
	var svg = d3.select("#bar_map_arg")
		.append("svg")
	    .attr("width", width)
	    .attr("height", height )
		.append("g");
	
	var bar = svg.selectAll(".barra")
	    .data(valores)
	    .enter()
	    .append("g")
	    .attr("class", "barra")
	    .attr("transform", function(d, i) { return "translate(0," + (y(i)+traslado) + ")"; });
	
	bar.append("line") // linea top
	    .attr("x1", 0)
	    .attr("y1", -24)
		.attr("x2", width)
		.attr("y2", -25)
		.style("stroke", "rgb(0,0,0)")
		.style("stroke-width", 0.3)
		.style("stroke-opacity", 0.4); 

	bar.append("rect") // color vertical
	    .attr("height", 50) 
	    .attr("width", "3px")
	    .attr("transform", function(d, i) { return "translate(0,-25)" }) 
	    .attr("fill", function(d,i) { return colores[i]; });
	
	bar.append("rect") //barra
	    .attr("width", "0px")
	 	.style("opacity", 0.4)
	    .attr("fill", function(d,i) { return colores[i]; })
    	.attr("height", 25) 
		.transition().duration(1000)
	    .attr("width", x);
	
	bar.append("text") //tag partido
	    .attr("x", "10px")
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "-37px")
	    .classed("nombreP", true)
	    .text(function(d, i) { return datos[i].n.toUpperCase(); });
	
	bar.append("text") //tag votos
	 	.style("opacity", 0)
	    .attr("text-anchor", "beginning")
	    .attr("x",  "0px") 
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "-20px")
	    .classed("votos", true)
	    .text(function(d, i) { return "(" + miles(datos[i].v) + ")"; })
		.transition().duration(1000)
	    .attr("x",  function(d) { return x(d) + 10; }) 
		.style("opacity", 1);

	bar.append("text") //tag porcentaje
	 	.style("opacity", 0)
	    .attr("text-anchor", "beginning")
	    .attr("x",  "0px") 
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "-6px")
	    .classed("porcentaje", true)
	    .text(function(d, i) { return datos[i].p; })
		.transition().duration(1000)
	    .attr("x",  function(d) { return x(d) + 10; }) 
		.style("opacity", 1);

bar = d3.select("#bar_map_arg").selectAll("g");
	bar.exit().remove();


		
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