// var host = window.location.host;

requirejs.config({
    baseUrl: 'scripts',
    paths: {
    	jquery: '3rd-party/code.jquery.com/jquery-2.2.0.min',
    	jqueryi18n: '3rd-party/code.jquery.com/jquery.i18n.properties.min',
    	underscore: '3rd-party/underscore-1.8.3/underscore',
    	backbone: '3rd-party/backbone-1.2.3/backbone',
    	text: '3rd-party/requireJS-2.1.22/plugins/text-2.0.14/text',
    	bootstrap: '3rd-party/bootstrap-3.3.6-dist/js/bootstrap.min'
    },
    shim: {
    	jquery: {
            exports: '$'
        },
        jqueryi18n: {
            deps: [ "jquery" ]
        },        
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        underscore: {
            exports: '_'
        }
    }
});

requirejs(['scripts/3rd-party/datepicker/bootstrap-datepicker.min.js'],function () {
    requirejs(['scripts/3rd-party/datepicker/bootstrap-datepicker.zh-CN.min.js'], function () {
        $.fn.datepicker.dates['zh-CN'].format = 'yyyy-mm-dd';
        $.fn.datepicker.dates['zh-CN'].weekStart = 0;
        $.fn.datepicker.defaults.todayHighlight = true;
        $.fn.datepicker.defaults.autoclose = true;
        $.fn.datepicker.defaults.language = 'zh-CN';
    });
});

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format = function(fmt)   
{  
  var o = {   
    "M+" : this.getMonth()+1,                 // 月份
    "d+" : this.getDate(),                    // 日
    "h+" : this.getHours(),                   // 小时
    "m+" : this.getMinutes(),                 // 分
    "s+" : this.getSeconds(),                 // 秒
    "q+" : Math.floor((this.getMonth()+3)/3), // 季度
    "S"  : this.getMilliseconds()             // 毫秒
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

/**
 * 格式化金额
 */
String.prototype.fmoney = function(s, n)
{
   n = n > 0 && n <= 20 ? n : 2;
   try {
	s = parseFloat((s + "").replace(/[^\d\.-]/g, ""));
   } catch (e) {}
   if (!s) {
	   return '0.00';
   }
   s = s.toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");   
   }
   return t.split("").reverse().join("") + "." + r;   
}

function alertOnCondition(condition, message) {
    if (condition) {
        alert(message);
    }
    return condition;
}

function alertWithAlternative(condition, messageForTrue, messageForFalse) {
    if(! alertOnCondition(condition, messageForTrue)){
        alertOnCondition(true, messageForFalse);
    }
}

function checkDateStrings(startString, endString, errorTemplate) {
    if (startString && endString) {
        var start = Date.parse(startString);
        var end = Date.parse(endString);
        if (start > end) {
            var startDate = new Date(start);
            var endDate = new Date(end);
            if (alertOnCondition(startDate.getFullYear() > endDate.getFullYear(), errorTemplate.replace(/\*/, '年')))
                return false;
            if (alertOnCondition(startDate.getMonth() > endDate.getMonth(), errorTemplate.replace(/\*/, '月')))
                return false;
            alertOnCondition(true, errorTemplate.replace(/\*/, '日'));
            return false;
        }
    }
    return true;
}

function hideColumn(col, flag) {
    if (col instanceof Array) {
        for (var i = 0; i < col.length; i++)
            hideColumn(col[i], flag);
        var nav = $('table').parent();
        var more = nav.find('#show-more');
        var style = "position: absolute;right: 0;top: inherit;margin-top: 15px";
        var showBtn = '<button id="show-more" class="btn btn-link" style="'+style+'" onclick=\'hideColumn('+JSON.stringify(col)+', false)\'>查看更多</button>';
        var hideBtn = '<button id="show-more" class="btn btn-link" style="'+style+'" onclick=\'hideColumn('+JSON.stringify(col)+', true)\'>隐藏更多</button>';
        if (more.length > 0) {
            more.remove();
            flag?nav.append(showBtn):
                nav.append(hideBtn);
        } else
            nav.append(showBtn);
        return;
    }
    var th = $('th:contains('+col+')');
    if (th.length>1) {
        for (var j=0; j<th.length; j++) {
            if ($(th[j]).html() === col) {
                th = $(th[i]);
                break;
            }
        }
    }
    var n = th.prevAll().length;
    var tds = $('td:nth-of-type('+n+')');
    if (flag === false) {
        th.css('display','table-cell');
        tds.css('display','table-cell');
    } else {
        th.css('display','none');
        tds.css('display','none');
    }
}

requirejs(['main']);
