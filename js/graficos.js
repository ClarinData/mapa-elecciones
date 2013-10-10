// Agrego listeners a todos los botones.

document.getElementById("diputadosBtn").addEventListener("click", dibuja, false);
document.getElementById("senadoresBtn").addEventListener("click", dibuja, false);
document.getElementById("provBtn").addEventListener("click", dibuja, false);
document.getElementById("partBtn").addEventListener("click", dibuja, false);
document.getElementById("votoBtn").addEventListener("click", dibuja, false);
document.getElementById("camaBtn").addEventListener("click", dibuja, false);
	
	
	
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
			m_txt = datos.votacion.mesas.porcentaje.toLocaleString() + "%";
			v_txt = datos.votacion.votos.porcentaje.toLocaleString() + "%";
			document.getElementById("referenciaBarrasDetalle").className = "descMuestro";		

			if (datos.nivel_administrativo == 2){
				queDatoMuestro = "<p> Barras localidad</p>";
				document.getElementById("referenciaTotal").innerHTML = datos.nombre;
			}else{

				queDatoMuestro = "<p> Barras de provincia.</p>";
				document.getElementById("referenciaTituloProvincia").innerHTML = datos.nombre;
				document.getElementById("referenciaTotal").innerHTML = "";
			};	
		} else { 
			// si no hay datos se avisa que no hay datos
			document.getElementById("referenciaTituloProvincia").innerHTML = argentina.datum.properties.administrative_area[0].name;
			document.getElementById("referenciaTotal").innerHTML = "";
			queDatoMuestro = "<p> Sin datos para visualizar</p>";
		}

		
	}else{ // Se esta viendo el mapa completo

		queDatoMuestro = "<p> Barras de país </p>";
		
		document.getElementById("referenciaTituloProvincia").innerHTML = "RESULTADO GENERAL 2013";
		document.getElementById("referenciaTotal").innerHTML = "Es la suma de los votos obtenidos en todas las provincias, agupados según la orientación política del voto.";
		document.getElementById("referenciaBarrasDetalle").className = "descOculto";		
		
		datos = datos.TOTALES;
			m_txt = datos.votacion.mesas.porcentaje.toLocaleString() + "%";
			v_txt = datos.votacion.votos.porcentaje.toLocaleString() + "%";
	}

	document.getElementById("graficoBarras").innerHTML = queDatoMuestro;


	
	document.getElementById("mesas").innerHTML = m_txt;
	document.getElementById("votos").innerHTML = v_txt;
}
