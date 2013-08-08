/* jshint undef: true, unused: true, strict: true, devel: true,  maxcomplexity: 3, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global mapObject */
/* exported argentina */

var argentina = new mapObject({
  id: "map_arg"
});

var dataFiles = {};

var elecciones = {
  "diputados": {},
  "senadores": {},
  "event" : d3.dispatch("click", "loaded")
};

(function() {

  "use strict";

  argentina.event.on("error", function(error, json) {
    console.log(error, json);
  });

  argentina.event.on("ready", function(file, data) {

    console.log("map: ", data);

  });

  argentina.dataLoad("data/datafiles.json", function(error, json) {

    console.log("dataFiles", json);

    dataFiles = (error) ? [] : json;

    elecciones.event.loaded();

  });

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

  }

  elecciones.event.on("loaded", (function() {

    if (dataFiles.diputados && dataFiles.diputados.length > 0) {

      for (var i = Math.min(2, dataFiles.diputados.length - 1); i >= 0; i--) {

        createDataObj(dataFiles.diputados, elecciones.diputados);

      }

      elecciones.event.loaded();

    }

    if (dataFiles.senadores && dataFiles.senadores.length > 0) {

      for (var i = Math.min(2, dataFiles.senadores.length - 1); i >= 0; i--) {

        createDataObj(dataFiles.senadores, elecciones.senadores);

      }

      elecciones.event.loaded();

    }

    // argentina.svg.g.admlevel2.select("#map_arg_54_1").classed("pp1100", true);
    // // argentina.svg.g.admlevel3.select("#map_arg_54_1_17").classed("RedClass", true);
    // argentina.svg.g.admlevel3.selectAll("path").each(function () {

    //   var v = Math.floor(Math.random()*12);
    //   var force_class = ["pp1100", "pp2100", "pp3100", "pp4100", "pp5100", "pp6100", "pp1050", "pp2050", "pp3050", "pp4050", "pp5050", "pp6050"];
    //   argentina.svg.g.admlevel3.select("#" + this.id).classed(force_class[v], true);

    // });
    // // argentina.svg.g.admlevel3.select("#map_arg_54_1_26").classed("RedClass", true);
    // argentina.svg.g.admlevel2.select("#map_arg_54_11").classed("pp3100", true);
    // argentina.svg.g.admlevel2.select("#map_arg_54_16").classed("pp6100", true);
    // argentina.svg.g.votes.select("#map_arg_votes_54_1_17").attr("r", "7");


  }));

  argentina.load("argentina.json");

  console.log("elecciones: ", elecciones);

  argentina.event.on("progress", function(size,file) {

    console.log("Loaded: ", file, size);

  });

  // argentina.event.on("zoom", function(d, t, s) {
  //   console.log("here", d, t, s);
  // });

  argentina.event.on("click", function(d) {

    (d) ? elecciones.event.click({
      "diputados": elecciones.diputados[d.properties.administrative_area[0].id],
      "senadores": elecciones.senadores[d.properties.administrative_area[0].id]
    }) : null;

    if ((!d) || (d.properties.administrative_area.length < 2)) {

      var centered = d || null;

      // console.log(d);

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


      // (d) ? console.log("click on: ", d.properties.administrative_area[d.properties.administrative_area.length-1]) : null;

    }

  });

  elecciones.event.on("click", function(dataE){
      console.log("dataE: ", dataE);
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