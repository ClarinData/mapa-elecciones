// Agrego listeners a todos los botones.

document.getElementById("diputadosBtn").addEventListener("click", dibuja, false);
document.getElementById("senadoresBtn").addEventListener("click", dibuja, false);
document.getElementById("provBtn").addEventListener("click", dibuja, false);
document.getElementById("partBtn").addEventListener("click", dibuja, false);
document.getElementById("votoBtn").addEventListener("click", dibuja, false);


function existeLaFoto(url){
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}


// maneja los botones, header y footer de barras.


function dibuja(){
	var datos,
		v_txt = "Sin datos",
		m_txt = "Sin datos";

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
	
	if (elecciones.dataset === "diputados") { // elijo dataset según la vista

		datos = elecciones.diputados;

	} else {

		datos = elecciones.senadores;

	}
	
	if (argentina.selection){ // está en una provincia o localidad

		datos = datos[argentina.selection];
		if (datos){
			//si hay datos se arman las barras detalladas
			m_txt = datos.votacion.mesas.per.toLocaleString() + "%";
			v_txt = datos.votacion.votos.per.toLocaleString() + "%";
			document.getElementById("referenciaBarrasDetalle").className = "descMuestro";		

			if (datos.nivel_administrativo == 2){
				document.getElementById("referenciaTotal").innerHTML = datos.nombre;
			}else{

				document.getElementById("referenciaTituloProvincia").innerHTML = datos.nombre;
				document.getElementById("referenciaTotal").innerHTML = "";
			};	
		} else { 
			// si no hay datos se avisa que no hay datos
			document.getElementById("referenciaTituloProvincia").innerHTML = argentina.datum.properties.administrative_area[0].name;
			document.getElementById("referenciaTotal").innerHTML = "";
		}

		
	}else{ // Se esta viendo el mapa completo
		
		document.getElementById("referenciaTituloProvincia").innerHTML = "RESULTADO GENERAL 2013";
		document.getElementById("referenciaTotal").innerHTML = "Es la suma de los votos obtenidos en todas las provincias, agupados según la orientación política del voto.";
		document.getElementById("referenciaBarrasDetalle").className = "descOculto";		
		
		datos = datos.TOTALES;
			m_txt = datos.votacion.mesas.per.toLocaleString() + "%";
			v_txt = datos.votacion.votos.per.toLocaleString() + "%";
	}

	dibujaBarras(datos);
	
	document.getElementById("mesas").innerHTML = m_txt;
	document.getElementById("votos").innerHTML = v_txt;
}



// dibuja las barras

