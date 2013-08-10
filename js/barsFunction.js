
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
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;


	console.log("Se clickeo algo!", dataE);

	if (dataE.diputados){
		switch (vista){
				case "diputados": 
					updateBars(dataE.diputados);
					break;
				case "senadores":
					updateBars(dataE.senadores);
					break;
		}
	}
});


function estaVacio(obj) {
    if (obj == null) return true;
    if (obj.length && obj.length > 0) return false;
    if (obj.length === 0)  return true;
    for (var key in obj) { if (hasOwnProperty.call(obj, key))    return false; }
    return true;
}

function updateBars(objeto){
	d3.select("#graficoBarras").selectAll("div").remove();

}


/************************************************************************/
/*  updatea las barras Generales                                        */
/************************************************************************/
function updateGeneralBars(objeto){

// ver como vienen los datos
	d3.select("#graficoBarras").append("p").text("Datos Generales: está la lógica falta ver con datos");
}

/************************************************************************/
/*  updatea las barras detalladas                                       */
/************************************************************************/

function updateDetailedBars(objeto){

// ver como vienen los datos
	d3.select("#graficoBarras").append("p").text ("Datos Detallados: está la lógica falta ver con datos");
}