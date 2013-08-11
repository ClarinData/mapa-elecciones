/* jshint undef: true, unused: true, strict: true, devel: true,  maxcomplexity: 5, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global mapObject, d3 */
/* exported argentina */

var argentina = new mapObject({
  id: "map_arg"
});

var dataFiles = {},
    elecciones = {
      "diputados": {},
      "senadores": {},
      "event": d3.dispatch("click", "loaded", "ready", "viewchange")
    };

(function() {

  "use strict";

  argentina.event.on("error", function(error, json) {
    console.log(error, json);
  });

  d3.select("#preloader").style("display", "block");

  function paintData (select) {
    argentina.svg.g.selectAll(select)
      .each(function(d, i) {
        var dataE = elecciones[vista][d.properties.administrative_area.id],
            thisElement = d3.select(this);

        if (dataE) {

          switch(select){
              case "path":
                  thisElement.classed("fp_" + dataE.votacion.partidos_politicos[0].fuerza_politica, true);
              case "circle":
                  thisElement.classed("fp_" + dataE.votacion.partidos_politicos[0].fuerza_politica, true);
                  thisElement.attr("r", function() {
                    var v = dataE.votacion.partidos_politicos[0].votos/1000;
                    return Math.sqrt(v / Math.PI);
                  });
              default:
          }

        } else {

          thisElement.classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false);    
          switch(select){           
              case "circle":
                  thisElement.attr("r", 0);
              default:
          }

        }
      });
  }

  argentina.event.on("ready", function() {

    var paths = argentina.svg.g.selectAll("path");

    paintData("path");
    paintData("circle");

    d3.select("#preloader").style("display", "none");

  });

  argentina.dataLoad("data/datafiles.json", function(error, json) {

    dataFiles = (error) ? {} : json;
    dataFiles.count = (error) ? 0 : json.diputados.length + json.senadores.length;

    elecciones.event.loaded();

  });

  elecciones.event.on("loaded", (function() {

    function createDataObj(files, dataObj) {

      argentina.dataLoad(files.pop(), function(error, json) {

          if (!error && dataObj) {

            dataObj[json.id] = {
              "id": json.id,
              "nivel_administrativo": 1,
              "nombre": json.nombre,
              "votacion": json.votacion
            };

            for (var key in json.localidades) {
              dataObj[key] = json.localidades[key];
              dataObj[key].nivel_administrativo = 2;
            }

          }

        }

      );

      if (dataFiles.diputados.length + dataFiles.senadores.length < 1) {

        elecciones.event.ready();

      }

    }

    function loadData(dataFiles, dataObj) {

      if (dataFiles && dataFiles.length > 0) {

        for (var i = Math.min(2, dataFiles.length - 1); i >= 0; i--) {

          createDataObj(dataFiles, dataObj);

        }

        elecciones.event.loaded();

      }

    }

    loadData(dataFiles.diputados, elecciones.diputados);

    loadData(dataFiles.senadores, elecciones.senadores);

  }));

  elecciones.event.on("ready", function() {
      setTimeout(function(){
        argentina.load("argentina.json");
      },100);
  });

  elecciones.event.on("viewchange", function() {
    paintData("path");
    paintData("circle");
  });

  // console.log("elecciones: ", elecciones);
  
  argentina.event.on("click", function(d) {

    if (d) {
      elecciones.event.click({
        "diputados": elecciones.diputados[d.properties.administrative_area.id],
        "senadores": elecciones.senadores[d.properties.administrative_area.id],
        "d": (elecciones.diputados[d.properties.administrative_area.id] || elecciones.senadores[d.properties.administrative_area.id]) ? d : undefined
      });
    } else {
      elecciones.event.click({
        "diputados": elecciones.diputados["TOTALES"],
        "senadores": elecciones.senadores["TOTALES"]
      });
    }

    if ((!d) || (d.properties.administrative_area.length < 2)) {

      var centered = d || null;

      argentina.backbutton.visible(d);

      var b = argentina.svg.path.bounds(d);

      var zoom = 0.95 / Math.max((b[1][0] - b[0][0]) / argentina.width, (b[1][1] - b[0][1]) / argentina.height);

      var translate = (zoom) ? [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2] : [-argentina.width / 2, -argentina.height / 2];

      argentina.svg.g.transition()
        .duration(750)
        .attr("transform", "translate(" + argentina.width / 2 + "," + argentina.height / 2 + ")" +
          "scale(" + (zoom || 1) + ")" +
          "translate(" + translate + ")"
      );

      argentina.svg.g.selectAll("path")
        .style("stroke-width", function() {

          return (zoom) ? 0.5 / zoom + "pt" : null;

        })
        .classed("active", centered && function(d) {

          return (d === centered);

        });

    }

  });

  argentina.vista = {

    votos: (function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent", true);
      argentina.svg.g.votes.classed("disabled", false);

    }),

    partidos: (function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent", false);
      argentina.svg.g.votes.classed("disabled", true);


    }),

    provincias: (function() {

      argentina.svg.g.admlevel2.classed("transparent", false);
      argentina.svg.g.admlevel3.classed("transparent", false);
      argentina.svg.g.votes.classed("disabled", true);

    })

  };

})();