function dibujaBarras(dataset){
		
	if (dataset){ // si hay datos 
		if (dataset.id === "TOTALES"){ // barras totales pais
			
			d3.select("#graficoBarras").selectAll("div").remove();
			var maximo = 200;
			var dominio = d3.scale.linear().domain([0, dataset.votacion.pp[0].votos]).range([0, maximo]);
		
			var contenido = d3.select("#graficoBarras").selectAll(".contenedorBar").data(function() {
				return dataset.votacion.pp;
			});
		
			var contenidoEnter = contenido.enter().append("div").classed("contenedorBar", true);
		
			contenidoEnter.append("div").classed("nombreBar", true).text(function(d) {
				return d.nombre;
			});
		
			contenidoEnter.append("div").attr("class", function(d) {
				var tempClass = "";
				if (d.fuerza) {
					tempClass = "fp_" + d.fuerza;
				} else {
					tempClass = "fp_SFP";
				}
				return "barraBar " + tempClass;
			}).style("width", function(d) {
				return Math.ceil(dominio(d.votos)) + "px";
			});

			contenidoEnter.append("div").classed("porcentajeBar", true).style("left", function(d) {
				return Math.ceil(dominio(d.votos) + 5) + "px";
			}).text(function(d) {
				return d.per.toLocaleString() + "%";
			});

			contenidoEnter.append("div").classed("cantidadBar", true).style("left", function(d) {
				return Math.ceil(dominio(d.votos) + 5) + "px";
			}).text(function(d) {
				return "(" + miles(d.votos.toString()) + ")";
			});
			
			contenido.exit().remove();

		}else{ // barras detalle provincia o departamento

			var maximo = 120;
			
			d3.select("#graficoBarras").selectAll("div").remove();
			d3.select("#referenciaBarras").style("background-position", "0 -115px");
		
			var dominio = d3.scale.linear().domain([0, dataset.votacion.pp[0].votos]).range([0, maximo]);
		
			var contenido = d3.selectAll("#graficoBarras").selectAll(".contenedorBar").data(function(d) {
				return dataset.votacion.pp;
			});
		
			var contenidoEnter = contenido.enter()
					.append("div")
					.classed("contenedorDet", true)
					.style("background", function (d)
						{
							var provincia = "";
							if (dataset.nivel_administrativo === 1){
								provincia = dataset.id;
							}else{
								provincia = dataset.parentId;
							}
							
							var foto = "img/caritas/" + elecciones.dataset +"\/"+ provincia + "-" + d.id + ".png";
							if (existeLaFoto(foto)){
								return "white url(" + foto + ") no-repeat 95% 100%";
							}else{
								if ( descartar(d.id) ){
									return "white";
								}else{
									return "white url(img/caritas/silueta.png) no-repeat 95% 100%";
								}
							}
						}
					);	
			
			contenidoEnter.append("div").classed("nombreDet", true).html(function(d) {
				if (d.nombre !== undefined) {
					return d.nombre;
				} else {
					return d.id.toUpperCase();
				}
		
			});
		
			contenidoEnter.append("span").classed("candidatoDet", true).text(function(d) {
				if ( d.nombre === undefined || descartar(d.id) ){
					return "";
				}else{
					if (dataset.nivel_administrativo === 1){
						if (elecciones[elecciones.dataset][dataset.id].votacion.candidatos[d.id] !== undefined){
							return elecciones[elecciones.dataset][dataset.id].votacion.candidatos[d.id].candidato + " - ";
						};
					}else{
						if (elecciones[elecciones.dataset][dataset.parentId].votacion.candidatos[d.id] !== undefined){
							return elecciones[elecciones.dataset][dataset.parentId].votacion.candidatos[d.id].candidato + " - ";
						};
					}					
				}
			});		

			contenidoEnter.append("span").classed("cantidadDet", true).text(function(d) {
				return miles(d.votos.toString()) + " votos";
			});
		
			contenidoEnter.append("div").attr("class", function(d) {
				var tempClass = "";
				if (d.fuerza !== undefined) {
					tempClass = "fp_" + d.fuerza;
				} else {
					tempClass = "fp_SFP";
				}
				return "barraDet " + tempClass;
			}).style("width", function(d) {
				return Math.ceil(dominio(d.votos)) + "px";
			});
		
			contenidoEnter.append("div").classed("porcentajeDet", true).style("left", function(d) {
					return Math.ceil(dominio(d.votos) + 5) + "px";
				}).text(function(d) {
					return d.per.toLocaleString() + "%";
				});
		
			contenidoEnter.append("div").classed("lineaDet", true);

			contenidoEnter.append("div").text(function(d) {
					if ( descartar(d.id) ) {
						return "";			
					}
					return "-";
				}).attr("class", function(d) {
				var tempClass = "";
				if (d.fuerza !== undefined) {
					tempClass = "fp_" + d.fuerza;
				} else {
					tempClass = "fp_SFP";
					if ( descartar(d.id) ) {
						tempClass = "";			
					}
				}
				return "bancasDet " + tempClass;
			});
		
			contenido.exit().remove();
		}
	
	} else { // Es una provincia sin datos
		d3.select("#graficoBarras").selectAll("div").remove();
		d3.select("#graficoBarras").append("div").classed("sinDatos", true).text("Sin Datos Para Visualizar");
	}
}
