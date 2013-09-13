/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 4, maxparams: 3, maxdepth: 2, maxstatements: 15 */
/* global mapObject, d3, vista, window, getQueryParams */
/* exported argentina */

var argentina = new mapObject({
      "id": "map_arg",
      "selection": "TOTALES",
      "zoom": null
    }),
    dataFiles = {},
    elecciones = {
      "diputados": {},
      "senadores": {},
      "event": d3.dispatch("updatedata", "loaded", "ready", "viewchange"),
      "file": "data/datafiles.json",
      "refresh": 1,
      "load": function() {
        "use strict";
        var param = window.location.href.split('?', 1) | "rnd=" + Math.random();
        argentina.dataLoad(elecciones.file + "?" + param, function(error, json) {
          dataFiles = (error) ? {} : json;
          dataFiles.count = (error) ? 0 : json.diputados.length + json.senadores.length;
          elecciones.event.loaded();
        });
      }
    };

(function() {

  "use strict";

  d3.select("#preloader").style("display", "block");

  function paintData(select) {
    argentina.svg.g.selectAll(select)
      .each(function(d) {

        var dataE = elecciones[vista][d.properties.administrative_area.id],
            thisElement = d3.select(this);

        thisElement.classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false);

        if (dataE && (dataE.votacion.partidos_politicos[0].votos > 0)) {
          thisElement.classed("fp_" + dataE.votacion.partidos_politicos[0].fuerza_politica, true);
        }

        if (select === "circle") { 
          thisElement.attr("r", dataRadius(dataE));
        }

      });

    d3.select("#preloader").style("display", "none");
  }

  function dataRadius(dataE) {
    var v = (dataE) ? dataE.votacion.partidos_politicos[0].votos / (700 * (argentina.zoom || 1)) : 0;
    return Math.sqrt(v / Math.PI);
  }

  function refreshView() {

    elecciones.event.viewchange();

    elecciones.event.updatedata({
      "diputados": elecciones.diputados[argentina.selection],
      "senadores": elecciones.senadores[argentina.selection]
    });

  }

  function loadData(dataFiles, dataObj) {

    if (dataFiles && dataFiles.length > 0) {

      for (var i = Math.min(2, dataFiles.length - 1); i >= 0; i--) {

        createDataObj(dataFiles, dataObj);

      }

      elecciones.event.loaded();

    }

  }

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

    if ((dataFiles.diputados.length + dataFiles.senadores.length) < 1) {

      elecciones.event.ready({
        "diputados": elecciones.diputados[argentina.selection],
        "senadores": elecciones.senadores[argentina.selection]
      });

    }

  }

  argentina.event.on("ready", function() {

    refreshView();
    elecciones.event.ready();

  });

  elecciones.event.on("loaded", (function() {

    loadData(dataFiles.diputados, elecciones.diputados);
    loadData(dataFiles.senadores, elecciones.senadores);

  }));

  elecciones.event.on("ready", function() {

    if (argentina.svg) {

      var query = getQueryParams(),
          vista = query.view || null,
          selector = (query.id) ? argentina.svg.g.select("#" + argentina.id + "_" + query.id.toUpperCase()) : null,
          datum = (selector) ? selector.datum() : null;

      if (datum) { argentina.event.click(datum); }
      if (vista) { argentina.vista[vista](); }

      d3.timer(function () {
        elecciones.load();
        refreshView();
        return true;
      }, elecciones.refresh * 60000);

    } else {

      argentina.load("argentina.json");

    }

  });

  elecciones.event.on("viewchange", function() {
    paintData("path");
    paintData("circle");
  });

  argentina.event.on("click", function(d) {

      (function (d) {

        if ((!d) || (d.properties.administrative_area.length < 2)) {

        var centered = d || null;

        argentina.backbutton.visible(d);

        var b = argentina.svg.path.bounds(d);

        argentina.zoom = 0.95 / Math.max((b[1][0] - b[0][0]) / argentina.width, (b[1][1] - b[0][1]) / argentina.height);

        var translate = (argentina.zoom) ? [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2] : [-argentina.width / 2, -argentina.height / 2];

        argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom) && argentina.vista.state === "votos");

        (function(g) {

            g.transition()
              .duration(600)
              .attr("transform", "translate(" + argentina.width / 2 + "," + argentina.height / 2 + ")" +
                "scale(" + (argentina.zoom || 1) + ")" +
                "translate(" + translate + ")"
            );

            g.selectAll("path")
              .style("stroke-width", function() {

                return (argentina.zoom) ? 0.5 / argentina.zoom + "pt" : null;

              })
              .classed("active", centered && function(d) {

                return (d === centered);

              });

            g.selectAll("circle")
              .style("stroke-width", function() {

                return (argentina.zoom) ? 0.5 / argentina.zoom + "pt" : null;

              })
              .each(function(d) {

                  d3.select(this).attr("r", dataRadius(elecciones[vista][d.properties.administrative_area.id]));

              });

          })(

            argentina.svg.g

          );

        }
      })(


        ((!d) || (d.properties.administrative_area.id.length < 4)) ? d : argentina.svg.g.select("#" + argentina.id + "_" + d.properties.administrative_area.id.substr(0,3)).datum()
      
      );

      console.log("URL: ", "http://localhost/mapa-elecciones/" + ((d) ? "?id=" + d.properties.administrative_area.id + "&data=" + vista + "&selection=" + argentina.vista.state : ""));

      argentina.selection = (d) ? d.properties.administrative_area.id : "TOTALES";

      elecciones.event.updatedata({
        "diputados": elecciones.diputados[argentina.selection],
        "senadores": elecciones.senadores[argentina.selection],
        "d": (elecciones.diputados[argentina.selection] || elecciones.senadores[argentina.selection]) ? d : undefined
      });

  });

  argentina.vista = {

    votos: (function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom));
      argentina.svg.g.votes.classed("disabled", false);
      argentina.vista.state = "votos";

    }),

    partidos: (function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "partidos";


    }),

    provincias: (function() {

      argentina.svg.g.admlevel2.classed("transparent", false);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "provincias";

    }),

    state: "provincias"

  };

  elecciones.load();

})();