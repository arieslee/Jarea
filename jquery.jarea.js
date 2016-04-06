/**
 * Jarea for jQuery
 *
 * Copyright (c) 2010 Aries lee
 * Author: Aries
 * E-mail: helloaries@gmail.com
 * Blog: http://blog.iw3c.com
 *
 * Version: 1.0.0
 *
 * <div id="Jarea"></div>
 * <script type="text/javascript">$.Jarea();</script>
 */
(function($) {
    var $Jarea_Province ,$Jarea_City ,$Jarea_County,$Jarea_datas = null;
    $.Jarea = function(settings){
        $.Jarea.init(settings);
    }
    jQuery.extend($.Jarea, {
        settings : {
            selector : '#Jarea',
            dataSource : 'jarea.xml',
            class : 'jarea-class',
            country : '中国',
            countryName : 'country',
            countryId : 'country',
            province:false,
            city:false,
            county : false,
            provinceName : 'province',
            provinceId : 'province',
            cityName : 'city',
            cityId : 'city',
            countyName : 'county',
            countyId : 'county',
            selected:{
                province:'<option value="" selected="selected">----选择省份----</option>',
                city:'<option value="" selected="selected">----选择城市----</option>',
                county:'<option value="" selected="selected">----选择地区----</option>'
            }
        },
        init : function(settings){
            $.Jarea.settings = $.extend({},$.Jarea.settings,settings);
            var output='<input type="hidden" value="'+$.Jarea.settings.country+'" name="'+$.Jarea.settings.countryName+'" id="'+$.Jarea.settings.countryId+'" />';
            output+='<select name="'+$.Jarea.settings.provinceName+'" id="'+$.Jarea.settings.provinceId+'" class="'+$.Jarea.settings.class+'">'+$.Jarea.settings.selected.province+'</select>&nbsp;&nbsp;&nbsp;';
            output+='<select name="'+$.Jarea.settings.cityName+'" id="'+$.Jarea.settings.cityId+'" class="'+$.Jarea.settings.class+'">'+$.Jarea.settings.selected.city+'</select>&nbsp;&nbsp;&nbsp;';
            output+='<select name="'+$.Jarea.settings.countyName+'" id="'+$.Jarea.settings.countyId+'" class="'+$.Jarea.settings.class+'">'+$.Jarea.settings.selected.county+'</select>';
            $($.Jarea.settings.selector).html(output);
            var p=$('#'+$.Jarea.settings.provinceId);
            $.get($.Jarea.settings.dataSource ,function(xml){
                $Jarea_datas = xml;
                p.append($.Jarea.get_province());
                if($.Jarea.settings.province !== false && $.Jarea.settings.city !== false){
                    var c=$('#'+$.Jarea.settings.cityId);
                    c.append($.Jarea.get_city($.Jarea.settings.province));
                    if($.Jarea.settings.county !== false){
                        var cou=$('#'+$.Jarea.settings.countyId);
                        cou.append($.Jarea.get_county($.Jarea.settings.province ,$.Jarea.settings.city));
                    }
                }
                $.Jarea.bind_change();
            });
        },
        get_province:function(){
            var output='';
            $Jarea_Province = $($Jarea_datas).find('province');
            var name;
            $Jarea_Province.each(function(i,dom){
                name = $(dom).attr('name');
                if (name == $.Jarea.settings.province){
                    output+='<option value='+name+' selected="selected">' + name + '</option>';
                }else{
                    output+='<option value='+name+'>' + name + '</option>';
                }
            });
            return output;
        },
        get_city:function(province){
            var output='';
            var pro ,name;
            $Jarea_Province.each(function(i ,dom){
                pro = $(dom).attr('name');
                if (pro === province) {
                    $Jarea_City = $(dom).find('city');
                    $Jarea_City.each(function(c, dom) {
                        name = $(dom).attr('name');
                        if (name === $.Jarea.settings.city){
                            output+='<option value="'+name+'" selected="selected">' + name + '</option>';
                        }else{
                            output+='<option value="'+name+'">' + name + '</option>';
                        };
                    });

                };
            });
            return output;
        },
        get_county:function(province ,city){
            var output='';
            var pro ,cit ,name;
            $Jarea_Province.each(function(i, dom) {
                pro = $(dom).attr('name');
                if(pro === province){
                    $Jarea_City = $(dom).find('city');
                    $Jarea_City.each(function(c, dom) {
                        cit = $(dom).attr('name');
                        if (cit === city){
                            $Jarea_County = $(dom).find('county');
                            $Jarea_County.each(function(j, dom) {
                                name = $(dom).attr('name');
                                if (name === $.Jarea.settings.county){
                                    output+='<option value="'+name+'" selected="selected">' + name + '</option>';
                                }else{
                                    output+='<option value="'+name+'">' + name + '</option>';
                                };
                            });
                        }
                    });
                }
            });
            return output;
        },
        bind_change:function(){
            var pro,cit,cou,proVal = '',citVal = '';
            pro = $('#'+$.Jarea.settings.provinceId);
            cit = $('#'+$.Jarea.settings.cityId);
            pro.change(function(){
                proVal = $(this).val();
                cit.html($.Jarea.settings.dscity);
                cit.append($.Jarea.get_city(proVal));
            });
            cit.change(function(){
                if(proVal === '') return false;
                citVal = $(this).val();
                cou = $('#'+$.Jarea.settings.countyId);
                cou.html($.Jarea.settings.dscounty);
                cou.append($.Jarea.get_county(proVal,citVal));
            });
        }
    });
})(jQuery);