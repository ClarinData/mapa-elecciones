/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 4, maxparams: 3, maxdepth: 2, maxstatements: 15 */
/* global mapObject, d3, window, getQueryParams, tweeter_share, facebook_share, shareURL, dibuja, detectPlatform, updateBotones */
/* exported argentina */

var param = window.location.href.split('?', 1) || "rnd=" + Math.random(),
  query = getQueryParams(),
  url = {
    "base": "http://www.clarin.com/elecciones-2013-resultados/",
    //"imgbase": window.location.href.split("?")[0],
    "imgbase": "http://contenidos2.clarin.com/sincro/diario/mapa-e2013v2rc/?time=1376297302".split("?")[0],
    "parameters": {}
  },
  argentina = new mapObject({
    "id": "map_arg",
    "selection": null,
    "zoom": null,
    "datum": null
  }),
  dataFiles = {},
  elecciones = {
    "dataset": "diputados",
    "diputados": {},
    "senadores": {},
    "event": d3.dispatch("updatedata", "loaded", "ready", "viewchange"),
    "file": "data/datafiles.json?version=1",
    "refresh": 5,
    "load": function() {
      "use strict";
      argentina.dataLoad(elecciones.file + "?" + param, function(error, json) {
        if (!error) {
          dataFiles = (error) ? {} : json;
          dataFiles.count = (error) ? 0 : json.diputados.length + json.senadores.length + json.candidatos.length;
          elecciones.event.loaded();
        }
      });
    }
  };

if (query.view == "cama") {
  window.location.href = "camaras.html?version=1";
}

