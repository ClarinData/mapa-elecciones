/* jshint undef: true, unused: true, strict: true, devel: true,  maxcomplexity: 2, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global d3, topojson */
/* exported mapObject */

var mapObject = function (map) {
  
        "use strict";

        map.id = map.id || "map";

        map.width = map.width || 600;

        map.height = map.height || 600;

        map.backbutton =  (function (backbutton) {

              backbutton.text = backbutton.text || "volver";

              backbutton.image = 'data:image/png;base64,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';

              backbutton.width = backbutton.width || 59;

              backbutton.height = backbutton.height || 86;

              backbutton.x = backbutton.x || map.width - backbutton.width;

              backbutton.y = backbutton.y || 0;

              return backbutton;

        })(

              map.backbutton || {}

        );

        map.event = d3.dispatch("click", "zoom", "progress", "ready", "error");

        map.projection = d3.geo.transverseMercator()
                               .rotate([62, 0])
                               .scale(1020)
                               .translate([(map.width / 2) + 35, (map.height / 2) - 685]);

        map.svg = (function(svg) {

              svg.path = d3.geo.path()
                           .projection(map.projection);

              svg.g = svg.append("g");

              svg.back = (function(back) {

                    back.append("rect")
                        .attr("class", "box")
                        .attr("width", map.backbutton.width)
                        .attr("height", map.backbutton.height)
                        .attr('x', map.backbutton.x + 2)
                        .attr('y', map.backbutton.y - 2)
                        .attr("clip-path", "clip");

                    back.append("image")
                        .attr("class", "image")
                        .attr("width", "24")
                        .attr("height", "53")
                        .attr('x', map.backbutton.x + 18)
                        .attr('y', map.backbutton.y + 5)
                        .attr("xlink:href", map.backbutton.image);

                    back.append("text")
                        .attr("class", "text")
                        .attr('x', map.backbutton.x + 10)
                        .attr('y', map.backbutton.y + 76)
                        .text(map.backbutton.text)
                        .on("select", function () {
                                    return;
                        });

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
                                      .append("b");

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
                                               ((d.properties.administrative_area[2]) ? ", " + d.properties.administrative_area[2].name : "");

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