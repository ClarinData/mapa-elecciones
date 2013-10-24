/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 3, maxparams: 3, maxdepth: 2, maxstatements: 15 */
/* global d3, topojson, elecciones, navigator, window */
/* exported mapObject, getQueryParams*/

var mapObject = function(map) {

  "use strict";

  map.id = map.id || "map";
  map.width = map.width || 519;
  map.height = map.height || 590;
  map.backbutton = (function(backbutton) {
    backbutton.image = backbutton.imag || 'img/Boton_volver.png';
    backbutton.width = backbutton.width || 55;
    backbutton.height = backbutton.height || 90;
    backbutton.x = backbutton.x || map.width - backbutton.width;
    backbutton.y = backbutton.y || 0;
    backbutton.visible = function(status) {
      return this.svg.style("display", (status) ? "block" : "none");
    };
    return backbutton;
  })(
    map.backbutton || {}
  );

  map.dataFiles = [];

  map.event = d3.dispatch("click",
    "zoom",
    "progress",
    "ready",
    "error",
    "progressData",
    "loadData");

  map.projection = d3.geo.transverseMercator()
    .center([2.5, -38.5])
    .rotate([66, 0])
    .scale((map.height * 56.5) / 33)
    .translate([(map.width / 2), (map.height / 2)]);

  map.tooltip = (function(tooltip) {
    tooltip.height = function() {
      return tooltip.property("clientHeight");
    };
    tooltip.width = function() {
      return tooltip.property("clientWidth");
    };
    tooltip.left = function() {
      return tooltip.property("clientLeft");
    };
    tooltip.top = function() {
      return tooltip.property("clientTop");
    };
    tooltip.title = d3.select("#tooltip_title");
    tooltip.info = (function(info) {
      info.text = function(text) {
        text = text || null;
        info.property("innerText", text);
        info.classed("active", text);
      };
      return info;
    })(
      d3.select("#tooltip_info")
    );

    tooltip.table = (function(table) {
      table.row = (function(row) {
        row.color = [
          d3.select("#toolFuerza_1"),
          d3.select("#toolFuerza_2"),
          d3.select("#toolFuerza_3")
        ];
        row.name = [
          d3.select("#toolPartido_1"),
          d3.select("#toolPartido_2"),
          d3.select("#toolPartido_3")
        ];
        row.percent = [
          d3.select("#toolPorcentaje_1"),
          d3.select("#toolPorcentaje_2"),
          d3.select("#toolPorcentaje_3")
        ];
        return row;
      })({});
      return table;
    })(
      d3.select("#toolTable")
    );
    tooltip.footer = d3.select("#toolFooter");
    return tooltip;
  })(
    d3.select("#tooltip")
  );

  map.load = function(file) {
    map.svg = (function(svg) {
      svg.path = d3.geo.path()
        .projection(map.projection);
      svg.g = svg.append("g");
      return svg;
    })(
      d3.select("#" + map.id)
      .append("svg")
      .attr("overflow", "hidden")
      .attr("width", map.width)
      .attr("height", map.height)
    );

    map.backbutton.svg = (function(back) {
      back.append("image")
        .attr("class", "image")
        .attr("width", map.backbutton.width)
        .attr("height", map.backbutton.height)
        .attr('x', map.backbutton.x)
        .attr('y', map.backbutton.y)
        .attr("xlink:href", map.backbutton.image);
      back.append("clippath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", map.backbutton.width)
        .attr("height", map.backbutton.height)
        .attr('x', map.backbutton.x)
        .attr('y', map.backbutton.y);
      return back;
    })(
      map.svg.append("g")
      .attr("id", "backbutton")
      .style("display", "none")
      .on("click", function(d) {
        map.event.click(d);
      })
    );

    d3.json(file)
      .on("load", function() { console.log("success!"); })
      .on("progress", function() {
        map.event.progress(d3.event.loaded, file);
      })
      .get(function(error, json) {
        if (error) {
          map.event.error(error, json);
        }
        map.svg.g = (function(g) {

          function createPaths(obj, sel) {
            obj.path = (function(dataObj) {
              return dataObj.append("path");
            })(
              obj.selectAll("path use")
              .data(topojson.feature(json, json.objects[sel]).features)
              .enter()
            );
            return obj;
          }

          function pathsAttr(obj) {
            obj.attr("id", function(d) {
              var id = map.id + "_";
              d.properties.administrative_area.id = "";
              for (var i = 0; i < d.properties.administrative_area.length; i++) {
                id += d.properties.administrative_area[i].id;
                d.properties.administrative_area.id += d.properties.administrative_area[i].id;
              }
              return id;
            })
              .attr("class", function(d) {
                return ("admlevel" + d.properties.administrative_area.length);
              })
              .on("click", function(d) {

                d = d || this.correspondingElement.__data__;

                console.log(this.correspondingElement.__data__);

                obj.sort(function(a) {
                  a = a || this.correspondingElement.__data__;
                  return (a.properties.administrative_area.id === d.properties.administrative_area.id) ? 1 : -1;
                });

                map.event.click(d);
              })
              .attr("d", map.svg.path)
              .call(
                d3.behavior
                .zoom().on("zoom", function(d) {

                  d = d || this.correspondingElement.__data__;

                  map.event.zoom(d, d3.event.translate, d3.event.scale);
                })
            );

            if (!navigator.isTouch) {
              obj.on("mouseover", function(d) {

                console.log(this);

                this.correspondingElement = this.correspondingElement || d3.select("#" + this.getAttribute("xlink:href")).call(function () {return this;});

                d = d || this.correspondingElement.__data__;

                obj.sort(function(a) {
                  a = a || this.correspondingElement.__data__;
                  return a.properties.administrative_area.id === d.properties.administrative_area.id ? 1 : -1;
                });

                map.tooltip.title.text(d.properties.administrative_area[d.properties.administrative_area.length - 1].name);
                map.tooltip.info.text(d.properties.administrative_area[d.properties.administrative_area.length - 1].description);
                var dataE = elecciones[elecciones.dataset][d.properties.administrative_area.id];
                if (dataE && (dataE.votacion.pp[0].votos > 0)) {
                  for (var x = 0; x < 3; x++) {
                    map.tooltip.table.row.color[x].property("className", "fp_" + dataE.votacion.pp[x].fuerza);
                    map.tooltip.table.row.name[x].property("innerHTML", dataE.votacion.pp[x].nombre.toLowerCase());
                    map.tooltip.table.row.percent[x].property("innerHTML", parseFloat(dataE.votacion.pp[x].per).toLocaleString() + "%");
                  }
                  map.tooltip.table.classed("disabled", false);
                } else {
                  map.tooltip.table.classed("disabled", true);
                  map.tooltip.footer.property("innerHTML", (d.properties.administrative_area.id === "TDF999") ?
                    "<div>Territorio en disputa con el Reino Unido.</div><div>Sin datos para visualizar.</div>" :
                    "Sin datos para visualizar."
                  );
                }
                return map.tooltip.style("left", d3.event.pageX + 5 + "px")
                  .style("top", d3.event.pageY + 5 + "px")
                  .style("display", "block");
              })
                .on("mousemove", function() {
                  var left = d3.event.pageX + 10;
                  var top = ((d3.event.pageY - 10 + map.tooltip.height()) > 730) ? d3.event.pageY + 30 - map.tooltip.height() : d3.event.pageY - 10;
                  return map.tooltip.style("top", top + "px")
                    .style("left", left + "px");
                })
                .on("mouseout", function() {
                  return map.tooltip.style("display", "none");
                });
            }
            return obj;
          }

          g.votes = (function(votes) {
            votes.selectAll("circle")
              .attr("class", "disabled")
              .data(topojson.feature(json, json.objects.admlevel3).features)
              .enter()
              .append("circle")
              .attr("id", function(d) {
                var id = map.id + "_votes_";
                for (var i = 0; i < d.properties.administrative_area.length; i++) {
                  id += d.properties.administrative_area[i].id;
                }
                return id;
              })
              .attr("r", 0)
              .attr("stroke-width", "0")
              .attr("cx", function(d) {
                return map.svg.path.centroid(d)[0];
              })
              .attr("cy", function(d) {
                return map.svg.path.centroid(d)[1];
              });
            return votes;
          })(
            g.append("g").attr("id", map.id + "_votes")
            .attr("class", "disabled")
          );

          g.admlevel3 = createPaths(
            g.append("g")
            .attr("id", map.id + "_admlevel3")
            .attr("class", "states"),
            "admlevel3");

          g.admlevel3.pathAttr = pathsAttr(
            g.admlevel3.path
          );

          g.admlevel2 = createPaths(
            g.append("g")
            .attr("id", map.id + "_admlevel2")
            .attr("class", "states"),
            "admlevel2");

          g.admlevel2.pathAttr = pathsAttr(
            g.admlevel2.path
          );

          g.circles = g.selectAll("circle");

          g.paths = g.selectAll("path");

          return g;

        })(
          map.svg.g
        );

        map.event.ready(file, json);

      });
  };

  map.dataLoad = function(file, callback) {
    d3.json(file)
      .on("progress.data", function() {
        map.event.progressData(d3.event.loaded);
      })
      .on("load.data", function() {
       map.event.loadData(file);
      })
      .get(function(error, json) {
        callback(error, json);
      });
  };

  return map;

};

navigator.isTouch = ('ontouchstart' in window);