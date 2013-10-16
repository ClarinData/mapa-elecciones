/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 4, maxparams: 3, maxdepth: 2, maxstatements: 15 */
/* global mapObject, d3, window, getQueryParams, tweeter_share, facebook_share, shareURL, dibuja */
/* exported argentina */

var param = window.location.href.split('?', 1) || "rnd=" + Math.random(),
  query = getQueryParams(),
  url = {
    "base": "http://www.clarin.com/elecciones-mapa/",
    "parameters": {}
  },
  argentina = new mapObject({
    "id": "map_arg",
    "selection": null,
    "zoom": null,
    "datum" : null
  }),
  dataFiles = {},
  elecciones = {
    "dataset": "diputados",
    "diputados": {},
    "senadores": {},
    "event": d3.dispatch("updatedata", "loaded", "ready", "viewchange"),
    "file": "data/datafiles.json",
    "refresh": 1,
    "load": function() {
      "use strict";
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

  function dataRadius(dataE) {
    var v = (dataE) ? dataE.votacion.partidos_politicos[0].votos / (700 * (argentina.zoom || 1)) : 0;
    return Math.sqrt(v / Math.PI);
  }

  function refreshView() {

    elecciones.event.updatedata({
      "diputados": elecciones.diputados[argentina.selection],
      "senadores": elecciones.senadores[argentina.selection]
    });

    elecciones.event.viewchange();

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

     argentina.svg.g.admlevel2.caba = argentina.svg.g.admlevel2.caba || (function (d,zoom) {

        var b = argentina.svg.path.bounds(d),
            translate = [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2];

        argentina.svg.g.admlevel2.append("use")
                                 .attr("xlink:href", "#" + argentina.id + "_CAP")
                                 .attr("transform", function () {
                                   return "translate(" + [(argentina.width / 3) * 2.17, (argentina.height / 3) * 1.02]+ ") scale("+ zoom + ") translate(" + translate + ")";
                                 })
                                 .style("stroke-width", function() {
                                   return 0.5 / zoom + "pt";
                                 });

        argentina.svg.g.paths.filter(function (e) {
                               return (e.properties.administrative_area[0].id === "CAP") &&
                                      (e.properties.administrative_area.length > 1);
                             })
                             .each(function (e) {
                                argentina.svg.g.admlevel3.append("use")
                                                         .attr("xlink:href", function () {
                                                            return "#" + argentina.id + "_" + e.properties.administrative_area.id;
                                                         })
                                                         .attr("transform", function () {
                                                           return "translate(" + [(argentina.width / 3) * 2.17, (argentina.height / 3) * 1.02]+ ") scale("+ zoom + ") translate(" + translate + ")";
                                                         })
                                                         .style("stroke-width", function() {
                                                           return 0.5 / zoom + "pt";
                                                         });
                             });

     })(

       d3.select("#map_arg_CAP").datum(),
       7

     );

      var selector = (query.id) ? argentina.svg.g.select("#" + argentina.id + "_" + query.id.toUpperCase()) : null,
        datum = (selector) ? selector.datum() : null;

      if (query.view) {
        argentina.vista[query.view]();
      }
      if (datum) {
        argentina.event.click(datum);
      }

      query = {};
      tweeter_share(shareURL(url),datum);
      facebook_share(shareURL(url),datum);

      d3.timer(function() {
        elecciones.load();
        refreshView();
        return true;
      }, elecciones.refresh * 60000);

    } else {

      argentina.load("argentina.json");

    }

  });

  elecciones.event.on("viewchange", function() {
    argentina.svg.g.paths
      .classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false)
      .attr("class", function(d) {
        var current_attr = (this.getAttributeNode("class")) ? this.getAttributeNode("class").value : "";
        var dataE = elecciones[elecciones.dataset][d.properties.administrative_area.id];
        if (dataE && (dataE.votacion.partidos_politicos[0].votos > 0)) {
          return "fp_" + dataE.votacion.partidos_politicos[0].fuerza_politica + " " + current_attr;
        } else {
          return current_attr;
        }
      });

    argentina.svg.g.circles
      .classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false)
      .attr("class", function(d) {
        var current_attr = (this.getAttributeNode("class")) ? this.getAttributeNode("class").value : "";
        var dataE = elecciones[elecciones.dataset][d.properties.administrative_area.id];
        if (dataE && (dataE.votacion.partidos_politicos[0].votos > 0)) {
          return "fp_" + dataE.votacion.partidos_politicos[0].fuerza_politica + " " + current_attr;
        } else {
          return current_attr;
        }
      })
      .attr("r", function(r) {
        return dataRadius(elecciones[elecciones.dataset][r.properties.administrative_area.id]);
      });

    d3.select("#preloader").style("display", "none");

    if (elecciones.dataset != "diputados") {
      url.parameters.data = elecciones.dataset || "";
    } else {
      delete  url.parameters.data;
    }

  });

  argentina.event.on("click", function(d) {
    argentina.datum = d;

    (function(d) {

      if ((!d) || (d.properties.administrative_area.length < 2)) {

        var centered = d || null;

        argentina.backbutton.visible(d);

        var b = argentina.svg.path.bounds(d);

        argentina.zoom = 0.95 / Math.max((b[1][0] - b[0][0]) / argentina.width, (b[1][1] - b[0][1]) / argentina.height);

        var translate = (argentina.zoom) ? [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2] : [-argentina.width / 2, -argentina.height / 2];

        argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom) && argentina.vista.state === "votos");

        (function(g) {

          g.transition().duration(650)
           .attr("transform", "translate(" + argentina.width / 2 + "," + argentina.height / 2 + ")" +
             "scale(" + (argentina.zoom || 1) + ")" +
             "translate(" + translate + ")"
           );

          g.paths
           .style("stroke-width", function() {
             return (argentina.zoom) ? 0.5 / argentina.zoom + "pt" : null;
            })
            .classed("active", centered && function(d) {
             return (d === centered);
            });

          g.circles
           .style("stroke-width", function() {
             return (argentina.zoom) ? 0.5 / argentina.zoom + "pt" : null;
            })
           .attr("r", function(r) {
             return dataRadius(elecciones[elecciones.dataset][r.properties.administrative_area.id]);
           });

        })(

          argentina.svg.g

        );

      }

    })(
      ((!d) || (d.properties.administrative_area.id.length < 4)) ? d : argentina.svg.g.select("#" + argentina.id + "_" + d.properties.administrative_area.id.substr(0, 3)).datum()
    );

    argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom && (argentina.vista.selected == "voto")));

    url.parameters.id = (d) ? d.properties.administrative_area.id : "";
    tweeter_share(shareURL(url),d);
    facebook_share(shareURL(url),d);

    argentina.selection = (d) ? d.properties.administrative_area.id : null;

    elecciones.event.updatedata({
      "view" : argentina.vista.state,
      "id" : argentina.selection,
      "dataset" : elecciones.dataset,
      "data" : elecciones[elecciones.dataset][argentina.selection]
    });
    dibuja();
 

  });

  argentina.vista = {

    voto: function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom));
      argentina.svg.g.votes.classed("disabled", false);
      argentina.vista.state = "voto";
      url.parameters.view = argentina.vista.state;
      tweeter_share(shareURL(url),argentina.datum);
      facebook_share(shareURL(url),argentina.datum);

    },

    part: function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "part";
      url.parameters.view = argentina.vista.state;
      tweeter_share(shareURL(url),argentina.datum);
      facebook_share(shareURL(url),argentina.datum);

    },

    prov: function() {

      argentina.svg.g.admlevel2.classed("transparent", false);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "prov";
      url.parameters.view = argentina.vista.state;
      tweeter_share(shareURL(url),argentina.datum);
      facebook_share(shareURL(url),argentina.datum);

    },

    state: "prov"

  };

  elecciones.load();

})();