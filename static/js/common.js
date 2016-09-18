var lvsCmd = {};
// url参数
lvsCmd['urlParams'] = (function(){
  var data = {},
    params = document.URL.split('?')[1];
  if (params) {
    $.each(params.split('&'), function(){
      var thisData = this.split('=');
      data[thisData[0]] = thisData[1];
    });
  }
  return data;
})();
// cookie操作
lvsCmd['cookie'] = {
  get: function (cname) {
    var arr,
      reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  set: function (cname, value, extime) {
    // extime 单位: s 秒、m 分钟、h 小时、d 天，无单位默认秒
    var extimeExt = extime.substr(-1),
      extimeInt = parseInt(extime),
      extimeSec = {
        "s": 1000,
        "m": 60 * 1000,
        "h": 3600 * 1000,
        "d": 24 * 3600 * 1000
      };
    if (!extimeSec[extimeExt]) extimeExt = 's';
    var sec = extimeInt * extimeSec[extimeExt],
      exp = new Date();
    exp.setTime(exp.getTime() + sec);
    document.cookie = cname + "="+ escape(value) + ";expires=" + exp.toGMTString();
  },
  del: function (cname) {
    lvsCmd['cookie'].set(cname, 'null', '-1');
  }
};
// 接口随机数管理 random
lvsCmd['random'] = {
  get: function(){
    var random = lvsCmd['cookie'].get('random');
    if (random) {
      var randomArray = random.split(','),
        useRandom = randomArray.pop();
      if (randomArray.length) {
        lvsCmd['cookie'].set('random', randomArray.join(','));

        
      }

      
    }
  },
  refresh: function(){

  }
};
// ajax请求，所有请求都需要 head: random, token, sign
lvsCmd['ajax'] = function (url, data, callback) {
  $.ajax({
    type: "post",
    dataType: "json",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(data),
    success: function(res){
      callback(true, res);
    },
    error: function(err){
      callback(false, err);
    }
  });
};
/* 分页 */
lvsCmd['page'] = function (obj, count, page, pageSize) {
  if (typeof(obj) != 'object') {
    obj = $('#' + obj);
  }
  var html = '',
    countPage = Math.ceil(count / pageSize);
  html += '<span>共'+count+'条/'+countPage+'页记录</span>';
  if (page > 1) {
    html += '<a href="javascript:void(0)" data-page="1">首页</a>';
    html += '<a href="javascript:void(0)" data-page="'+(page-1)+'">上一页</a>';
  }
  if (page > 4) {
    var toPage = page + 4;
    if (toPage > countPage) toPage = countPage;
    var fromPage = toPage - 7;
    if (fromPage < 1) fromPage = 1;
  } else {
    var fromPage = 1,
      toPage = 8;
    if (toPage > countPage) toPage = countPage;
  }
  for (var i=fromPage; i<=toPage; i++) {
    html += '<a href="javascript:void(0)" data-page="'+i+'"';
    if (i == page) html += ' class="current"';
    html += '>'+i+'</a>';
  }
  if (page < countPage) {
    html += '<a href="javascript:void(0)" data-page="'+(page+1)+'">下一页</a>';
    html += '<a href="javascript:void(0)" data-page="'+countPage+'">尾页</a>';
  }
  obj.html(html);
};

// 返回
$('.lvs-crumb .back').click(function(){
  history.back();
  return false;
});



