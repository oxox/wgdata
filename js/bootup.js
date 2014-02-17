(function($,R,D){

var cbk = function($s){
    var prefix = "http://oxox.io/wgdata/js/",
            t = new Date().getTime();
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

if( typeof(R) =='function' && typeof(D)=='function' && D.amd ){
    //requirejs style
    R(['http://oxox.io/assets/js/libs/script.js'],function($s){
        cbk($s);
    });
}else{
    $.getScript('http://oxox.io/assets/js/libs/script.js')
        .done(function(js,txtStatus,jqxhr){
            cbk(window["$script"]);
        })
        .fail(function(jqxhr,cfg,err){
            console.log('Error happening at loading script.js:'+err);
        });
};

})(jQuery,window["require"],window["define"]);
