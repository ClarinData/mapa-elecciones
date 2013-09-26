/************************************************************************/
// modal de creditos
function abrirCreditos() {
	d3.select("#modal").style("display", "inline");
}

function cerrarCreditos() {
	d3.select("#modal").style("display", "none");
}

/************************************************************************/
// separador de miles
function miles(n) {
	var r = "";
	for (var p, i = n.length - 1, p = 0; i >= 0; i--, p++) {
		r = n.charAt(i) + ((p > 0) && (p % 3 == 0) ? "." : "") + r;
	}
	return r;
}


var vistaActiva = new Array ("diputadosBtn","provBtn");
var botonesHeader = new Array ("diputadosBtn","senadoresBtn");
var botonesMenu = new Array ("provBtn","partBtn","votoBtn","camaBtn");



/************************************************************************/
// Cambia status de botones
function updateBotones(option) {

	if ( botonesHeader.indexOf(option) < 0 ){
		botonesMenu.forEach( function (btn){ document.getElementById(btn).disabled = false; } );
	}

	if ( botonesMenu.indexOf(option) < 0){
		botonesHeader.forEach( function (btn){ document.getElementById(btn).disabled = false; } );
		if (option == "diputadosBtn"){
			document.getElementById("selectorMapa").className = "selectDiputados";	
			elecciones.dataset = "diputados";
		}else{
			document.getElementById("selectorMapa").className = "selectSenadores";
			elecciones.dataset = "senadores";
		}
	}
	
	document.getElementById(option).disabled = true;
	elecciones.event.viewchange(elecciones.dataset);
	
}


/************************************************************************/
// redibuja las barras totales pais
function updateTotales(objeto) {

	var maximo = 200;

	d3.select("#graficoBarras").selectAll("div").remove();
	d3.select("#referenciaBarras").style("background-position", "0 0px");
	d3.select("#referenciaTituloProvincia").classed("descOculto", true).classed("descMuestro", false);
	d3.select("#referenciaNombreLocalidad").classed("descOculto", true).classed("descMuestro", false);
	d3.select("#referenciaTotal").classed("descOculto", true).classed("descMuestro", false);

	var dominio = d3.scale.linear().domain([0, objeto.votacion.partidos_politicos[0].votos]).range([0, maximo]);

	var contenido = d3.selectAll("#graficoBarras").selectAll(".contenedorBar").data(function(d) {
		return objeto.votacion.partidos_politicos;
	});

	var contenidoEnter = contenido.enter().append("div").classed("contenedorBar", true);

	contenidoEnter.append("div").classed("nombreBar", true).text(function(d) {
		return d.nombre;
	});

	contenidoEnter.append("div").attr("class", function(d) {
		var tempClass = "";
		if (d.fuerza_politica != undefined) {
			tempClass = "fp_" + d.fuerza_politica;
		} else {
			tempClass = "fp_SFP";
		}
		return "barraBar " + tempClass;
	}).transition().duration(500).style("width", function(d) {
		return Math.ceil(dominio(d.votos)) + "px";
	});

	contenidoEnter.append("div").classed("porcentajeBar", true).transition().duration(450).style("left", function(d) {
		return Math.ceil(dominio(d.votos) + 5) + "px";
	}).text(function(d) {
		return d.porcentaje.toLocaleString() + "%";
	});

	contenidoEnter.append("div").classed("cantidadBar", true).transition().duration(450).style("left", function(d) {
		return Math.ceil(dominio(d.votos) + 5) + "px";
	}).text(function(d) {
		return "(" + miles(d.votos.toString()) + ")";
	});

	d3.select("#votos").text(objeto.votacion.votos.porcentaje + "%");
	d3.select("#mesas").text(objeto.votacion.mesas.porcentaje + "%");

	contenido.exit().remove();
}

/************************************************************************/
// redibuja las barras detalladas
function updateBars(objeto) {"use strict";
	var maximo = 150;

	d3.select("#graficoBarras").selectAll("div").remove();
	d3.select("#referenciaBarras").style("background-position", "0 -115px");

	if (objeto.nivel_administrativo == 1) {
		d3.select("#referenciaTituloProvincia").html(objeto.nombre.toUpperCase()).classed("descOculto", false).classed("descMuestro", true);
		d3.select("#referenciaNombreLocalidad").html("").classed("descOculto", true).classed("descMuestro", false);
	}

	d3.select("#referenciaTituloProvincia").classed("descOculto", false).classed("descMuestro", true);

	d3.select("#referenciaTotal").text(" Total ").classed("descOculto", false).classed("descMuestro", true);

	if (objeto.nivel_administrativo == 2) {
		d3.select("#referenciaNombreLocalidad").html(" " + objeto.nombre).classed("descOculto", false).classed("descMuestro", true);
	}

	var dominio = d3.scale.linear().domain([0, objeto.votacion.partidos_politicos[0].votos]).range([0, maximo]);

	var contenido = d3.selectAll("#graficoBarras").selectAll(".contenedorBar").data(function(d) {
		return objeto.votacion.partidos_politicos;
	});

	var contenidoEnter = contenido.enter().append("div").classed("contenedorDet", true);

	contenidoEnter.append("div").classed("nombreDet", true).html(function(d) {
		if (d.nombre !== undefined) {
			if (d.porcentaje >= 1.5) {
				return d.nombre + " &#10004;";
			} else {
				return d.nombre;
			}
		} else {
			return d.id.toUpperCase();
		}

	}).style("text-decoration", function(d) {
		if (d.entra == "no") {
			return "line-through";
		} else {
			return "none";
		}
	});

	contenidoEnter.append("div").attr("class", function(d) {
		var tempClass = "";
		if (d.fuerza_politica !== undefined) {
			tempClass = "fp_" + d.fuerza_politica;
		} else {
			tempClass = "fp_SFP";
		}
		return "barraDet " + tempClass;
	}).transition().duration(500).style("width", function(d) {
		return Math.ceil(dominio(d.votos)) + "px";
	});

	contenidoEnter.append("div").classed("porcentajeDet", true).transition().duration(450).style("left", function(d) {
		return Math.ceil(dominio(d.votos) + 5) + "px";
	}).text(function(d) {
		return d.porcentaje.toLocaleString() + "%";
	});

	contenidoEnter.append("div").classed("cantidadDet", true).transition().duration(450).style("left", function(d) {
		return Math.ceil(dominio(d.votos) + 50) + "px";
	}).text(function(d) {
		return "(" + miles(d.votos.toString()) + ")";
	});

	d3.select("#votos").text(objeto.votacion.votos.porcentaje + "%");
	d3.select("#mesas").text(objeto.votacion.mesas.porcentaje + "%");

	contenido.exit().remove();
}

/************************************************************************/
// eventos
elecciones.event.on("updatedata", function(dataE) {"use strict";
	switch (elecciones.dataset) {
		case "diputados":
			if (dataE.diputados !== undefined) {
				if (dataE.diputados.id == "TOTALES") {
					updateTotales(dataE.diputados);
				} else {
					updateBars(dataE.diputados);
				}
			}
			break;

		case "senadores":
			if (dataE.senadores !== undefined) {
				if (dataE.senadores.id == "TOTALES") {
					updateTotales(dataE.senadores);
				} else {
					updateBars(dataE.senadores);
				}
			}
			break;
	}
});
