var totalSen,totalDip;


d3.json("data/senadores_camara.json?ran=" + Math.random(), function (datos){
	totalSen = datos;
});

d3.json("data/diputados_camara.json?ran=" + Math.random(), function (datos){
	totalDip = datos;
	armoCamara (dipParametros, totalDip, camaraDip);	
});

var wCam = 819, hCam = 463, pi = Math.PI, camaraDS="nueva";
var camaraSeleccionada;
var datosNuevos,parametros ; 
var toolTip = d3.select(".tooltipCam")
				.style("opacity", 0);

var camaraDip = {"fp_K" :{"nombre":"Kirchneristas y aliados", 	"tenian": 132, "renovaron": 47, "fp":"K"},
			    "fp_FP" :{"nombre":"UCR, Socialistas y aliados",	"tenian": 65, "renovaron": 40, 	"fp":"FP"},	
			    "fp_PJ" :{"nombre":"Peronistas opositores",		"tenian": 34, "renovaron": 25, 	"fp":"PJ"}, 
			    "fp_PRO":{"nombre":"PRO y aliados",				"tenian": 14, "renovaron": 9, 	"fp":"PRO"},
			    "fp_IZ" :{"nombre":"Partidos de izquierda",		"tenian": 0, "renovaron": 0, 	"fp":"IZ"},
			    "fp_OT" :{"nombre":"Otros partidos",				"tenian": 12, "renovaron": 6, 	"fp":"OT"}
			    };

var camaraSen = {"fp_K"  :{"nombre":"Kirchneristas y aliados", 	"tenian": 41, "renovaron": 16, 	"fp":"K"},
			 	 "fp_FP" :{"nombre":"UCR, Socialistas y aliados",	"tenian": 21, "renovaron": 5, 	"fp":"FP"},	
			 	 "fp_PJ" :{"nombre":"Peronistas opositores",		"tenian": 8, "renovaron": 2, 	"fp":"PJ"},
			  	 "fp_PRO":{"nombre":"PRO y aliados",				"tenian": 0, "renovaron": 0, 	"fp":"PRO"},
			  	 "fp_IZ" :{"nombre":"Partidos de izquierda",		"tenian": 0, "renovaron": 0, 	"fp":"IZ"},
			  	 "fp_OT" :{"nombre":"Otros partidos",				"tenian": 2, "renovaron": 1, 	"fp":"OT"}
			  };

var senParametros = [	18,				///camParametros[0]		hileras - numero de filas del hemiciclo
						 4,				///camParametros[1]		circulos - numero de circulos por fila
						37,				///camParametros[2]		quorum - Quorum de la camara
						10.588235294,	///camParametros[3]		rotacion - rotacion de las filas
						425,			///camParametros[4]		ubicacionX - ubicacion horizontal de la camara 
						430,			///camParametros[5]		ubicacionY - ubicacion vertical de la camara
						4,				///camParametros[6]		radioInterior_cam - radio interior del hemiciclo 
						-36,			///camParametros[7]		radioExterior_cam - radio exterior del hemiciclo
						6,				///camParametros[8]		tamañoCirculo_chico - tamaño del circulo mas chico de las filas
						1/3,			///camParametros[9]		raizCirculo - 
						3,				///camParametros[10]	tamañoCirculo_grande - tamaño del circulo mas grande de las filas
						4,				///camParametros[11]	tamañoCirculo_grande_quorum - 
						17,				///camParametros[12]	overlapMouseover - separacion entre el circulo de la camara y el del quorum
						-24,			///camParametros[13]	yMouseover - coeficiente de superposicion de los rectangulos del mouseover
						40,				///camParametros[14]	wMouseover - ubicacion "Y" del rectangulo del mouseover
						49,				///camParametros[15]	hMouseover - ancho del rectangulo del mouseover
						15,				///camParametros[16]	ubicacionX_arcos - ubicacion horizontal del arco
						25,				///camParametros[17]	ubicacionY_arcos - ubicacion vertical del arco	
						1,				///camParametros[18]	ajusteArcos - ajuste del dibujo de los arcos si viene valor 1
						286,			///camParametros[19]	r - radio de el arco
						280   			///camParametros[20]	ir - espesor del arco
						 ];

