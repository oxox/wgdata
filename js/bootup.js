/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */
(function(e,t,n){typeof module!="undefined"&&module.exports?module.exports=n():typeof define=="function"&&define.amd?define(n):t[e]=n()})("$script",this,function(){function p(e,t){for(var n=0,r=e.length;n<r;++n)if(!t(e[n]))return i;return 1}function d(e,t){p(e,function(e){return!t(e)})}function v(e,t,r){function y(e){return e.call?e():f[e]}function b(){if(!--g){f[u]=1,o&&o();for(var e in c)p(e.split("|"),y)&&!d(c[e],y)&&(c[e]=[])}}e=e[s]?e:[e];var i=t&&t.call,o=i?t:r,u=i?e.join(""):t,g=e.length;return setTimeout(function(){d(e,function(e){if(e===null)return b();if(h[e])return u&&(l[u]=1),h[e]==2&&b();h[e]=1,u&&(l[u]=1),m(!n.test(e)&&a?a+e+".js":e,b)})},0),v}function m(n,r){var s=e.createElement("script"),a=i;s.onload=s.onerror=s[u]=function(){if(s[o]&&!/^c|loade/.test(s[o])||a)return;s.onload=s[u]=null,a=1,h[n]=2,r()},s.async=1,s.src=n,t.insertBefore(s,t.firstChild)}var e=document,t=e.getElementsByTagName("head")[0],n=/^https?:\/\//,r="string",i=!1,s="push",o="readyState",u="onreadystatechange",a,f={},l={},c={},h={};return v.get=m,v.order=function(e,t,n){(function r(i){i=e.shift(),e.length?v(i,r):v(i,t,n)})()},v.path=function(e){a=e},v.ready=function(e,t,n){e=e[s]?e:[e];var r=[];return!d(e,function(e){f[e]||r[s](e)})&&p(e,function(e){return f[e]})?t():!function(e){c[e]=c[e]||[],c[e][s](t),n&&n(r)}(e.join("|")),v},v.done=function(e){v([null],e)},v})

;(function($,R,D,$s){


var t = new Date().getTime();

var loadJQ = function(cbk){
    if( typeof($)==='undefined' ){
        $s('http://static.paipaiimg.com/js/jquery.1.8.js?t='+t,function(){
            cbk(window['jQuery']);
        });
    }else{
        cbk($);
    };
};

var cbk = function(){
    var prefix = "http://rawgithub.com/oxox/wgdata/master/js/";
    $s([prefix+"base.js?t="+t,
        "http://oxox.io/jq/oxmenu/jquery.oxtree.js?t="+t,
        "http://oxox.io/jq/oxi18n/jquery.oxi18n.js?t="+t,
        prefix+"score.js?t="+t
    ],"base");
    $s.ready('base',function(){
        $s([
            prefix+"i18n.js?t="+t,
            prefix+"data.js?t="+t,
            prefix+"coreui.js?t="+t,
            prefix+"modchart.js?t="+t,
            prefix+"pagechart.js?t="+t,
            prefix+"modeditor.js?t="+t,
            prefix+"ytag.js?t="+t,
            prefix+"modrank.js?t="+t
        ],"biz");
        $s.ready('biz',function(){
            i18n.addLng('zh-CN',yx_xdata_i18n['zh-CN']);
            J.init();
        });
    });
};

loadJQ(cbk);

})(jQuery,window["require"],window["define"],window["$script"]);
