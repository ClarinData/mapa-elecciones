
/************************************************************************/
/*  Variables Globales                                                  */
/************************************************************************/
var vista = "diputados"; //  ["diputados" || "senadores"]

/************************************************************************/
/*  Utilidad: recibe un numero y lo devuelve con separador de centenas  */
/************************************************************************/

function miles(e){e=e.toString(); var t="";for(var n,r=e.length-1,n=0;r>=0;r--,n++){t=e.charAt(r)+(n>0&&n%3==0?".":"")+t}return t}

/************************************************************************/
/* Cambia status de boton Mapa izquierdo y cartel descriptivo de arriba */
/************************************************************************/

function updateVistaButton(option){
	if (option == "diputadosBtn"){
		d3.select("#diputadosBtn").classed("diputadosBtnSelected",true);		
		d3.select("#senadoresBtn").classed("senadoresBtnSelected",false);		
		d3.select("#diputadosBtn").classed("diputadosBtnNotSelected",false);		
		d3.select("#senadoresBtn").classed("senadoresBtnNotSelected",true);			
		d3.select("#selectorMapa").classed("selectSenadores",false);			
		d3.select("#selectorMapa").classed("selectDiputados",true);		
	}else{
		d3.select("#diputadosBtn").classed("diputadosBtnSelected",false);		
		d3.select("#senadoresBtn").classed("senadoresBtnSelected",true);		
		d3.select("#diputadosBtn").classed("diputadosBtnNotSelected",true);		
		d3.select("#senadoresBtn").classed("senadoresBtnNotSelected",false);		
		d3.select("#selectorMapa").classed("selectSenadores",true);			
		d3.select("#selectorMapa").classed("selectDiputados",false);		
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
	console.log ("Objeto recibido: ", dataE)
});
  
  
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