var dipParametros = [	33,				///camParametros[0]		hileras
						 8,				///camParametros[1]		circulos
						129,			///camParametros[2]		quorum
						5.807,			///camParametros[3]		rotacion
						423,			///camParametros[4]		ubicacionX
						430,			///camParametros[5]		ubicacionY
						5.3,			///camParametros[6]		radioInterior_cam
						-25,			///camParametros[7]		radioExterior_cam
						6,				///camParametros[8]		tamañoCirculo_chico
						1/3,			///camParametros[9]		raizCirculo
						2.5,			///camParametros[10]	tamañoCirculo_grande
						3.5,			///camParametros[11]	tamañoCirculo_grande_quorum
						15,				///camParametros[12]	overlapMouseover
						-20,				///camParametros[13]	yMouseover
						30,				///camParametros[14]	wMouseover
						33,				///camParametros[15]	hMouseover
						14,				///camParametros[16]	ubicacionX_arcos
						25,				///camParametros[17]	ubicacionY_arcos
						2.5,			///camParametros[18]	ajusteArcos
						342,			///camParametros[19]	r
						337   			///camParametros[20]	ir
						 ];

var svg = d3.select("body")
			.select("#camara")
			.append("svg")
			.attr("width", wCam)
			.attr("height", hCam);

var datosCamara;		  
	 
function armoDatos (totalCam, camara){
	 datosCamara = {
		nueva : function () {
					document.getElementById("textoBancas").innerHTML = "BANCAS OBTENIDAS EN ESTA ELECCION";
					//document.getElementById("bNuevas").innerHTML = "Bancas 2013: ";
					
					d3.select("#bNuevas_txt").text("Bancas 2013: ");
					
					var total = new Array(),
						total_arcos = new Array();
				
					for(var i in totalCam.fuerzas) {
						total_arcos.push({"fp": totalCam.fuerzas[i].fp, "totales": totalCam.fuerzas[i].obtuvieron + totalCam.fuerzas[i].viejos});
						for(var n = 0; n < (totalCam.fuerzas[i].obtuvieron + totalCam.fuerzas[i].viejos); n++) {
							total.push({"fp": totalCam.fuerzas[i].fp, "renueva": (totalCam.fuerzas[i].obtuvieron <= n), "obtuvieron": totalCam.fuerzas[i].obtuvieron});
						}
					}
					return [total,total_arcos];
		},
				
		vieja: function () {
					document.getElementById("textoBancas").innerHTML = "BANCAS QUE RENUEVAN";
					d3.select("#bNuevas_txt").text("Bancas que renuevan: ");//document.getElementById("bNuevas").innerHTML = "Bancas que renuevan: ";
					var total = new Array(),
						total_arcos = new Array();
				
					for(var i in camara) {
						total_arcos.push({"fp": camara[i].fp, "totales": camara[i].tenian, "renovaron": camara[i].renovaron, "obtuvieron": null});
						for(var n = 0; n < camara[i].tenian; n++) {
							total.push({"fp": camara[i].fp, "obtuvieron": camara[i].renovaron, "renueva": (camara[i].renovaron <= n)});
						}
					}
				return [total,total_arcos];
		}
				
	};
			
}

function llenaTotales(totalCam){		

	d3.select("#totalSen").text (datosCamara["nueva"]()[0].length);
	d3.select("#fondoTotalCam_leg #votosSen").text (totalCam.porcentajeVotos + "%");
	d3.select("#fondoTotalCam_leg #mesasSen").text (totalCam.porcentajeMesas + "%");
}
		
