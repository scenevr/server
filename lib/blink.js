'use strict';

var WSServer = require("ws").Server;

function Blink(reflectors) {
  this.reflectors = reflectors;
}

Blink.prototype.listen = function(){
  console.log("Listening for RDP sessions on 9223...");

  // Fixme
  this.scene = this.reflectors['/chess.xml'].scene;

  var self = this,
    wss = new WSServer({ port: 9223 });

  wss.on('connection', function connection(ws) {
    console.log("Connection");

    console.log(self.reflectors.length);

    ws.on('message', function incoming(message) {
      self.onMessage(message);
    });

    self.ws = ws;
  });
}

Blink.prototype.send = function(obj){
  this.ws.send(JSON.stringify(obj));
  // console.log(JSON.stringify(obj));
}


Blink.prototype.onMessage = function(message){
  // console.log(message);

  var message = JSON.parse(message),
    dict = {
      // Feature detection
      "Page.canScreencast" : "featureQuery",
      "Page.canEmulate" : "featureQuery",
      "Worker.canInspectWorkers" : "featureQuery",

      // 
      "Inspector.enable" : "emptyResponse",
      "Page.enable" : "emptyResponse",
      "Console.enable" : "emptyResponse",
      "DOM.enable" : "emptyResponse",
      "CSS.enable" : "emptyResponse",
      "Runtime.enable" : "emptyResponse",
      "Worker.enable" : "emptyResponse",
      "Profiler.enable": "emptyResponse",

      // Query the dom
      "DOM.getDocument" : "getDocument",
      "DOM.highlightNode" : "highlightNode",
      "DOM.hideHighlight" : "hideHighlight",

      // Console
      "Console.addInspectedNode" : "addInspectedNode",

      // CSS
      "CSS.getComputedStyleForNode" : "getComputedStyleForNode",
      "CSS.getInlineStylesForNode" : "getInlineStylesForNode",
      "CSS.getMatchedStylesForNode" : "getMatchedStylesForNode"
    },
    func = dict[message.method];

  if(this[func]) {
    this[func](message);
  } else if(func) {
    console.log("Blink#" + func + " does not exist.")
  } else {
    console.log("method '" + message.method + "' is not handled.")
    console.log('received: %s', JSON.stringify(message));
  }
}

Blink.prototype.featureQuery = function(m){
  this.send({ id : m.id, result : { result : true } });
};

Blink.prototype.emptyResponse = function(m){
  this.send({ id : m.id, result : {} });
}

Blink.prototype.highlightNode = function(m){
  console.log("Highlight node #" + m.params.nodeId);
}

Blink.prototype.hideHighlight = function(){
  // ...
}

Blink.prototype.getMatchedStylesForNode = function(m){
  this.send({
    id : m.id,
    result : {
      "matchedCSSRules": [
        {
          "rule": {
            "selectorList": {
              "selectors": [
                {
                  "value": "h2"
                }
              ],
              "text": "h2"
            },
            "origin": "user-agent",
            "style": {
              "cssProperties": [
                {
                  "name": "display",
                  "value": "block"
                },
                {
                  "name": "font-size",
                  "value": "1.5em"
                },
                {
                  "name": "-webkit-margin-before",
                  "value": "0.83em"
                },
                {
                  "name": "-webkit-margin-after",
                  "value": "0.83em"
                },
                {
                  "name": "-webkit-margin-start",
                  "value": "0px"
                },
                {
                  "name": "-webkit-margin-end",
                  "value": "0px"
                },
                {
                  "name": "font-weight",
                  "value": "bold"
                }
              ],
              "shorthandEntries": []
            }
          },
          "matchingSelectors": [
            0
          ]
        }
      ]
    }
  });
}