(function() {

  "use strict";

  d3.select("#preloader").style("display", "block");

  function dataRadius(dataE, zoom) {
    var v = (dataE) ? dataE.votacion.pp[0].votos / (700 * (argentina.zoom || zoom || 1)) : 0;
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

        if (!error && dataObj && json) {

          if (json.id) {
            dataObj[json.id] = {
              "id": json.id,
              "nivel_administrativo": 1,
              "nombre": json.nombre,
              "votacion": json.votacion
            };
          }

          if (json.localidades && json.id) {
            for (var key in json.localidades) {
              if (json.localidades.hasOwnProperty(key)) {
                dataObj[key] = json.localidades[key];
                dataObj[key].nivel_administrativo = 2;
                dataObj[key].parentId = json.id;
              }
            }
          }

          if (json.tree) {
            for (var key in json) {
              if (json.hasOwnProperty(key) && dataObj[json.tree][key]) {
                var location = dataObj[json.tree][key];
                location.votacion.candidatos = json[key].votacion.pp || null;
              }
            }
          }

        }

      }

    );

  }

  argentina.event.on("loadData", function() {

    dataFiles.count -= 1;
    if (dataFiles.count < 1) {
      elecciones.event.ready();
    }

  });

  argentina.event.on("ready", function() {
    if (argentina.svg) {
      dibuja();
      refreshView();
      elecciones.event.ready();
    }
  });

  elecciones.event.on("loaded", (function() {

    loadData(dataFiles.diputados, elecciones.diputados);
    loadData(dataFiles.senadores, elecciones.senadores);
    loadData(dataFiles.candidatos, elecciones);

  }));

  elecciones.event.on("ready", function() {

    if (argentina.svg) {

      if (argentina.svg.g.admlevel2 && argentina.svg.g.admlevel3) {

        argentina.svg.g.caba = argentina.svg.g.caba || (function(d, zoom) {

          var caba = argentina.svg.g.append("g")
            .attr("id", "caba");

          caba.votes = argentina.svg.g.votes.append("g")
            .attr("id", "caba_votes");
          caba.admlevel3 = argentina.svg.g.admlevel3.append("g")
            .attr("id", "caba_admlevel3");
          caba.admlevel2 = argentina.svg.g.admlevel2.append("g")
            .attr("id", "caba_admlevel2");

          var b = argentina.svg.path.bounds(d),
            translate = [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2];

          caba.box = caba.append("polygon")
            .attr("points", "29.55,0.0 28.979,8.789 0.0,20.295 28.878,20.543 28.692,42.324 71.378,42.324 71.378,0.0")
            .attr("id", "boxCAP")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", "0.3pt")
            .attr("transform", function() {
              return "translate(" + [(argentina.width / 3) * 1.95, (argentina.height / 3) * 1.06] + ")";
            });

          caba.votes = (function(votes) {
            votes.selectAll("circle")
              .attr("class", "copy")
              .data(argentina.svg.g.circles.filter(function(e) {
                return (e.properties.administrative_area[0].id === "CAP") &&
                  (e.properties.administrative_area.length > 1);
              }).data())
              .enter()
              .append("circle")
              .attr("id", function(d) {
                var id = argentina.id + "_votes_";
                for (var i = 0; i < d.properties.administrative_area.length; i++) {
                  id += d.properties.administrative_area[i].id;
                }
                return id + "_cpy";
              })
              .attr("r", 0)
              .attr("stroke-width", "0")
              .attr("cx", function(d) {
                return argentina.svg.path.centroid(d)[0];
              })
              .attr("cy", function(d) {
                return argentina.svg.path.centroid(d)[1];
              })
              .attr("transform", function() {
                return "translate(" + [(argentina.width / 3) * 2.245, (argentina.height / 3) * 1.165] + ") scale(" + zoom + ") translate(" + translate + ")";
              })
              .attr("stroke-width", function() {
                return 0.5 / zoom + "pt";
              });
            return votes;
          })(
            caba.votes
          );

          caba.admlevel3 = argentina.svg.g.paths.filter(function(e) {
            return (e.properties.administrative_area[0].id === "CAP") &&
              (e.properties.administrative_area.length > 1);
          }).each(function(e) {
            caba.admlevel3.append("use")
              .attr("xlink:href", function() {
                return "#" + argentina.id + "_" + e.properties.administrative_area.id;
              })
              .attr("class", "caba circle")
              .attr("transform", function() {
                return "translate(" + [(argentina.width / 3) * 2.245, (argentina.height / 3) * 1.165] + ") scale(" + zoom + ") translate(" + translate + ")";
              });
          });

          caba.admlevel2 = caba.admlevel2.append("path")
            .attr("id", argentina.id + "_CAP_cpy")
            .datum(d)
            .attr("class", "caba path admlevel1")
            .attr("transform", function() {
              return "translate(" + [(argentina.width / 3) * 2.245, (argentina.height / 3) * 1.165] + ") scale(" + zoom + ") translate(" + translate + ")";
            })
            .attr("stroke-width", function() {
              return 0.5 / zoom + "pt";
            });

          caba.admlevel2.pathAttr = argentina.pathsAttr(caba.admlevel2, "_cpy");

          caba.zoom = zoom;

          argentina.svg.g.paths = argentina.svg.g.selectAll("path");
          argentina.svg.g.circles = argentina.svg.g.selectAll("circle");

          return caba;

        })(

          d3.select("#map_arg_CAP").datum(),
          11

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
        tweeter_share(shareURL(url), datum);
        facebook_share(shareURL(url), datum);

        elecciones.event.viewchange();

      }

      d3.timer(function() {
        elecciones.load();
        refreshView();
        return true;
      }, elecciones.refresh * 60000);

    } else {

      var mapfile = (detectPlatform.Desktop()) ? "argentina.json?version=1" : "argentina.json?version=1";
      argentina.load(mapfile);

    }

  });

  elecciones.event.on("viewchange", function() {
    if (argentina.svg) {
      argentina.svg.g.paths
        .classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false)
        .attr("class", function(d) {
          var current_attr = this.getAttribute("class");
          var dataE = elecciones[elecciones.dataset][d.properties.administrative_area.id];
          return (dataE && (dataE.votacion.pp[0].votos > 0)) ? "fp_" + dataE.votacion.pp[0].fuerza + " " + current_attr : current_attr;
        });

      var circles = argentina.svg.g.circles
        .classed("fp_K fp_PJ fp_FP fp_PRO fp_IZ fp_OT fp_SFP", false)
        .attr("class", function(d) {
          var current_attr = this.getAttribute("class");
          current_attr = (current_attr) ? current_attr.value : "";
          var dataE = elecciones[elecciones.dataset][d.properties.administrative_area.id];
          return (dataE && (dataE.votacion.pp[0].votos > 0)) ? "fp_" + dataE.votacion.pp[0].fuerza + " " + current_attr : current_attr;
        });

      circles.filter(function() {
        var id = this.getAttribute("id");
        return id.substring(id.length - 3, id.length) !== "cpy";
      }).attr("r", function(r) {
        return dataRadius(elecciones[elecciones.dataset][r.properties.administrative_area.id]);
      });

      circles.filter(function() {
        var id = this.getAttribute("id");
        return id.substring(id.length - 3, id.length) === "cpy";
      }).attr("r", function(r) {
        return dataRadius(elecciones[elecciones.dataset][r.properties.administrative_area.id], argentina.svg.g.caba.zoom * 40);
      });

      d3.select("#preloader").style("display", "none");

      if (elecciones.dataset != "diputados") {
        url.parameters.data = elecciones.dataset || "";
      } else {
        delete url.parameters.data;
      }
    }

  });

  argentina.event.on("click", function(d) {
    argentina.datum = d;

    (function(d) {

      if ((!d) || (d.properties.administrative_area.length < 2)) {

        var centered = d || null;

        argentina.svg.g.caba.box.classed("disabled", centered);

        argentina.backbutton.visible(d);

        var b = argentina.svg.path.bounds(d);

        argentina.zoom = 0.95 / Math.max((b[1][0] - b[0][0]) / argentina.width, (b[1][1] - b[0][1]) / argentina.height);

        var translate = (argentina.zoom) ? [-(b[1][0] + b[0][0]) / 2, -(b[1][1] + b[0][1]) / 2] : [-argentina.width / 2, -argentina.height / 2];

        argentina.svg.g.admlevel3.classed("disabled", (!argentina.zoom) && argentina.vista.state === "votos");

        (function(g) {

          // g.transition().duration(650)
          g.attr("transform", "translate(" + argentina.width / 2 + "," + argentina.height / 2 + ")" +
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

          g.circles.filter(function() {
            var id = this.getAttribute("id");
            return id.substring(id.length - 3, id.length) !== "cpy";
          })
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

    argentina.svg.g.caba.admlevel2
      .attr("stroke-width", function() {
        return 0.5 / argentina.svg.g.caba.zoom + "pt";
      });
    argentina.svg.g.caba.admlevel3
      .attr("stroke-width", function() {
        return 0.5 / argentina.svg.g.caba.zoom + "pt";
      });

    argentina.svg.g.admlevel3.classed("disabled", function() {
      return !argentina.zoom && (argentina.vista.selected === "voto");
    });

    url.parameters.id = (d) ? d.properties.administrative_area.id : "";
    tweeter_share(shareURL(url), d);
    facebook_share(shareURL(url), d);

    argentina.selection = (d) ? d.properties.administrative_area.id : null;

    elecciones.event.updatedata({
      "view": argentina.vista.state,
      "id": argentina.selection,
      "dataset": elecciones.dataset,
      "data": elecciones[elecciones.dataset][argentina.selection]
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
      tweeter_share(shareURL(url), argentina.datum);
      facebook_share(shareURL(url), argentina.datum);
      updateBotones("votoBtn");
    },

    part: function() {

      argentina.svg.g.admlevel2.classed("transparent", true);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "part";
      url.parameters.view = argentina.vista.state;
      tweeter_share(shareURL(url), argentina.datum);
      facebook_share(shareURL(url), argentina.datum);
      updateBotones("partBtn");
    },

    prov: function() {

      updateBotones("provBtn");
      argentina.svg.g.admlevel2.classed("transparent", false);
      argentina.svg.g.admlevel3.classed("transparent disabled", false);
      argentina.svg.g.votes.classed("disabled", true);
      argentina.vista.state = "prov";
      url.parameters.view = argentina.vista.state;
      tweeter_share(shareURL(url), argentina.datum);
      facebook_share(shareURL(url), argentina.datum);
      updateBotones("provBtn");
    },

    state: "prov"

  };

  elecciones.load();
  updateBotones("provBtn");
})();