function llenaTablas (totalCam,camara){
	
	var seleccionTablas = d3.selectAll(".tabla").data(totalCam.fuerzas);
	
	seleccionTablas.select("caption").text(function(d) {
		return camara["fp_" + d.fp].nombre;
	});
	
	seleccionTablas.select(".bancasTenian_nro").text(function(d) {
		return camara["fp_" + d.fp].tenian;
	});
	
	seleccionTablas.select(".bancasRenovaron_nro").text(function(d) {
		return camara["fp_" + d.fp].renovaron;
	});
	
	seleccionTablas.select(".bancasObtuvieron_nro").text(function(d) {
		return d.obtuvieron;
	});
	
	seleccionTablas.select(".bancasDiferencia_nro").text(function(d) {
		var dif = (d.obtuvieron - camara["fp_" + d.fp].renovaron);
		return (dif > 0) ? ("+" + dif) : dif;
	});
	
	seleccionTablas.each(function(d) {
		var thisClass = "fp_" + d.fp;
		d3.select(this).selectAll("tr:first-child td, tr:last-child td").classed("fp_K fp_PJ fp_FP fp_IZ fp_PRO fp_OT", false)// expandir lista
		.classed(thisClass, true);
	});

}

function armaCamaraVacia(camParametros){
	
	d3.selectAll("g").remove();
	var filas = svg.selectAll(".filas")
		.data( function () {return new Array(camParametros[0]);} )
		.enter()
		.append("g")
		.attr("transform",
			function (d,i) {
				return "translate(" + camParametros[4] + "," + camParametros[5] + ")  rotate(" + i * camParametros[3] + ")";
			}
		);

		filas.selectAll("rect")
				.data( new Array(camParametros[1]))
				.enter().append("rect")
				.attr("y", camParametros[13])
				.attr("x", function (d,i) {return ((i+ camParametros[6]) * camParametros[7])-camParametros[12];})
				.attr("width", camParametros[14])
				.attr("height",camParametros[15]);

	   filas.selectAll("circle")
			.data( new Array(camParametros[1]))
			.enter().append("circle")
			.attr("cy", 0)
			.attr("cx", function (d,i) {return (i+ camParametros[6]) * camParametros[7];})
			.attr("r", function (d,i) {return (Math.pow((i + camParametros[8]),camParametros[9])*camParametros[10]);}) ///aumento paulatino
			.attr("pointer-events", "none");

		var bind = svg.selectAll("circle")
					    .data(datosCamara["vieja"]()[0])
						.exit()
						.remove();
		
		var bindRect = svg.selectAll("rect")
					    .data(datosCamara["vieja"]()[0])
					    .attr("opacity",0)
						.on("mouseover", mouseover)
						.on("mouseout", mouseout)
						.exit()
						.remove();
}

function miSeleccion(camaraDS) {		
	
	if (camaraDS === "nueva"){
		document.getElementById("camaraActual").disabled = false;
		document.getElementById("camaraNueva").disabled = true;
	}else{
		document.getElementById("camaraActual").disabled = true;
		document.getElementById("camaraNueva").disabled = false;
	}
		
	var datosCamara = datosNuevos;
	var camParametros = parametros;
	
	svg.selectAll(".bancas")
	   .style("fill-opacity", 1);
	  
	d3.select("#bNuevas")
	  .style("display","none");
	
	d3.select("#bNuevas_nro")
	  .style("display","none");
	
	d3.select("#bancasNuevas")
	  .property("checked",false);

	document.getElementById("quorum").className = "desactivo";			
	document.getElementById("bancasNuevas").className = "desactivo";				
	d3.selectAll(".quorum")
		.attr("stroke-opacity", 0)
		.attr("r", 25);
		
		var bancas = svg.selectAll("circle")
						.data(datosCamara[camaraDS]()[0])
						.attr("class", 
							function(d) {
								return (d.fp) ? "fp_" + d.fp + " bancas": null;
							});

		svg.selectAll("rect")
			.data(datosCamara[camaraDS]()[0])
			.attr("class",
				function(d) {
					return (d.fp) ? "fp_" + d.fp : null;
				}
			);

		d3.select("svg").selectAll("g.borrar").remove();
		var vis = d3.select("svg")
					.data([datosCamara[camaraDS]()[1]])
					.append("g")
					.attr("class","borrar")
					.attr("transform", "translate(" + ((wCam/2)+camParametros[16]) + "," + (hCam-camParametros[17]) + ")");

		var arc = d3.svg.arc()
					.outerRadius(camParametros[19])
					.innerRadius(camParametros[20]);
			
		var arcTxt = d3.svg.arc()
					.outerRadius(camParametros[19]+8)
					.innerRadius(camParametros[20]+8);

		var pie = d3.layout.pie()
					.sort(null)
					.value(
						function(d) { 
	    					//si una banca da 1, le asigno 2 para que dibuje algo
	    					var total = new Array();
	    					d.totales === 1 ? total.push(camParametros[18]) : total.push(d.totales);
	    					return total; 
	    				}
	    			)
					.startAngle(-90 * (pi/180))
					.endAngle(90 * (pi/180));

		var arcs = vis.selectAll("g.porciones")
						.data(pie)
						.enter()
						.append("g")
						.attr("class", "porciones");
						
		arcs.append("path")
			.attr("class", function(d,i) { return "fp_" + d.data.fp; })
			.attr("d", arc);
		
		arcs.append("path")
			.attr("id" , function(d,i) { return "path" + i; })
			.attr("opacity", 0)
			.attr("d", arcTxt);
			
		arcs.append("text")
			.attr("text-anchor", "end")
			.attr("id", function(d,i) { return "fp_" + d.data.fp; }) //agrego id a los textos para obtener su posicion
			.append("textPath")
			.attr("xlink:href",function(d,i){return "#path"+i;})
			.attr("startOffset", "25%")
			.append("tspan")
			.text(function(d) {return d.data.totales;});
									
}	

