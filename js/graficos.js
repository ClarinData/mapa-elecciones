// Agrego listeners a todos los botones.

document.getElementById("diputadosBtn").addEventListener("click", dibuja, false);
document.getElementById("senadoresBtn").addEventListener("click", dibuja, false);
document.getElementById("provBtn").addEventListener("click", dibuja, false);
document.getElementById("partBtn").addEventListener("click", dibuja, false);
document.getElementById("votoBtn").addEventListener("click", dibuja, false);
document.getElementById("camaBtn").addEventListener("click", dibuja, false);


function dibuja(){


	switch (this.id){

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
	}

	document.getElementById("graficoBarras").innerHTML  = "Se hizo click en " + this.id;

}


