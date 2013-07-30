var PANEL_NORMAL    = "panel";
var PANEL_COLLAPSED = "panelcollapsed";
var PANEL_HEADING     = "h2";
var PANEL_CONTENT   = "panelcontent";
var PANEL_CNAME     = "panels";
var PANEL_ADELAY = 20; /*ms*/
var PANEL_ASTEPS = 10;

function setUpPanels(){loadSettings();var e=document.getElementsByTagName(PANEL_HEADING);for(var t=0;t<e.length;t++){var n=e[t];if(n.parentNode.className!=PANEL_NORMAL&&n.parentNode.className!=PANEL_COLLAPSED)continue;var r=n.firstChild.nodeValue;if(panelsStatus[r]=="false")n.parentNode.className=PANEL_COLLAPSED;else if(panelsStatus[r]=="true")n.parentNode.className=PANEL_NORMAL;else{panelsStatus[r]=n.parentNode.className==PANEL_NORMAL?"true":"false"}n.onclick=function(){var e=this.parentNode;var t=this.firstChild.nodeValue;var n=e.className==PANEL_COLLAPSED;animateTogglePanel(e,n)}}}function animateTogglePanel(e,t){var n=e.getElementsByTagName("div");var r=null;for(var i=0;i<n.length;i++){if(n[i].className==PANEL_CONTENT){r=n[i];break}}r.style.display="block";var s=r.offsetHeight;if(t)r.style.height="0px";var o=s/PANEL_ASTEPS;var u=!t?-1:1;setTimeout(function(){animateStep(r,1,o,u)},PANEL_ADELAY)}function animateStep(e,t,n,r){if(t<PANEL_ASTEPS){e.style.height=Math.round((r>0?t:10-t)*n)+"px";t++;setTimeout(function(){animateStep(e,t,n,r)},PANEL_ADELAY)}else{e.parentNode.className=r<0?PANEL_COLLAPSED:PANEL_NORMAL;e.style.display=e.style.height=""}}function loadSettings(){panelsStatus={};var e=document.cookie.indexOf(PANEL_CNAME+"=");if(e==-1)return;e+=PANEL_CNAME.length+1;var t=document.cookie.indexOf(";",e);if(t==-1)t=document.cookie.length;var n=unescape(document.cookie.substring(e,t));var r=n.split("|");for(var i=0;i<r.length;i++){var s=r[i].split(":");panelsStatus[s[0]]=s[1]}}if(window.addEventListener){window.addEventListener("load",setUpPanels,false)}else if(window.attachEvent){window.attachEvent("onload",setUpPanels)}
function miles(e){var t="";for(var n,r=e.length-1,n=0;r>=0;r--,n++){t=e.charAt(r)+(n>0&&n%3==0?".":"")+t}return t}