function mouseover(d) {
	svg.selectAll( "circle." + this.getAttribute('class'))
		.style("stroke", "grey")
		.transition()
		.style("stroke-opacity", 1)
		.style("stroke-width", 1);
						
		var myDiv = document.getElementById(this.getAttribute('class'));
		var rect = myDiv.getBoundingClientRect();
		var yNum,xNum,hTool,wTool;
		var scrollTop =  document.documentElement.scrollTop ? document.documentElement.scrollTop:document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft? document.documentElement.scrollLeft:document.body.scrollLeft;
		
		var myTooldiv = document.getElementById("tooltipCam");
		var recTool = myTooldiv.getBoundingClientRect();
		
		hTool = recTool.height;
		wTool = recTool.width;
		yNum = rect.top+scrollTop;
		xNum = rect.left+scrollLeft;
		
		toolTip.transition()
			.style("opacity", 1)
			.select("#bloque")
			.style("color", getComputedStyle(this).backgroundColor);

		d3.select("#fp_")
			.text(camaraSeleccionada[this.getAttribute('class')].nombre);
						
		 toolTip.style("left", (xNum < wCam/1.5 && xNum > wCam/7) || (xNum > wCam-110) ? (xNum-130) - 110 + "px" : (xNum-130)  + "px")
				.style("top",((yNum-121)-hTool-50) + "px")
				.attr("class", (xNum < wCam/1.5 && xNum > wCam/7) || (xNum > wCam-110) ? "tooltipCam arrowLeft" : "tooltipCam arrowRight");
				
		d3.select("#bNuevas_nro")
			.text (function() { return d.obtuvieron; });
		
}

function mouseout () {
	svg.selectAll("circle." + this.getAttribute('class'))
		.transition()
		.style("stroke-opacity", 0);
	
	toolTip.transition()
		.duration(500)
		.style("opacity", 1e-6);
}		
	
function manejoQuorum(camParametros){
	
	var filasQ =
		 svg.selectAll(".filasq")
		 	.data(function() {
		 		return new Array(camParametros[0]);
		 	})
		 	.enter().append("g")
		 	.attr("class", "filasq")
		 	.attr("transform", function (d,i) {
								return "translate(" + camParametros[4] + "," + camParametros[5] + ")  rotate(" + i * camParametros[3] + ")";}
								
								);

		 filasQ.selectAll("circle")
		 	.data(new Array(camParametros[1]))
		 	.enter().append("circle")
		 	.attr("class", "quorum")
		 	.attr("cy", 0)
		 	.attr("cx", function (d,i) {return (i+ camParametros[6]) * camParametros[7];})
			.attr("r", 0)
		 	.attr("pointer-events", "none");

		 svg.selectAll(".quorum")
		 	.data(new Array(camParametros[2]))
		 	.exit()
		 	.remove();

	d3.select("#quorum").on("click", 
		function() {
			var checked = document.getElementById("quorum").className == "desactivo",
				circleOut = function () {
					document.getElementById("quorum").className = "desactivo";
					this.attr("stroke-opacity", 0)
						.attr("r", 25);
				},
				circleIn = function () {
				document.getElementById("quorum").className = "activo";
				this.attr("stroke-opacity", 1)
					.attr("r", function (d,i) {return (Math.pow((i + camParametros[8]),camParametros[9])*camParametros[11]);});
				},

			circleRun = (checked) ? [circleOut, circleIn] : [circleIn, circleOut];

	 	 	filasQ.selectAll(".quorum")
			.call(circleRun[0])
			.transition().duration(750)
			.call(circleRun[1]);
	 });
}

