// Agrego listeners a todos los botones.

document.getElementById("diputadosBtn").addEventListener("click", dibuja, false);
document.getElementById("senadoresBtn").addEventListener("click", dibuja, false);
document.getElementById("provBtn").addEventListener("click", dibuja, false);
document.getElementById("partBtn").addEventListener("click", dibuja, false);
document.getElementById("votoBtn").addEventListener("click", dibuja, false);
document.getElementById("camaBtn").addEventListener("click", dibuja, false);


function dibuja(){

	switch (this.id){ // refresco datos del mapa según botón clickeado

		case "provBtn":
			argentina.vista.prov();
			document.getElementById("referenciasVotos").className  = "descOculto";
			break;

		case "partBtn":
			argentina.vista.part();
			document.getElementById("referenciasVotos").className  = "descOculto";
			break;

		case "votoBtn":
			argentina.vista.voto();
			document.getElementById("referenciasVotos").className  = "descMuestro";
			break;
		case "diputadosBtn":
			elecciones.dataset = "diputados";
			//cambia el display del mapa;	
			elecciones.event.viewchange();
   			break;
		case "senadoresBtn":
			elecciones.dataset = "senadores";
			//cambia el display del mapa;	
			elecciones.event.viewchange();
        	break;
	}
	
	console.log("pase");

	var datos;
	if (elecciones.dataset === "diputados") {
		datos = elecciones.diputados;
	} else {
		datos = elecciones.senadores;
	}
	
	if (argentina.selection){
		// estoy en provincia o localidad
		datos = datos[argentina.selection]; 
		document.getElementById("referenciaTituloProvincia").innerHTML = datos.nombre;
		document.getElementById("referenciaTotal").innerHTML = "";
		document.getElementById("referenciaBarrasDetalle").className = "descMuestro";		
	}else{
		//estoy en el mapa de Argentina.
		datos = datos.TOTALES; 
		document.getElementById("referenciaTituloProvincia").innerHTML = "RESULTADO GENERAL 2013";
		document.getElementById("referenciaTotal").innerHTML = "Es la suma de los votos obtenidos en todas las provincias, agupados según la orientación política del voto.";
		document.getElementById("referenciaBarrasDetalle").className = "descOculto";		
	}

	var mensaje = (datos) ? datos : "Esta provincia no elige Senadores";  		
	document.getElementById("graficoBarras").innerHTML = mensaje + Math.round(Math.random()*100);


/*
	var maximo = 200;
	var dominio = d3.scale.linear().domain([0, datos.TOTALES.votacion.partidos_politicos[0].votos]).range([0, maximo]);
	var dominio = d3.scale.linear().domain([0, elecciones.diputados.TOTALES.votacion.partidos_politicos[0].votos]).range([0, maximo]);

	var contenido = d3.selectAll("#graficoBarras").selectAll(".contenedorBar").data(function(d) {
		return elecciones.votacion.partidos_politicos;
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

		
	
	
	console.log ("pase por dibuja" + Math.random());
	
	
	
	
	var dondeEstoy = (argentina.selection) ? argentina.selection :  "Argentina";
	document.getElementById("graficoBarras").innerHTML  = "Se desactiva: " + this.id + "<br> Mi set de datos es: " + elecciones.dataset + "<br> Seleccion: " + dondeEstoy;
*/
}


