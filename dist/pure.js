!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("regularjs")):"function"==typeof define&&define.amd?define(["regularjs"],e):"object"==typeof exports?exports.Pure=e(require("regularjs")):t.Pure=e(t.Regular)}(this,function(t){return function(t){function e(o){if(n[o])return n[o].exports;var a=n[o]={exports:{},id:o,loaded:!1};return t[o].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={};return e.m=t,e.c=n,e.p="dist/",e(0)}([function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{"default":t}}n(2),n(6);var a=n(12),i=o(a);t.exports=i["default"]},,function(t,e){},,,,function(t,e,n){"use strict";n(7)},function(t,e,n){var o,a;n(8),o=n(9),a=n(11);var i=n(10),s=o||{};s.__esModule&&(s=s["default"]),i.__esModule&&(i=i["default"]);var r,u;if("object"==typeof s){if(s.template=a,r=i.extend(s),u=s.components||s.component,"object"==typeof u)for(var d in u)r.component(d,u[d])}else"function"==typeof s&&s.prototype instanceof i&&(s.prototype.template=a,r=s);t.exports=r},function(t,e){},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(10),i=o(a),s=function(t){var e=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame;return e&&!/iP(ad|hone|od).*OS 6/.test(t.navigator.userAgent)||!function(){var t=0;e=function(e){var n=Date.now(),o=Math.max(16-(n-t),0);setTimeout(function(){e(t=n+o)},o)}}(),e}(window||{});e["default"]={name:"Button",config:function(){this.data.ripple=this.data.ripple!==!1},init:function(t){var e=this,n=function(){e.data.pressed!==!1&&(e.data.pressed=!1,e.$update())};i["default"].dom.on(this.$refs.w,"webkitAnimationEnd",n)},onMouseDown:function(){},onMouseUp:function(t){var e=this;if(!this.data.disabled&&(this.$emit("click"),this.data.ripple)){var n=this.$refs.b,o=t.pageX,a=t.pageY,i=window.scrollY,r=n.getBoundingClientRect(),u=r.top,d=r.left,p=r.width,c=o-d,f=a-u-i;this.data.waveTop=f-p/2,this.data.waveLeft=c-p/2,this.data.waveWidth=p,this.data.waveHeight=p,this.data.pressed=!1,this.$update(),s(function(){e.data.pressed=!0,e.$update()})}}}},function(e,n){e.exports=t},function(t,e){t.exports=[{type:"element",tag:"button",attrs:[{type:"attribute",name:"ref",value:"b"},{type:"attribute",name:"class",value:{type:"expression",body:"['r-button ',c._sg_('primary', d, e)?'r-button-primary':'r-button-basic',' ',c._sg_('sm', d, e)?'r-button-sm':'',' ',c._sg_('disabled', d, e)?'r-button-disabled':''].join('')",constant:!1,setbody:!1}},{type:"attribute",name:"on-mousedown",value:{type:"expression",body:"c['onMouseDown'](c._sg_('$event', d, e))",constant:!1,setbody:!1}},{type:"attribute",name:"on-mouseup",value:{type:"expression",body:"c['onMouseUp'](c._sg_('$event', d, e))",constant:!1,setbody:!1}},{type:"attribute",name:"_r-28ef165c",value:""}],children:[{type:"text",text:" "},{type:"element",tag:"div",attrs:[{type:"attribute",name:"class",value:{type:"expression",body:"['r-button-wave ',c._sg_('pressed', d, e)?'pressed':'r-button-wave-hidden'].join('')",constant:!1,setbody:!1}},{type:"attribute",name:"style",value:{type:"expression",body:"['width: ',c._sg_('waveWidth', d, e),'px;height: ',c._sg_('waveHeight', d, e),'px;top: ',c._sg_('waveTop', d, e),'px;left: ',c._sg_('waveLeft', d, e),'px'].join('')",constant:!1,setbody:!1}},{type:"attribute",name:"ref",value:"w"},{type:"attribute",name:"_r-28ef165c",value:""}],children:[]},{type:"text",text:" "},{type:"element",tag:"div",attrs:[{type:"attribute",name:"class",value:"r-button-text"},{type:"attribute",name:"_r-28ef165c",value:""}],children:[{type:"text",text:" "},{type:"template",content:{type:"expression",body:"c._sg_('$body', c)",constant:!1,setbody:"c._ss_('$body',p_,c, '=', 0)"}},{type:"text",text:" "}]},{type:"text",text:" "}]}]},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(10),i=o(a),s=i["default"].extend({});s.note=function(t,e,n){var o=s.extend({template:'\n\t\t\t{#if showNote}\n\t\t\t<div\n\t\t\t\tclass="r-note-will-transition"\n\t\t\t\tr-animation="\n\t\t\t\t\ton: enter;\n\t\t\t\t\twait: 10;\n\t\t\t\t\tclass: r-note-in, 3;\n\t\t\t\t\twait: '+(n||2e3)+';\n\t\t\t\t\tclass: r-note-out, 3;\n\t\t\t\t\temit: remove;\n\t\t\t\t">\n\t\t\t\t<Note type="'+e+'">'+t+"</Note>\n\t\t\t</div>\n\t\t\t{/if}\n\t\t",config:function(){var t=this;this.data.showNote=!0,this.$on("remove",function(){t.data.showNote=!1,t.$update()})},init:function(){this.$emit("notein")}});(new o).$inject(document.body)},e["default"]=s}])});