d3.select("#bancasNuevas").on("click", 
	function() { 
		var apagarBancas = 
			function() {
				document.getElementById("bancasNuevas").className = "activo";			
				svg.selectAll(".bancas").transition()
					  .style("fill-opacity", 
						function (d) { return (d.renueva) ? 0 : 1;
						});
						
					  d3.select("#bNuevas")
						.style("display","inline-block");
					  d3.select("#bNuevas_nro")
						.style("display","inline-block");
			},
		prenderBancas = 
			function () {
				document.getElementById("bancasNuevas").className = "desactivo";			
				svg.selectAll(".bancas").transition()
					  .style("fill-opacity", 1);
					  d3.select("#bNuevas")
						.style("display","none");
					  d3.select("#bNuevas_nro")
						.style("display","none");
			},
		
		bancasRun = (document.getElementById("bancasNuevas").className == "activo") ? prenderBancas : apagarBancas;
		
		svg.selectAll(".bancas")
			.call(bancasRun);
	}
);

function armoCamara (camParametros, totalCam, camara){
	document.getElementById("numeroQuorum").innerHTML = camParametros[2];
	parametros = camParametros;
	camaraSeleccionada = camara;
	armoDatos (totalCam, camara);
	datosNuevos = datosCamara;
	llenaTotales(totalCam);
	llenaTablas (totalCam,camara);
	armaCamaraVacia(camParametros);
	miSeleccion(camaraDS);
	manejoQuorum(camParametros);

	document.getElementById("quorum").className = "desactivo";			
	document.getElementById("bancasNuevas").className = "desactivo";


facebook_share("http://www.clarin.com/elecciones-2013-resultados/?view=cama");
tweeter_share("http://www.clarin.com/elecciones-2013-resultados/?view=cama");

function tweeter_share(myurl, d) {
  "use strict";
  d3.select("#shareTwitter")
    .attr("href", function() {
	 	var p = {
					hashtags: "Elecciones2013,MapaClarin",
					summary: "Mirá los resultados de las Cámaras",
					url: myurl
		        };

      return "https://twitter.com/intent/tweet?" +
        "hashtags=" + encodeURIComponent(p.hashtags) + "&" +
        "text=" + encodeURIComponent(p.summary) + "%0A&" +
        "&tw_p=tweetbutton&url=" + encodeURIComponent(p.url);
    });
}

function facebook_share(myurl) {
  "use strict";
  d3.select("#shareFacebook")
    .attr("href", function() {

	 	var p = {
					title: "Elecciones 2013",
					summary: "Mirá los resultados de las Cámaras",
					url: myurl
		        };

      return 'http://www.facebook.com/sharer.php?' +
        's=100' + "&" +
        'p[title]=' + encodeURIComponent(p.title) + "&" +
        'p[summary]=' + encodeURIComponent(p.summary) + "&" +
        'p[url]=' + encodeURIComponent(p.url);

    })
    .on("mouseover", function() {
      facebook_share.url = this.href || facebook_share.url;
      this.href = this.href || facebook_share.url;
    })
    .datum(function () {
      return this.href;
    })
    .on("click", function() {
      var url = this.href,
        width = 550,
        height = 520;
      this.href = 'javascript:void(0);';
      window.open(url,
        "Comparte en Facebook",
        "width=" + width + ", height=" + height + ", left=" + (window.innerWidth - width) / 2 + ", top=" + (window.innerHeight - height) / 2 + ", toolbar=0, location=0, menubar=0");
      this.href = oldurl;
    })
    .on("mouseout",function (d) {
      this.href = d;
    });;
}			

}