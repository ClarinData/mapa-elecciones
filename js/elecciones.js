/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 4, maxparams: 3, maxdepth: 2, maxstatements: 15 */
/* global mapObject, d3, window, getQueryParams */
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

      if (!argentina.svg.g.admlevel2.caba) {

        (function (b,zoom) {



          argentina.svg.g.admlevel2.caba = argentina.svg.g.admlevel2.append("use")
                                                    .attr("id", "map_arg_CAP_use")
                                                    .attr("xlink:href", "#map_arg_CAP")
                                                    .attr("transform", function () {
                                                      var b = argentina.svg.path.bounds(d3.select("#map_arg_CAP").data()[0]),
                                                          translate = [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2];
                                                      return "translate(" + [(argentina.width / 3) * 2.17, (argentina.height / 3) * 1.02]+ ") scale("+ zoom + ") translate(" + translate + ")";
                                                    })
                                                    .style("stroke-width", function() {
                                                      return 0.5 / zoom + "pt";
                                                    });

          argentina.svg.g.admlevel2.caba.box = argentina.svg.g.append("rect")
                                                              .attr("id", "rect_caba")
                                                              .attr("x", b[0][0] - 1)
                                                              .attr("y", b[0][1] - 1)
                                                              .attr("width", (b[1][0] - b[0][0]) + 2)
                                                              .attr("height", (b[1][1] - b[0][1]) + 2)
                                                              .style("fill", "none")
                                                              .style("stroke", "black")
                                                              .style("stroke-width", function() {
                                                                return 0.6 / zoom + "pt";
                                                              })
                                                              .attr("transform", function () {
                                                                var b = argentina.svg.path.bounds(d3.select("#map_arg_CAP").data()[0]),
                                                                    translate = [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2];
                                                                return "translate(" + [(argentina.width / 3) * 2.17, (argentina.height / 3) * 1.02]+ ") scale("+ zoom + ") translate(" + translate + ")";
                                                              });

        })(

          argentina.svg.path.bounds(d3.select("#map_arg_CAP").data()[0]),
          5

        );

      }

      var selector = (query.id) ? argentina.svg.g.select("#" + argentina.id + "_" + query.id.toUpperCase()) : null,
        datum = (selector) ? selector.datum() : null;

      if (query.view) {
        argentina.vista[query.view]();
      }
      if (datum) {
        argentina.event.click(datum);
      }

      query = {};
      tweeter(shareURL());

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

          g.attr("transform", "translate(" + argentina.width / 2 + "," + argentina.height / 2 + ")" +
            "scale(" + (argentina.zoom || 1) + ")" +
            "translate(" + translate + ")"
          );

          g.paths.style("stroke-width", function() {
            return (argentina.zoom) ? 0.5 / argentina.zoom + "pt" : null;
          })
            .classed("active", centered && function(d) {
              return (d === centered);
            });

          g.circles.style("stroke-width", function() {
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
    tweeter(shareURL());

    argentina.selection = (d) ? d.properties.administrative_area.id : null;

    elecciones.event.updatedata({
      "view" : argentina.vista.state,
      "id" : argentina.selection,
      "dataset" : elecciones.dataset,
      "data" : elecciones[elecciones.dataset][argentina.selection]
    });

  });

  argentina.vista = {

    voto: function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom));
      argentina.svg.g.votes.classed("disabled", false);
      argentina.vista.state = "voto";
      url.parameters.view = argentina.vista.selected;
      tweeter(shareURL());

    },

    part: function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "part";
      url.parameters.view = argentina.vista.selected;
      tweeter(shareURL());

    },

    prov: function() {

      argentina.svg.g.admlevel2.classed("transparent", false);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "prov";
      url.parameters.view = argentina.vista.selected;
      tweeter(shareURL());

    },

    state: "prov"

  };

  elecciones.load();

})();

function getQueryParams(qs) {

  this.decode = function(s) {
    s = s.replace(/\+/g, ' ');
    s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/g,
      function(code, hex1, hex2, hex3) {
        var n1 = parseInt(hex1, 16) - 0xE0;
        var n2 = parseInt(hex2, 16) - 0x80;
        if (n1 == 0 && n2 < 32) return code;
        var n3 = parseInt(hex3, 16) - 0x80;
        var n = (n1 << 12) + (n2 << 6) + n3;
        if (n > 0xFFFF) return code;
        return String.fromCharCode(n);
      });
    s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/g,
      function(code, hex1, hex2) {
        var n1 = parseInt(hex1, 16) - 0xC0;
        if (n1 < 2) return code;
        var n2 = parseInt(hex2, 16) - 0x80;
        return String.fromCharCode((n1 << 6) + n2);
      });
    s = s.replace(/%([0-7][0-9A-F])/g,
      function(code, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
    return s;
  };

  var parameters = {};

  // If no query string  was passed in use the one from the current page
  qs = qs || location.search;

  // Delete leading question mark, if there is one
  qs = (qs.charAt(0) === '?') ? qs.substring(1) : qs;

  // Parse it
  var re = /([^=&]+)(=([^&]*))?/g;
  while (match = re.exec(qs)) {
    var key = decodeURIComponent(match[1].replace(/\+/g, ' '));
    var value = match[3] ? this.decode(match[3]) : '';
    parameters[key] = value;
  }

  return parameters;
};

function shareURL() {
  var myUrl = url.base,
      params = Object.getOwnPropertyNames(url.parameters);
  if (params.length) {
    var param = [];
    params.forEach(function(val, i, array) {
        if (url.parameters[val]) {
          param.push(val + "=" + url.parameters[val]);
        }
      });
    myUrl += "?" + param.join("&");
  }
  return myUrl;
};

function tweeter(url) {
  d3.select("#shareTwitter")
    .attr("href", function () {
        var provincia,
            distrito,
            text = " (resulatdos a nivel nacional)";
        if (argentina.datum && argentina.datum.properties && argentina.datum.properties.administrative_area && argentina.datum.properties.administrative_area.id != "TDF999") {
          provincia = argentina.datum.properties.administrative_area[0].name;
          distrito = (argentina.datum.properties.administrative_area[1]) ? argentina.datum.properties.administrative_area[1].name : null;
          text = (argentina.datum.properties.administrative_area.id == "CAP") ? " en " + provincia :
                 (!distrito) ? " en la provincia de " + provincia : " en " + distrito + " (" + provincia + ")";
        }

        return "https://twitter.com/intent/tweet?" +
               "hashtags=" + "Elecciones2013" + "&" +
               "text=" + encodeURIComponent("Elecciones" + text) + "%0A&" +
               "&tw_p=tweetbutton&url=" + encodeURIComponent(url) + "&" +
               "via=clarincom";
    });
}