Blink.prototype.getComputedStyleForNode = function(m){
  this.send({
    id : m.id,
    result : {
      "computedStyle":[{"name":"background-attachment","value":"scroll"},{"name":"background-blend-mode","value":"normal"},{"name":"background-clip","value":"border-box"},{"name":"background-color","value":"rgba(0, 0, 0, 0)"},{"name":"background-image","value":"none"},{"name":"background-origin","value":"padding-box"},{"name":"background-position","value":"0% 0%"},{"name":"background-repeat","value":"repeat"},{"name":"background-size","value":"auto"},{"name":"border-bottom-color","value":"rgba(0, 0, 0, 0.0784314)"},{"name":"border-bottom-left-radius","value":"0px"},{"name":"border-bottom-right-radius","value":"0px"},{"name":"border-bottom-style","value":"solid"},{"name":"border-bottom-width","value":"2px"},{"name":"border-collapse","value":"separate"},{"name":"border-image-outset","value":"0px"},{"name":"border-image-repeat","value":"stretch"},{"name":"border-image-slice","value":"100%"},{"name":"border-image-source","value":"none"},{"name":"border-image-width","value":"1"},{"name":"border-left-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"border-left-style","value":"none"},{"name":"border-left-width","value":"0px"},{"name":"border-right-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"border-right-style","value":"none"},{"name":"border-right-width","value":"0px"},{"name":"border-top-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"border-top-left-radius","value":"0px"},{"name":"border-top-right-radius","value":"0px"},{"name":"border-top-style","value":"none"},{"name":"border-top-width","value":"0px"},{"name":"bottom","value":"auto"},{"name":"box-shadow","value":"none"},{"name":"box-sizing","value":"border-box"},{"name":"caption-side","value":"top"},{"name":"clear","value":"none"},{"name":"clip","value":"auto"},{"name":"color","value":"rgba(0, 0, 0, 0.8)"},{"name":"cursor","value":"auto"},{"name":"direction","value":"ltr"},{"name":"display","value":"block"},{"name":"empty-cells","value":"show"},{"name":"float","value":"none"},{"name":"font-family","value":"'Source Sans Pro', 'Lucida Grande', sans-serif"},{"name":"font-kerning","value":"auto"},{"name":"font-size","value":"24px"},{"name":"font-stretch","value":"normal"},{"name":"font-style","value":"normal"},{"name":"font-variant","value":"normal"},{"name":"font-variant-ligatures","value":"normal"},{"name":"font-weight","value":"normal"},{"name":"height","value":"69px"},{"name":"image-rendering","value":"auto"},{"name":"isolation","value":"auto"},{"name":"left","value":"auto"},{"name":"letter-spacing","value":"-0.800000011920929px"},{"name":"line-height","value":"25px"},{"name":"list-style-image","value":"none"},{"name":"list-style-position","value":"outside"},{"name":"list-style-type","value":"disc"},{"name":"margin-bottom","value":"20px"},{"name":"margin-left","value":"0px"},{"name":"margin-right","value":"0px"},{"name":"margin-top","value":"0px"},{"name":"max-height","value":"none"},{"name":"max-width","value":"none"},{"name":"min-height","value":"0px"},{"name":"min-width","value":"0px"},{"name":"mix-blend-mode","value":"normal"},{"name":"object-fit","value":"fill"},{"name":"object-position","value":"50% 50%"},{"name":"opacity","value":"1"},{"name":"orphans","value":"auto"},{"name":"outline-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"outline-offset","value":"0px"},{"name":"outline-style","value":"none"},{"name":"outline-width","value":"0px"},{"name":"overflow-wrap","value":"normal"},{"name":"overflow-x","value":"visible"},{"name":"overflow-y","value":"visible"},{"name":"padding-bottom","value":"22px"},{"name":"padding-left","value":"0px"},{"name":"padding-right","value":"0px"},{"name":"padding-top","value":"20px"},{"name":"page-break-after","value":"auto"},{"name":"page-break-before","value":"auto"},{"name":"page-break-inside","value":"auto"},{"name":"pointer-events","value":"auto"},{"name":"position","value":"static"},{"name":"resize","value":"none"},{"name":"right","value":"auto"},{"name":"speak","value":"normal"},{"name":"table-layout","value":"auto"},{"name":"tab-size","value":"8"},{"name":"text-align","value":"center"},{"name":"text-decoration","value":"none"},{"name":"text-indent","value":"0px"},{"name":"text-rendering","value":"auto"},{"name":"text-shadow","value":"none"},{"name":"text-overflow","value":"clip"},{"name":"text-transform","value":"none"},{"name":"top","value":"auto"},{"name":"touch-action","value":"auto"},{"name":"transition-delay","value":"0s"},{"name":"transition-duration","value":"0s"},{"name":"transition-property","value":"all"},{"name":"transition-timing-function","value":"ease"},{"name":"unicode-bidi","value":"normal"},{"name":"vertical-align","value":"baseline"},{"name":"visibility","value":"visible"},{"name":"white-space","value":"normal"},{"name":"widows","value":"1"},{"name":"width","value":"1010px"},{"name":"will-change","value":"auto"},{"name":"word-break","value":"normal"},{"name":"word-spacing","value":"0px"},{"name":"word-wrap","value":"normal"},{"name":"z-index","value":"auto"},{"name":"zoom","value":"1"},{"name":"-webkit-animation-delay","value":"0s"},{"name":"-webkit-animation-direction","value":"normal"},{"name":"-webkit-animation-duration","value":"0s"},{"name":"-webkit-animation-fill-mode","value":"none"},{"name":"-webkit-animation-iteration-count","value":"1"},{"name":"-webkit-animation-name","value":"none"},{"name":"-webkit-animation-play-state","value":"running"},{"name":"-webkit-animation-timing-function","value":"ease"},{"name":"-webkit-appearance","value":"none"},{"name":"backface-visibility","value":"visible"},{"name":"-webkit-backface-visibility","value":"visible"},{"name":"-webkit-background-clip","value":"border-box"},{"name":"-webkit-background-composite","value":"source-over"},{"name":"-webkit-background-origin","value":"padding-box"},{"name":"-webkit-background-size","value":"auto"},{"name":"-webkit-border-horizontal-spacing","value":"0px"},{"name":"-webkit-border-image","value":"none"},{"name":"-webkit-border-vertical-spacing","value":"0px"},{"name":"-webkit-box-align","value":"stretch"},{"name":"-webkit-box-decoration-break","value":"slice"},{"name":"-webkit-box-direction","value":"normal"},{"name":"-webkit-box-flex","value":"0"},{"name":"-webkit-box-flex-group","value":"1"},{"name":"-webkit-box-lines","value":"single"},{"name":"-webkit-box-ordinal-group","value":"1"},{"name":"-webkit-box-orient","value":"horizontal"},{"name":"-webkit-box-pack","value":"start"},{"name":"-webkit-box-reflect","value":"none"},{"name":"-webkit-box-shadow","value":"none"},{"name":"-webkit-clip-path","value":"none"},{"name":"-webkit-column-break-after","value":"auto"},{"name":"-webkit-column-break-before","value":"auto"},{"name":"-webkit-column-break-inside","value":"auto"},{"name":"-webkit-column-count","value":"auto"},{"name":"-webkit-column-gap","value":"normal"},{"name":"-webkit-column-rule-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"-webkit-column-rule-style","value":"none"},{"name":"-webkit-column-rule-width","value":"0px"},{"name":"-webkit-column-span","value":"none"},{"name":"-webkit-column-width","value":"auto"},{"name":"-webkit-filter","value":"none"},{"name":"align-content","value":"stretch"},{"name":"align-items","value":"start"},{"name":"align-self","value":"start"},{"name":"flex-basis","value":"auto"},{"name":"flex-grow","value":"0"},{"name":"flex-shrink","value":"1"},{"name":"flex-direction","value":"row"},{"name":"flex-wrap","value":"nowrap"},{"name":"justify-content","value":"start"},{"name":"-webkit-font-smoothing","value":"antialiased"},{"name":"-webkit-highlight","value":"none"},{"name":"-webkit-hyphenate-character","value":"auto"},{"name":"-webkit-line-box-contain","value":"block inline replaced"},{"name":"-webkit-line-break","value":"auto"},{"name":"-webkit-line-clamp","value":"none"},{"name":"-webkit-locale","value":"en"},{"name":"-webkit-margin-before-collapse","value":"collapse"},{"name":"-webkit-margin-after-collapse","value":"collapse"},{"name":"-webkit-mask-box-image","value":"none"},{"name":"-webkit-mask-box-image-outset","value":"0px"},{"name":"-webkit-mask-box-image-repeat","value":"stretch"},{"name":"-webkit-mask-box-image-slice","value":"0 fill"},{"name":"-webkit-mask-box-image-source","value":"none"},{"name":"-webkit-mask-box-image-width","value":"auto"},{"name":"-webkit-mask-clip","value":"border-box"},{"name":"-webkit-mask-composite","value":"source-over"},{"name":"-webkit-mask-image","value":"none"},{"name":"-webkit-mask-origin","value":"border-box"},{"name":"-webkit-mask-position","value":"0% 0%"},{"name":"-webkit-mask-repeat","value":"repeat"},{"name":"-webkit-mask-size","value":"auto"},{"name":"order","value":"0"},{"name":"perspective","value":"none"},{"name":"-webkit-perspective","value":"none"},{"name":"perspective-origin","value":"505px 34.5px"},{"name":"-webkit-perspective-origin","value":"505px 34.5px"},{"name":"-webkit-print-color-adjust","value":"economy"},{"name":"-webkit-rtl-ordering","value":"logical"},{"name":"shape-outside","value":"none"},{"name":"shape-image-threshold","value":"0"},{"name":"shape-margin","value":"0px"},{"name":"-webkit-tap-highlight-color","value":"rgba(0, 0, 0, 0.4)"},{"name":"-webkit-text-combine","value":"none"},{"name":"-webkit-text-decorations-in-effect","value":"none"},{"name":"-webkit-text-emphasis-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"-webkit-text-emphasis-position","value":"over"},{"name":"-webkit-text-emphasis-style","value":"none"},{"name":"-webkit-text-fill-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"-webkit-text-orientation","value":"vertical-right"},{"name":"-webkit-text-security","value":"none"},{"name":"-webkit-text-stroke-color","value":"rgba(0, 0, 0, 0.8)"},{"name":"-webkit-text-stroke-width","value":"0px"},{"name":"transform","value":"none"},{"name":"-webkit-transform","value":"none"},{"name":"transform-origin","value":"505px 34.5px"},{"name":"-webkit-transform-origin","value":"505px 34.5px"},{"name":"transform-style","value":"flat"},{"name":"-webkit-transform-style","value":"flat"},{"name":"-webkit-transition-delay","value":"0s"},{"name":"-webkit-transition-duration","value":"0s"},{"name":"-webkit-transition-property","value":"all"},{"name":"-webkit-transition-timing-function","value":"ease"},{"name":"-webkit-user-drag","value":"auto"},{"name":"-webkit-user-modify","value":"read-only"},{"name":"-webkit-user-select","value":"text"},{"name":"-webkit-writing-mode","value":"horizontal-tb"},{"name":"-webkit-app-region","value":"no-drag"},{"name":"buffered-rendering","value":"auto"},{"name":"clip-path","value":"none"},{"name":"clip-rule","value":"nonzero"},{"name":"mask","value":"none"},{"name":"filter","value":"none"},{"name":"flood-color","value":"rgb(0, 0, 0)"},{"name":"flood-opacity","value":"1"},{"name":"lighting-color","value":"rgb(255, 255, 255)"},{"name":"stop-color","value":"rgb(0, 0, 0)"},{"name":"stop-opacity","value":"1"},{"name":"color-interpolation","value":"srgb"},{"name":"color-interpolation-filters","value":"linearrgb"},{"name":"color-rendering","value":"auto"},{"name":"fill","value":"rgb(0, 0, 0)"},{"name":"fill-opacity","value":"1"},{"name":"fill-rule","value":"nonzero"},{"name":"marker-end","value":"none"},{"name":"marker-mid","value":"none"},{"name":"marker-start","value":"none"},{"name":"mask-type","value":"luminance"},{"name":"shape-rendering","value":"auto"},{"name":"stroke","value":"none"},{"name":"stroke-dasharray","value":"none"},{"name":"stroke-dashoffset","value":"0"},{"name":"stroke-linecap","value":"butt"},{"name":"stroke-linejoin","value":"miter"},{"name":"stroke-miterlimit","value":"4"},{"name":"stroke-opacity","value":"1"},{"name":"stroke-width","value":"1"},{"name":"alignment-baseline","value":"auto"},{"name":"baseline-shift","value":"baseline"},{"name":"dominant-baseline","value":"auto"},{"name":"text-anchor","value":"start"},{"name":"writing-mode","value":"lr-tb"},{"name":"glyph-orientation-horizontal","value":"0deg"},{"name":"glyph-orientation-vertical","value":"auto"},{"name":"vector-effect","value":"none"},{"name":"paint-order","value":"fill stroke markers"}]
    }
  });
}

Blink.prototype.getInlineStylesForNode = function(m){
  var node = this.scene.getElementById("white-king");

  var properties = Object.keys(node.style).map(function(name){
    return {
      "name" : name,
      "value" : node.style[name],
      "text" : name + ": " + node.style[name],
      "range": {
        "startLine": 0,
        "startColumn": 0,
        "endLine": 0,
        "endColumn": 11
      },
      "implicit" : false,
      "disabled" : false
    }
  });

  this.send({
    id : m.id,
    result : {
      inlineStyle : {
        cssProperties : properties,
        shorthandEntries: [],
        cssText: node.style.valueOf()
      }
    }
  });

  /*
  {
  "id": 42,
  "result": {
    "inlineStyle": {
      "cssProperties": [
        {
          "name": "clear",
          "value": "both",
          "text": "clear: both",
          "range": {
            "startLine": 0,
            "startColumn": 0,
            "endLine": 0,
            "endColumn": 11
          },
          "implicit": false,
          "disabled": false
        }
      ],
      "shorthandEntries": [],
      "styleSheetId": "10",
      "range": {
        "startLine": 0,
        "startColumn": 0,
        "endLine": 0,
        "endColumn": 11
      },
      "cssText": "clear: both"
    }
  }

  this.send({
    id : m.id,
    result : {
      "inlineStyle":{"cssProperties":[],"shorthandEntries":[],"styleSheetId":"51","range":{"startLine":0,"startColumn":0,"endLine":0,"endColumn":0},"cssText":""}
    }
  });
  */
}

Blink.prototype.addInspectedNode = function(m){
  console.log("inspect node...");
  console.log(JSON.stringify(m));
}

var i = 0;
function remap(uuid){
  return i++;
}

Blink.prototype.getDocument = function(m){
  var children = this.scene.childNodes.filter(function(node){
    return node.nodeType == 1;
  });

  var getAttributes = function(node){
    var attributes = node.attributes.filter(function(a){
      return a.name != "uuid"
    });

    if(attributes.length==0){
      return [];
    }else{
      return attributes.map(function(a){ 
        return [a.name, a.value] 
      }).reduce(function(a, b) {
        return a.concat(b);
      });    
    }
  }

  this.send({
    id : m.id,
    result : {
    "root": {
      "nodeId": 1,
      "nodeType": 9,
      "nodeName": "#document",
      "localName": "",
      "nodeValue": "",
      "documentURL": "http://fixme...",
      "baseURL": "http://fixme...",
      "xmlVersion": "",
      "childNodeCount": 2,
      "children": [
          {
            "nodeId": 2,
            "nodeType": 10,
            "nodeName": "scene",
            "localName": "",
            "nodeValue": "",
            "publicId": "",
            "systemId": ""
          },
          {
            "nodeId": remap(this.scene.uuid),
            "nodeType": 1,
            "nodeName": "SCENE",
            "localName": "scene",
            "nodeValue": "",
            "attributes" : [],
            "childNodeCount": children.length,
            "children" : children.map(function(node){
              return {
                "nodeId": remap(node.uuid),
                "nodeType": node.nodeType,
                "nodeName": node.nodeName,
                "nodeValue": node.nodeValue,
                "localName": node.localName,
                "attributes": getAttributes(node),
                "childNodeCount": 0
              };
            })
          }
        ]
      }
    }
  });
}

module.exports = Blink;
