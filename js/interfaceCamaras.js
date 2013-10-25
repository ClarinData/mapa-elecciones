var botonesHeader = new Array ("diputadosBtn","senadoresBtn");
var botonesMenu = new Array ("provBtn","partBtn","votoBtn");

/************************************************************************/
// modal de creditos OK
function abrirCreditos() {
	d3.select("#modal").style("display", "inline");
}

function cerrarCreditos() {
	d3.select("#modal").style("display", "none");
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
			armoCamara (dipParametros, totalDip, camaraDip);
			//elecciones.dataset = "diputados";
		}else{
			document.getElementById("selectorMapa").className = "selectSenadores";
			armoCamara (senParametros, totalSen, camaraSen);
			//elecciones.dataset = "senadores";
		}
	}

	document.getElementById(option).disabled = true;

}

