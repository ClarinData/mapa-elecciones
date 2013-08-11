
/************************************************************************/
/*  Variables Globales                                                  */
/************************************************************************/
var vista = "diputados"; //  ["diputados" || "senadores"]

/************************************************************************/
/*  Utilidad: recibe un numero y lo devuelve con separador de centenas  */
/************************************************************************/

function miles(n){
	var r = ""; 
	for (var p, i = n.length - 1, p = 0; i >= 0; i--, p++){ 
		r = n.charAt(i) + ((p > 0) && (p % 3 == 0)? ".": "") + r;
	}
	return r; 
} 

/************************************************************************/
/* Cambia status de boton Mapa izquierdo y cartel descriptivo de arriba */
/************************************************************************/

function cerrarCreditos(){
	d3.select("#modal").style("display", "none");
}

function abrirCreditos(){
	d3.select("#modal").style("display", "inline");
}

function updateVistaButton(option){
	if (option == "diputadosBtn"){
		d3.select("#diputadosBtn").classed("diputadosBtnSelected",true);		
		d3.select("#senadoresBtn").classed("senadoresBtnSelected",false);		
		d3.select("#diputadosBtn").classed("diputadosBtnNotSelected",false);		
		d3.select("#senadoresBtn").classed("senadoresBtnNotSelected",true);			
		d3.select("#selectorMapa").classed("selectSenadores",false);			
		d3.select("#selectorMapa").classed("selectDiputados",true);	
		vista = "diputados";	
	}else{
		d3.select("#diputadosBtn").classed("diputadosBtnSelected",false);		
		d3.select("#senadoresBtn").classed("senadoresBtnSelected",true);		
		d3.select("#diputadosBtn").classed("diputadosBtnNotSelected",true);		
		d3.select("#senadoresBtn").classed("senadoresBtnNotSelected",false);		
		d3.select("#selectorMapa").classed("selectSenadores",true);			
		d3.select("#selectorMapa").classed("selectDiputados",false);		
		vista = "senadores";	
	}
}

function updateLeftButton(option){
	var cond = [false, true];
	var arr = ["#provBtn","#partBtn","#votoBtn"];
	if (option == "votoBtn"){ cond[0] = true; cond[1] = false; }	

	// Muestro Descripcion Relevante (Arriba)
	d3.select("#referenciasGenerales").classed("descMuestro",cond[1]);		
	d3.select("#referenciasGenerales").classed("descOculto",cond[0]);		
	d3.select("#referenciasVotos").classed("descOculto",cond[1]);
	d3.select("#referenciasVotos").classed("descMuestro",cond[0]);
	
	// Activo todos los botones de la botonera de la izquieda
	for (var i = 0; i < arr.length ; i ++ ){
		d3.select(arr[i]).classed("btnLeftIna", false);
		d3.select(arr[i]).classed("btnLeftAct", true);
	}
	
	// desactivo botón clickeado de la botonera de la izquieda
	d3.select("#"+option).classed("btnLeftAct", false);
	d3.select("#"+option).classed("btnLeftIna", true);
}



elecciones.event.on("click", function(dataE){
	switch (vista){
		case "diputados":
			if (dataE.diputados != undefined){
				updateBars(dataE.diputados);
			}
			break;
		
		case "senadores":
			if (dataE.senadores != undefined){
				updateBars(dataE.senadores);
			}
			break;
	}
});

function updateBars(objeto){
	var maximo = 0;
	if (true); maximo = 200; maximo = 150; //condicionar si total o parcial
		
	
	d3.select("#graficoBarras").selectAll("div").remove();

	var dominio = d3.scale.linear()
                 .domain( [0 , objeto.votacion.partidos_politicos[0].votos ])
                 .range( [0, maximo ]);
	
    var contenido = d3.selectAll("#graficoBarras").selectAll(".contenedorBar")
        .data(function (d){ return objeto.votacion.partidos_politicos });

    var contenidoEnter = contenido.enter()
        .append("div")
        .classed("contenedorBar", true);
        
    contenidoEnter.append("div")
		.classed("nombreBar", true)
        .text( function (d) { return d.nombre } );

    contenidoEnter.append("div")
        .classed("barraBar", true)
        .style("background-color", function (d,i){ return "#EEEEEE"; }) //ver a que fuerza pertenece y pintar acorde
        .transition()
        .duration(1000)
        .style("width", function (d) { return dominio(d.votos) + "px"; });
	
	/*

    contenidoEnter.append("div")
        .classed("barraBar", true)
        .style("background-color", function (d,i){ return "#EEEEEE"; })
        .transition()
        .duration(1000)
        .style("width", function (d) { return Math.ceil(x_w(d.votacion.partidos_politicos.votos)) + "px"; });
	
    contenidoEnter.append("div")
    	.classed("cantidadBar",true)
        .transition()
        .duration(1000)
    	.style("left", function (d) { return Math.ceil( x_w(d.votacion.partidos_politicos.votos) + 5) + "px"; })
        .text(function (d) { return "(" + miles(d.votacion.partidos_politicos.votos.toString()) + ")"; });

    contenidoEnter.append("div")
    	.classed("porcentajeBar",true)
        .transition()
        .duration(1000)
    	.style("left", function (d) { return Math.ceil( x_w(d.votacion.partidos_politicos.porcentaje) + 5) + "px"; })
        .text(function (d) { return d.votos.porcentaje + "%"; });

	*/
    contenido
    	.exit()
        .remove();


}

