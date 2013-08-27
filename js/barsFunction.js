/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 5, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global mapObject, d3 */
/* exported argentina elecciones */

/************************************************************************/
/*                                                                      */
/*  Funciones de las barras de valores del panel derecho  08-2013       */
/*                                                                      */
/************************************************************************/

var vista = "diputados";
//  ["diputados" || "senadores"]

/************************************************************************/
// recibe un String y devuelve con separador de miles
function miles(n) {
	var r = "";
	for (var p, i = n.length - 1, p = 0; i >= 0; i--, p++) {
		r = n.charAt(i) + ((p > 0) && (p % 3 == 0) ? "." : "") + r;
	}
	return r;
}

/************************************************************************/
// Abre el modal de creditos
function abrirCreditos() {
	d3.select("#modal").style("display", "inline");
}

/************************************************************************/
// Cierra el modal de creditos
function cerrarCreditos() {
	d3.select("#modal").style("display", "none");
}

/************************************************************************/
// Cambia status de boton Mapa izquierdo y cartel descriptivo de arriba
function updateVistaButton(option) {
	var activo = true;

	switch (option) {
		case "diputadosBtn":
			vista = "diputados";
			d3.select("#diputadosBtn").classed("diputadosBtnNotSelected", false);
			d3.select("#senadoresBtn").classed("senadoresBtnSelected", false);
			d3.select("#selectorMapa").classed("selectSenadores", false);

			d3.select("#diputadosBtn").classed("diputadosBtnSelected", true);
			d3.select("#senadoresBtn").classed("senadoresBtnNotSelected", true);
			d3.select("#selectorMapa").classed("selectDiputados", true);
			break;

		case "senadoresBtn":
			d3.select("#senadoresBtn").classed("senadoresBtnNotSelected", false);
			d3.select("#diputadosBtn").classed("diputadosBtnSelected", false);
			d3.select("#selectorMapa").classed("selectDiputados", false);

			d3.select("#senadoresBtn").classed("senadoresBtnSelected", true);
			d3.select("#diputadosBtn").classed("diputadosBtnNotSelected", true);
			d3.select("#selectorMapa").classed("selectSenadores", true);
			vista = "senadores";
			break;
	}

	elecciones.event.viewchange(vista);
}

/************************************************************************/
// Recibe el id del boton clickeado, lo desactiva y activa el resto
function updateLeftButton(option) {
	var cond = [false, true];
	var arr = ["#provBtn", "#partBtn", "#votoBtn"];
	if (option == "votoBtn") {
		cond[0] = true;
		cond[1] = false;
	}

	// Muestro Descripcion Relevante (Arriba)
	d3.select("#referenciasGenerales").classed("descMuestro", cond[1]);
	d3.select("#referenciasGenerales").classed("descOculto", cond[0]);
	d3.select("#referenciasVotos").classed("descOculto", cond[1]);
	d3.select("#referenciasVotos").classed("descMuestro", cond[0]);

	// Activo todos los botones de la botonera de la izquieda
	for (var i = 0; i < arr.length; i++) {
		d3.select(arr[i]).classed("btnLeftIna", false);
		d3.select(arr[i]).classed("btnLeftAct", true);
	}

	// desactivo botón clickeado de la botonera de la izquieda
	d3.select("#" + option).classed("btnLeftAct", false);
	d3.select("#" + option).classed("btnLeftIna", true);
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
	switch (vista) {
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
