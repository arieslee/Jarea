/*!
 * Jarea v1.0.1
 * 中国行政区划代码三级联动
 * http://iw3c.com/demo/Jarea
 * MIT License
 * by Aries
 */
(function($) {
    $.fn.Jarea = function(options){
        options = jQuery.extend({}, jQuery.fn.Jarea.defaults, options);
        var $datas = null,
            $province,
            $city,
            $county;
        return this.each(function(){
            var $that = $(this);
            var output = [
                '<select name="'+options.provinceName+'" id="'+options.provinceId+'" class="'+options.class+'">'+options.selected.province+'</select>'+options.join,
                '<select name="'+options.cityName+'" id="'+options.cityId+'" class="'+options.class+'">'+options.selected.city+'</select>'+options.join,
                '<select name="'+options.countyName+'" id="'+options.countyId+'" class="'+options.class+'">'+options.selected.county+'</select>'
            ].join('');
            $that.html(output);
            $.ajax({
                type: "GET",
                url: _format_data_source(),
                cache: options.cache,
                success: function(xml){
                    $datas = xml;
                    _init($that);
                }
            });
        });
        function _init($that){
            var p = $that.find('#'+options.provinceId);
            p.append(get_province());
            if(options.province !== false && options.city !== false){
                var c = $that.find('#'+options.cityId);
                c.html(get_city(options.province));
                if(options.county !== false){
                    var cou = $that.find('#'+options.countyId);
                    cou.html(get_county(options.province ,options.city));
                }
            }
            bind_change();
        }
        function _format_data_source(){
            var url = options.dataSource;
            if(options.cache){
                return url;
            }
            if(url.indexOf('?')!=-1){
                return url+'&_t='+Math.random();
            }else{
                return url+'?_t='+Math.random();
            }
        }
        function get_province(){
            var output = '' ,name;
            $province = $($datas).find('province');
            $province.each(function(i,dom){
                name = $(dom).attr('name');
                if (name == options.province){
                    output+='<option value='+name+' selected="selected">' + name + '</option>';
                }else{
                    output+='<option value='+name+'>' + name + '</option>';
                }
            });
            return output;
        }
        function get_city(province){
            var output='' ,pro ,name;
            $province.each(function(i ,dom){
                pro = $(dom).attr('name');
                if (pro === province) {
                    $city = $(dom).find('city');
                    $city.each(function(c, dom) {
                        name = $(dom).attr('name');
                        if (name === options.city){
                            output+='<option value="'+name+'" selected="selected">' + name + '</option>';
                        }else{
                            output+='<option value="'+name+'">' + name + '</option>';
                        };
                    });

                };
            });
            return output;
        }
        function get_county(province ,city){
            var output='',pro ,cit ,name;
            $province.each(function(i, dom) {
                pro = $(dom).attr('name');
                if(pro === province){
                    $city.each(function(c, dom) {
                        cit = $(dom).attr('name');
                        if (cit === city){
                            $county = $(dom).find('county');
                            $county.each(function(j, dom) {
                                name = $(dom).attr('name');
                                if (name === options.county){
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
        }
        function bind_change() {
            var proVal = '',citVal = '',
                pro = $('#'+options.provinceId),
                cit = $('#'+options.cityId),
                cou = $('#'+options.countyId);
            pro.change(function(){
                proVal = $(this).val();
                cit.html(options.selected.city+get_city(proVal));
                cou.html(options.selected.county);
            });
            cit.change(function(){
                if(proVal === '') return false;
                citVal = $(this).val();
                cou.html(options.selected.county+get_county(proVal,citVal));
            });
        }
    }
    jQuery.fn.Jarea.defaults = {
        dataSource : 'jarea.xml',
        class : 'jarea-class',
        province:false,
        city:false,
        county : false,
        provinceName : 'province',
        provinceId : 'province',
        cityName : 'city',
        cityId : 'city',
        countyName : 'county',
        countyId : 'county',
        join : '&nbsp;&nbsp;',
        cache:true,
        selected:{
            province:'<option value="" selected="selected">----选择省份----</option>',
            city:'<option value="" selected="selected">----选择城市----</option>',
            county:'<option value="" selected="selected">----选择地区----</option>'
        }
    };
})(jQuery);