J(function($,p,pub){
    pub.id="modrank";
    //自定义单元排行榜
    p.modRank = {
        $d:null,
        dataType:1,
        dataChangedAt:1,
        dataInited:false,
        todayDataCache:{},
        antiCover:false,
        tpl:J.heredoc(function(){/*
            <ul id="dataList{{id}}" class="data_list_con{{clListSub}}">
                {{#babies}}
                <li id="dataCTag{{id}}" data-pid="{{pid}}" class="data_list_item{{cl1}}" data-id="{{id}}" data-alias="{{alias}}" data-val="{{val}}" data-val0="{{val0}}">
                    {{#hasChildren}}
                        <i class="data_list_ico"></i>
                        <a id="dataLnkCTag{{id}}" data-id="{{id}}" data-alias="{{alias}}" href="javascript:;" data-ytag="{{ytagSelector}}" data-ytagattr="ctag" data-val="{{val}}" data-val0="{{val0}}" class="data_list_lk">
                            <span class="data_txt">{{alias}}</span>
                            <span class="data_val data_val1">{{val1}}</span>
                            <span class="data_val data_val2">{{percent}}%</span>
                        </a>
                        <p class="data_list_control">
                            <a href="javascript:;" class="data_btn_edit" rel="{{id}}" data-i18n="com.edit">编辑</a>
                        </p>
                        {{>children}}
                    {{/hasChildren}}
                    {{^hasChildren}}
                    <i class="data_list_ico"></i>
                    <a id="dataLnkCTag{{id}}" data-id="{{id}}" data-alias="{{alias}}" href="javascript:;" data-ytag="{{ytagSelector}}" data-ytagattr="ctag" data-val="{{val}}" data-val0="{{val0}}" class="data_list_lk">
                        <span class="data_txt">{{alias}}</span>
                        <span class="data_val data_val1">{{val1}}</span>
                        <span class="data_val data_val2">{{percent}}%</span>
                    </a>
                    <p class="data_list_control">
                        <a href="javascript:;" class="data_btn_edit" rel="{{id}}" data-i18n="com.edit">编辑</a>
                    </p>
                    {{/hasChildren}}
                </li>
                {{/babies}}
            </ul>
        */}),
        _init:function(){
            J.$win.bind(J.ui.EVT.DataTypeChangeForPage,function(e,t){
                p.modRank.dataType = parseInt(t);
                p.modRank.reload(true);
                //排序不一样，所以要重新渲染下树形菜单
            }).bind(J.data.EVT.CTagUpdated,function(e,opType,d){
                p.modRank.onCTagUpdated(opType,d);
            }).bind(J.data.EVT.PTagDataChange,function(e,err,d){
                //ptag数据发生改变，刷新模块树
                p.modRank.dataChangedAt=p.modRank.dataType;
                p.modRank.reload();

            }).bind(J.ui.EVT.UIScroll,function(e,sTop){
                //J.$win.trigger('oxmenuPositionNeedUpdating');
            }).bind(J.ui.EVT.UIReady,function(e){
                p.modRank.$d = $('#dataList1').bind('mouseleave',function(e){
                    p.modRank.antiCover=true;
                    J.ytag.hideCovers();
                    //console.log('modRank.mouseleave',new Date().getTime());
                }).bind('mouseenter',function(e){
                    p.modRank.antiCover=false;
                });

            }).bind(J.data.EVT.KeyDataChange,function(e,err,d){
                if(err){
                    p.modRank.$d.html('');
                }
            }).bind(J.ui.EVT.Open,function(e,t){
                /*每次打开时刷新一次数据*/
                J.data.ptag.requestData(J.pagechart.getDateRangeData());
            });
        },
        onCTagUpdated:function(opType,d){
            switch(opType){
                case -1:
                    //delete
                    $('#dataCTag'+d).remove();
                break;
                case 0:
                    //add
                    //var items = this.parseData([d]);
                    //this.render(items,true);
                    this.reload();
                break;
                case 1:
                    //update
                    //$('#dataCTag'+d.id).remove();
                    //var items = this.parseData([d]);
                    //this.render(items,true);
                    this.reload();
                break;
            };//switch
        },
        getData:function(cbk){

            var opts = {
                "dataType":this.dataType,
                "isToday":J.pagechart.isToday()
            };

            J.data.getAllCTags(opts,function(items){
                cbk(items);
            });
        },
        sort:function(items,asc){
            asc = asc || false;
            items.sort(function(a,b){
                return (asc?(a.val-b.val):(b.val-a.val));
            });
            var len = items.length;
            for(var i=0;i<len;i++){
                if(items[i].babies&&items[i].babies.length>0){
                    this.sort(items[i].babies,asc);
                };
            };
        },
        render:function(d,isPrepend){
            var emptyHtml = '<div id="dataList1Tip" class="data_alert data_alertB" data-i18n="tip.noDataAdvice">无数据</div>';
            $('#dataList1Tip').remove();
            if(!isPrepend){
                this.$d.find('.data_list_item').remove();
            }
            if(d===null){
                this.$d.empty().html(emptyHtml).oxi18n({},true);
                return;
            };

            //排序
            this.sort(d.babies,false);

            var html = J.toHtml(this.tpl,d,{children:this.tpl});

            this.$d.prepend(html);

            if (!isPrepend) {
                this.$d.oxi18n().oxtree({},true);
                J.$win.trigger(J.ui.EVT.ModRankRendered);
                //如果私有模块为空,提示用户模块维护接口人
                if(J.data.privateMods.length===0){
                    this.$d.append(emptyHtml).oxi18n({},true);
                }
            }else{
                $('#dataList1Tip').remove();
            };

        },
        reload:function(fromCache){
            if(fromCache){
                this.render(this.data);
                return;
            };
            this.getData(function(d){
                p.modRank.data = d;
                p.modRank.render(d);
                if(!p.modRank.dataInited){
                    $('#dataLoading2').remove();
                    p.modRank.dataInited=true;
                }
            });
        },
        getDataById:function(items,id){
            id+='';
            var item = null,
                tempItem = null,
                len = items.length;
            for(var i=0;i<len;i++){
                tempItem = items[i];
                if( id == (tempItem.id+'') ){
                    item = tempItem;
                    break;
                };
                if(tempItem.babies&&tempItem.babies.length>0){
                    item = this.getDataById(tempItem.babies,id);
                };
                if(item){
                    break;
                };
            };
            return item;
        }
    };

    pub.getData = function(){
        return p.modRank.data;
    };

    pub.getDataById = function(id){
        return p.modRank.getDataById(p.modRank.data.babies||[],id);
    };

    pub.getTodayDataById = function(id){
        return J.data.todayModRankDataCache[id]||{};
    };

    pub.antiCover = function(){
        return p.modRank.antiCover;
    };

});