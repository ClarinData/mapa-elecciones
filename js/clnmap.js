/* jshint undef: true, unused: true, strict: true, devel: true,  maxcomplexity: 2, maxparams: 3, maxdepth: 2, maxstatements: 20 */
/* global d3, topojson */
/* exported mapObject */

var mapObject = function(map) {

  "use strict";

  map.id = map.id || "map";

  map.width = map.width || 519;

  map.height = map.height || 590;

  map.backbutton = (function(backbutton) {

    backbutton.image = backbutton.imag || 'img/Boton_volver.png';

    backbutton.width = backbutton.width || 55;

    backbutton.height = backbutton.height || 90;

    backbutton.x = backbutton.x || 0;

    backbutton.y = backbutton.y || 0;

    return backbutton;

  })(

    map.backbutton || {}

  );

  map.dataFiles = [];

  map.event = d3.dispatch("click", "zoom", "progress", "ready", "error");

  map.projection = d3.geo.transverseMercator()
    .rotate([62, 0])
    .scale(1010)
    .translate([(map.width / 2) + 15, (map.height / 2) - 680]);

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
      .attr("id", "backbutton")
      .style("display", "none")
      .on("click", function(d) {
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

  map.backbutton.visible = function(status) {

    return (status) ? map.svg.select("#backbutton").style("display", "block") : map.svg.select("#backbutton").style("display", "none");

  };

  map.tooltip = (function(tooltip) {

    tooltip.height = function() {
      return tooltip[0][0].clientHeight;
    };

    tooltip.width = function() {
      return tooltip[0][0].clientWidth;
    };

    tooltip.left = function() {
      return tooltip[0][0].offsetLeft;
    };

    tooltip.top = function() {
      return tooltip[0][0].offsetTop;
    };

    tooltip.title = d3.select("#tooltip_title");

    tooltip.info = (function(info) {

      info.text = function(text) {

        info.classed("active", info[0][0].innerText = text);

      };

      return info;

    })(

      d3.select("#tooltip_info")

    );

    return tooltip;

  })(

    d3.select("#tooltip")

  );

  map.load = function(file) {
    d3.json(file)
      .on("progress", function() {
        map.event.progress(d3.event.loaded,file);
      })
      .get(function(error, json) {

        if (error) {

          map.event.error(error, json);

        }

        map.svg.g = (function(g) {

          function createPaths(obj, sel) {

            obj.selectAll("text")
              .data(topojson.feature(json, json.objects[sel]).features)
              .enter()
              .append("path")
              .attr("id", function(d) {

                var id = map.id;
                d.properties.administrative_area.id = "";
                for (var i = 0; i < d.properties.administrative_area.length; i++) {
                  id += "_" + d.properties.administrative_area[i].id;
                  d.properties.administrative_area.id += d.properties.administrative_area[i].id;
                }
                return id;

              })
              .attr("class", function(d) {

                return ("admlevel" + d.properties.administrative_area.length);

              })
              .on("mouseover", function(d) {

                map.tooltip.title.text(d.properties.administrative_area[d.properties.administrative_area.length - 1].name);
                map.tooltip.info.text(d.properties.administrative_area[d.properties.administrative_area.length - 1].description);
                // map.tooltip.info.activate();

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

              })
              .on("click", function(d) {

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

          g.votes = (function(votes) {

            votes.selectAll("text")
              .attr("class", "disabled")
              .data(topojson.feature(json, json.objects.admlevel3).features)
              .enter()
              .append("circle")
              .attr("id", function(d) {

                var id = map.id + "_votes";
                for (var i = 0; i < d.properties.administrative_area.length; i++) {
                  id += "_" + d.properties.administrative_area[i].id;
                }
                return id;

              })
              .attr("class", function() {

                var v = Math.floor(Math.random() * 6);
                var force_class = ["pp1100", "pp2100", "pp3100", "pp4100", "pp5100", "pp6100"];
                return (force_class[v]);

              })
              .attr("r", function() {

                var v = Math.floor((Math.random() * 50) + 1);

                return Math.sqrt(v / Math.PI);

              })
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

          g.admlevel3 = (function(admlevel3) {

            return createPaths(admlevel3, "admlevel3");

          })(

            g.append("g").attr("id", map.id + "_admlevel3")
            .attr("class", "states")

          );

          g.admlevel2 = (function(admlevel2) {

            return createPaths(admlevel2, "admlevel2");

          })(

            g.append("g").attr("id", map.id + "_admlevel2")
            .attr("class", "states")

          );

          return g;

        })(

          map.svg.g

        );

        map.event.ready(file, json);

      });
  };

  map.dataLoad = function(file, callback) {
    d3.json(file)
      .on("progress", function() {
        map.event.progress(d3.event.loaded,file);
      })
      .get(function(error, json) {

        callback(error, json);

      });
  };

  return map;

};