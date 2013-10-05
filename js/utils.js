/* jshint undef: true, unused: true, strict: true, devel: false,  maxcomplexity: 4, maxparams: 4, maxdepth: 2, maxstatements: 15 */
/* global d3, window*/
/* exported getQueryParams, shareURL, tweeter, */

function getQueryParams(qs) {
  "use strict";

  getQueryParams.decode = function(s) {
    s = s.replace(/\+/g, ' ');
    s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/g,
      function(code, hex1, hex2, hex3) {
        var n1 = parseInt(hex1, 16) - 0xE0;
        var n2 = parseInt(hex2, 16) - 0x80;
        if (n1 === 0 && n2 < 32) return code;
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

  var parameters = {},
      match;

  // If no query string  was passed in use the one from the current page
  qs = qs || window.location.search;

  // Delete leading question mark, if there is one
  qs = (qs.charAt(0) === '?') ? qs.substring(1) : qs;

  // Parse it
  var re = /([^=&]+)(=([^&]*))?/g;
  while (match) {
    match = re.exec(qs);
    var key = decodeURIComponent(match[1].replace(/\+/g, ' '));
    var value = match[3] ? getQueryParams.decode(match[3]) : '';
    parameters[key] = value;
  }

  return parameters;
}

function shareURL(url) {
  "use strict";

  var myUrl = url.base,
      params = Object.getOwnPropertyNames(url.parameters);
  if (params.length) {
    var param = [];
    params.forEach(function(val) {
        if (url.parameters[val]) {
          param.push(val + "=" + url.parameters[val]);
        }
      });
    myUrl += "?" + param.join("&");
  }
  return myUrl;
}

function tweeter(url,d) {
  "use strict";
  d3.select("#shareTwitter")
    .attr("href", function () {
        var provincia,
            distrito,
            text = " a nivel nacional";
        if (d && d.properties && d.properties.administrative_area && d.properties.administrative_area.id != "TDF999") {
          provincia = d.properties.administrative_area[0].name;
          distrito = (d.properties.administrative_area[1]) ? d.properties.administrative_area[1].name : null;
          text = " en " + ((distrito) && (distrito + " (" + provincia + ")") || provincia);
        }

        return "https://twitter.com/intent/tweet?" +
               "hashtags=" + "Elecciones2013" + "&" +
               "text=" + encodeURIComponent("Mirá los resultados" + text) + "%0A&" +
               "&tw_p=tweetbutton&url=" + encodeURIComponent(url) + "&" +
               "via=clarincom";
    });
}