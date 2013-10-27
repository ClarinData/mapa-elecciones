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

function descartar(nom){
	var descartados = ["blancos","nulos","recurridos",""];

    for(var i=0; i<descartados.length; i++) {
       	if (descartados[i] === nom || !nom){
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
	document.getElementById("camDis").style.display = "none";
	document.getElementById(option).disabled = true;
	elecciones.event.viewchange(elecciones.dataset);
    dibuja();


	if (option === "camaBtn"){
			d3.json("data/diputados_camara_status.json", function (datos){
			displayCamaras(datos);
		});
	}
}

function displayCamaras (a){
	console.log (a.status);
		if ( a.status == "true"){
			document.getElementById("camDis").style.display = "none";
			console.log("muestro camaras");
			self.location='camaras.html';
		} else {
			console.log ("muestro cartel");
			document.getElementById("camDis").style.display = "inline";
		}		
	
	
}
