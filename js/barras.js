/************************************************************************/
/*  DATOS FALSOS                                                        */
/************************************************************************/
var colores = ["#76a4c1","#cd8581","#d3c56b","#bbc5a0","#9988b3","#6f6f6f"];
var datos = [
   { "partido_politico":"Frente para Victoria", "votos":{ "cantidad":12523458, "porcentaje":30.23 } },
   { "partido_politico":"Union Civica Radical", "votos":{ "cantidad":10254856, "porcentaje":20.31 } },
   { "partido_politico":"Aliados K", "votos":{ "cantidad":9945654, "porcentaje":10.32 } },
   { "partido_politico":"PJ no K", "votos":{ "cantidad":5621487, "porcentaje":4.56 } },
   { "partido_politico":"FAP", "votos":{ "cantidad":342123, "porcentaje":3.32 } },
   { "partido_politico":"Otros", "votos":{ "cantidad":14121, "porcentaje":2.05 } }
];


/************************************************************************/
/*  recibe un numero y lo devuelve con separador de centenas            */
/************************************************************************/
function miles(e){e=e.toString(); var t="";for(var n,r=e.length-1,n=0;r>=0;r--,n++){t=e.charAt(r)+(n>0&&n%3==0?".":"")+t}return t}

/************************************************************************/
/*  Cambia status del boton izquierdo                                   */
/************************************************************************/

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

/************************************************************************/
/*  updatea las barras + falta ver como vienen los datos                */
/************************************************************************/
function updateBars(){
	console.log("run Updatebars");
	// falta ver la barra de arriba y abajo dependiendo el objeto a recibir

	var index = d3.range(datos.length),
		valores = index.map(function(d,i){ return datos[i].votos.cantidad;});
	
	var x_w = d3.scale.linear()
	    .domain([0, Math.max.apply(Math, valores)])
	    .range([0, 260 - 70]); // - espacio para la etiqueta	
	
    var contenido = d3.select("#bar_map_arg").selectAll("div.contenedorBar")
        .data(datos, function (d) { return d.partido_politico + d.votos.cantidad; });

    var contenidoEnter = contenido.enter()
        .append("div")
        .classed("contenedorBar", true);

    contenidoEnter.append("div")
		.classed("nombreBar", true)
        .text(function (d) { return d.partido_politico; });

    contenidoEnter.append("div")
        .classed("barraBar", true)
        .style("background-color", function (d,i){ return colores[i]; })
        .transition()
        .duration(1000)
        .style("width", function (d) { return x_w(d.votos.cantidad) + "px"; });

    contenidoEnter.append("div")
    	.classed("cantidadBar",true)
        .text(function (d) { return miles(d.votos.cantidad.toString()); });

    contenido
    	.exit()
        .remove();

}
