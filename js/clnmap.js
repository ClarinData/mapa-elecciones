/* jshint undef: true, unused: true, strict: true, devel: true,  maxcomplexity: 2, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global d3, topojson */
/* exported mapObject */

var mapObject = function (map) {
  
        "use strict";

        map.id = map.id || "map";

        map.width = map.width || 528;

        map.height = map.height || 600;

        map.backbutton =  (function (backbutton) {

              backbutton.image = backbutton.imag || 'img/Boton_volver.png';

              backbutton.width = backbutton.width || 55;

              backbutton.height = backbutton.height || 90;

              backbutton.x = backbutton.x || 0;

              backbutton.y = backbutton.y || 0;

              return backbutton;

        })(

              map.backbutton || {}

        );

        map.event = d3.dispatch("click", "zoom", "progress", "ready", "error");

        map.projection = d3.geo.transverseMercator()
                               .rotate([62, 0])
                               .scale(1020)
                               .translate([(map.width / 2) + 15, (map.height / 2) - 685]);

        map.svg = (function(svg) {

              svg.path = d3.geo.path()
                           .projection(map.projection);

              svg.g = svg.append("g");

              svg.back = (function(back) {

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

              })(

                    svg.append("g")
                       .attr("id",  "backbutton")
                       .style("display", "none")
                       .on("click", function (d) {
                            map.event.click(d);
                        })

              );

              return svg;

        })(

              d3.select("#" + map.id)
                .append("svg")
                .attr("overflow", "hidden")
                .attr("width", map.width)
                .attr("height", map.height)

        );

        map.backbutton.visible = function (status) {

              return (status) ? map.svg.select("#backbutton").style("display", "block") : map.svg.select("#backbutton").style("display", "none");

        };

        map.tooltip = (function(tooltip) {

              tooltip.header = tooltip.append("div")
                                      .attr("class", "header slashback");

              tooltip.table = (function(table) {

                    table.row1 = (function(row) {

                          row.col1 = row.append("td");
                          row.col2 = row.append("td");

                          return row;
                    })(

                         table.append("tr")

                    );

                    table.append("hr");

                    table.row2 = (function(row) {

                          row.col1 = row.append("td");
                          row.col1.text("Resto de los partidos");
                          row.col2 = row.append("td");

                          return row;

                    })(

                         table.append("tr")

                    );

                    table.append("hr");

                    return table;

              })(

                    tooltip.append("table")
                           .attr("border","0")

              );

              return tooltip;

      })(

            d3.select("body")
              .append("div")
              .attr("class", "tooltip")

      );

      map.load = function (file) {
            d3.json(file)
              .on("progress", function() {
                              map.event.progress(d3.event.loaded);
              })
              .get(function(error, json) {

                    if (error) {

                          map.event.error(error, json);

                    }

                    map.svg.g = (function (g) {

                          function createPaths(obj, sel) {

                                obj.selectAll("text")
                                   .data(topojson.feature(json, json.objects[sel]).features)
                                   .enter()
                                   .append("path")
                                   .attr("id", function(d) {

                                      var id = map.id;
                                      for (var i=0; i < d.properties.administrative_area.length; i++) {
                                          id += "_" + d.properties.administrative_area[i].id;
                                      }
                                      return id;

                                    })
                                   .attr("class", function(d){

                                      return ("admlevel" + d.properties.administrative_area.length);

                                   })
                                   .on("mouseover", function(d){

                                      map.tooltip.header.text(function () {
                                        return d.properties.administrative_area[1].name +
                                               ((d.properties.administrative_area[2]) ? ", " + d.properties.administrative_area[2].name + ((d.properties.administrative_area[2]).description ? "\n(" + d.properties.administrative_area[2].description  + ")": "") : "");

                                      });
                                      return map.tooltip.style("left", (d3.event.pageX + 5) + "px")
                                                        .style("top", (d3.event.pageY + 5) + "px")
                                                        .style("display", "block");

                                    })
                                   .on("mousemove", function(){

                                      return map.tooltip.style("top", (d3.event.pageY-10)+"px")
                                                        .style("left",(d3.event.pageX+10)+"px");

                                    })
                                   .on("mouseout", function(){

                                      return map.tooltip.style("display", "none");

                                    })
                                   .on("click", function (d) {

                                      map.event.click(d);

                                    })
                                   .attr("d", map.svg.path)
                                   .call(
                                          d3.behavior
                                            .zoom().on("zoom", function(d) {
                                                  map.event.zoom(d, d3.event.translate, d3.event.scale);
                                            })
                                    );

                                   return obj;

                          }

                          g.votes = (function (votes) {

                                votes.selectAll("text")
                                     .attr("class", "disabled") // 
                                     .data(topojson.feature(json, json.objects.admlevel3).features)
                                     .enter()
                                     .append("circle")
                                     .attr("id", function(d) {

                                            var id = map.id + "_votes";
                                            for (var i=0; i < d.properties.administrative_area.length; i++) {
                                                id += "_" + d.properties.administrative_area[i].id;
                                            }
                                            return id;

                                      })
                                     .attr("class", function(){

                                            var v = Math.floor(Math.random()*6);
                                            var force_class = ["pp1100", "pp2100", "pp3100", "pp4100", "pp5100", "pp6100"];
                                            return (force_class[v]);

                                     })
                                     .attr("r", function () {

                                            var v = Math.floor((Math.random()*50)+1);

                                            return Math.sqrt(v/Math.PI);

                                     })
                                    .attr("stroke-width", "0")
                                    .attr("cx", function (d) {

                                            return map.svg.path.centroid(d)[0];

                                    })
                                    .attr("cy", function (d) {

                                            return map.svg.path.centroid(d)[1];

                                    });

                                return votes;

                          })(

                                g.append("g").attr("id", map.id + "_votes")
                                             .attr("class", "disabled")

                          );

                          g.admlevel3 = (function (admlevel3) {

                               return createPaths(admlevel3, "admlevel3");

                          })(

                                g.append("g").attr("id", map.id + "_admlevel3")
                                             .attr("class", "states")

                          );

                          g.admlevel2 = (function (admlevel2) {

                               return createPaths(admlevel2, "admlevel2");

                          })(

                                g.append("g").attr("id", map.id + "_admlevel2")
                                             .attr("class", "states")

                          );

                          return g;

                    })(

                          map.svg.g

                    );

                    map.event.ready(json);

              });
      };

      return map;

};