var botonesHeader = new Array ("diputadosBtn","senadoresBtn");
var botonesMenu = new Array ("provBtn","partBtn","votoBtn","camaBtn");

/************************************************************************/
// modal de creditos OK
function abrirCreditos() {
	d3.select("#modal").style("display", "inline");
}

function cerrarCreditos() {
	d3.select("#modal").style("display", "none");
}

/************************************************************************/
// separador de miles OK
function miles(n) {
	var r = "";
	for (var p, i = n.length - 1, p = 0; i >= 0; i--, p++) {
		r = n.charAt(i) + ((p > 0) && (p % 3 == 0) ? "." : "") + r;
	}
	return r;
}

/************************************************************************/
// descarta nombres que no son candidatos.

function descartar(nombre){
	var descartados = ["blancos","nulos","recurridos"];

    for(var i=0; i<descartados.length; i++) {
        if (descartados[i] === nombre){
        	return true;
        }
    }
    return false;
}
/************************************************************************/
// Cambia status de botones OK
function updateBotones(option) {

	if ( botonesHeader.indexOf(option) < 0 ){
		botonesMenu.forEach( function (btn){ document.getElementById(btn).disabled = false; } );
	}

	if ( botonesMenu.indexOf(option) < 0){
		botonesHeader.forEach( function (btn){ document.getElementById(btn).disabled = false; } );
		if (option == "diputadosBtn"){
			document.getElementById("selectorMapa").className = "selectDiputados";	
			//elecciones.dataset = "diputados";
		}else{
			document.getElementById("selectorMapa").className = "selectSenadores";
			//elecciones.dataset = "senadores";
		}
	}

	document.getElementById(option).disabled = true;
	elecciones.event.viewchange(elecciones.dataset);

	if ( document.getElementById("camaBtn").disabled ){
		d3.select("#lasCamaras").style("display", "inline");
		d3.select("#lasCamaras").style("display", "inline");
		
		// Nico
		// hacer funcion condicional en d3 para llamar a diputados o senadores 
		// dependiendo de document.getElementById("diputadosBtn").disabled
		// tambien mover de lugar los botones de share
		// y upgradear el texto de "comparti los resultados..."
		if (diputadosBtn.disabled){
			armoCamara (senParametros, totalSen, camaraSen);
		}else{
			armoCamara (dipParametros, totalDip, camaraDip);
		}


		d3.select("#referenciasColores").style("display", "none");
		d3.select("#arrowShare").style("display", "none");
		
	}else{
		d3.select("#lasCamaras").style("display", "none"); 
		d3.select("#referenciasColores").style("display", "inline");
		d3.select("#arrowShare").style("display", "inline");
	}

}

