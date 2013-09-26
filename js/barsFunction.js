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
function updateTotales(objeto) { "use strict";
	
	document.getElementById("graficoBarras").innerHTML = "Muestro TOTAL PAIS";

	d3.select("#votos").text(objeto.votacion.votos.porcentaje + "%");
	d3.select("#mesas").text(objeto.votacion.mesas.porcentaje + "%");
}

/************************************************************************/
// redibuja las barras detalladas

function updateBars(objeto) { "use strict";

	document.getElementById("graficoBarras").innerHTML = "Mustro DETALLE";

	d3.select("#votos").text(objeto.votacion.votos.porcentaje + "%");
	d3.select("#mesas").text(objeto.votacion.mesas.porcentaje + "%");
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
