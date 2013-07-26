//variables de testeo.

var width = 290,
    height = 455;

var svgBar = d3.select("#bar_map_arg") //Add SVG to stage for the bars 
		.style("overflow", "hidden")
		.append("svg")
	    .attr("width", width)
	    .attr("height", height);



function muestroTotales(datos){
	var translate = -10; // v_translate of bars
	var space = 90; // label h_space
	var aIn = 200; //time of animation
	
	var index = d3.range(datos.length),
	    valores = index.map(function(d,i){ return datos[i].v;});

	var x = d3.scale.linear()
	    .domain([0, Math.max.apply(Math, valores)])
	    .range([0, width - space]); 
	    
	var y = d3.scale.ordinal()
	    .domain(index)
	    .rangeRoundBands([0, height], .1);

	var group = svgBar.selectAll("g")
	    .data(datos);
	    
	var element = group.enter()
	    .append("g")
		.attr("transform", function(d, i) { return "translate(0," + (y(i)+ translate ) + ")"; });			

	//each political force into the same group  elements
	element // linea top
		.append("line") 
	    .attr("x1", 0)
	    .attr("y1", 0)
		.attr("x2", width)
		.attr("y2", 0)
		.style("stroke", "rgb(0,0,0)")
		.style("stroke-width", 0.3)
		.style("stroke-opacity", 0.4); 	
	
	element // label of political force
		.append("text")
	    .attr("x", "10px")
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "-10px")
	    .classed("nombreP", true)
	    .text(function(d, i) { return datos[i].n.toUpperCase(); });
	    
	element	// color bar of percentage
		.append("rect")
	    .attr("width", "0px")
	    .attr("transform", function(d, i) { return "translate(10,29)" }) 
	    .attr("fill", function(d,i) { return col[i]; })
    	.attr("height", 25) 
		.transition()
		.duration(aIn)
	    .attr("width", function(d) {return x(d.v)} );
	    
	element //tag votes
		.append("text") 
	 	.style("opacity", 0)
	    .attr("text-anchor", "beginning")
	    .attr("x",  "0px") 
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "8px")
	    .attr("dx", "10px")
	    .classed("votos", true)
	    .text(function(d, i) { return "(" + miles(datos[i].v) + ")"; })
		.transition()
		.duration(aIn)
	    .attr("x",  function(d) { return x(d.v) + 10; }) 
		.style("opacity", 1);	    
	    
	element //tag XX.XX%
		.append("text") 
	 	.style("opacity", 0)
	    .attr("text-anchor", "beginning")
	    .attr("x",  "0px") 
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", "23px")
	    .attr("dx", "10px")
	    .classed("porcentaje", true)
	    .text(function(d, i) { return datos[i].p; })
		.transition().duration(aIn)
	    .attr("x",  function(d) { return x(d.v) + 10; }) 
		.style("opacity", 1);	    

	group
		.exit()
		
		.transition()
		.duration(aIn)
	 	.style("opacity", 0)
		.remove();
}



//Arma datos por provincia

function muestroParciales(datos){
		
	var s_w = 270;
	var s_h = 10;

	var partidos = d3.select("#bar_map_arg")
			.style("overflow", "auto")
			.append("div");
			
	var contenido = partidos.selectAll("div")
	    .data(datos);
		
	contenido.enter() //agrego div contenedor del partido
		.append("div")
		.classed("panelcollapsed",true)

	contenido.selectAll('h1') // H1 nombre del partido
	    .data(function(d) { return [d]; })
	    .enter().append('h1')
	    .text(function(d) { return d.n; });
	
	contenido.selectAll('svg') // DIV datos electorales
	    .data(function(d) { return [d.v]; })
	    .enter().append('svg')
		.attr("width", s_w)
		.attr("height", s_h);

	contenido.selectAll('h2') // H2 para el desplegable
	    .data(function(d) { return [d]; })
	    .enter()
	    .append('h2')
		.text("Interna");

	contenido.selectAll('div') //contenido de la interna
	    .data(function(d) { return [d]; })
	    .enter()
	    .append('div')
		.classed("panelcontent", true)
		.text("nombre apellido");

	contenido.exit().remove();
}






var barras = new Object({id : "bar_map_arg" });

barras.mostrar= {
	total: (function () {
		console.log(datosTotales);
		muestroTotales(datosTotales);
	}),

	parcial: (function () {
		//llamo al armado parcial
		muestroParciales(otrosDatos);

	})
};
