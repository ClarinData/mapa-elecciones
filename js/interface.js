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
// Cambia status de botones OK
function updateBotones(option) {
	var botonesHeader = new Array ("diputadosBtn","senadoresBtn");
	var botonesMenu = new Array ("provBtn","partBtn","votoBtn","camaBtn");

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
}

