document.domain = 'live.com'; // 主域名
var executeServer = 'http://api.live.com'; // 用户接口服务器域名，如 http://api.live.com
var usercenterServer = 'http://xinhua-usercenter.oss-cn-hangzhou.aliyuncs.com', // 头像文件服务器
  zbcbServer = 'http://xinhua-zbcb.oss-cn-hangzhou.aliyuncs.com'; // 项目图片服务器

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
      reg = new RegExp("(^| )"+cname+"=([^;]*)(;|$)");
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
    document.cookie = cname + "="+ value + ";path=/;expires=" + exp.toGMTString();
  },
  del: function (cname) {
    lvsCmd['cookie'].set(cname, 'null', '-1');
  }
};
// randomCallback
var randomCallback = function (state, res) {
  if (state) {
    if (res['status'] == 0) {
      var randomStr = res['data']['randomArray'].join(',');
      lvsCmd['cookie'].set('random', randomStr, '18m'); // 实际过期时间是20分钟
      lvsCmd['cookie'].set('randomExpires', (new Date().getTime() + 18 * 60 * 1000), '18m');
      lvsCmd['random']['state'] = 'open';
    } else {
      alert(res['errMsg']);
      lvsCmd['random']['state'] = 'close';
    }
  } else {
    alert('接口请求失败，请检查网络连接！');
    lvsCmd['random']['state'] = 'close'
  }
};
// 接口随机数管理 random
lvsCmd['random'] = {
  state: 'open',
  get: function(){
    if (lvsCmd['random']['state'] == 'close') {
      lvsCmd['random'].refresh();
      return null;
    } else if (lvsCmd['random']['state'] == 'wait') {
      return null;
    }
    var random = lvsCmd['cookie'].get('random');
    if (random) {
      var randomArray = random.split(','),
        useRandom = randomArray.pop();
      if (randomArray.length) {
        var randomExpires = lvsCmd['cookie'].get('randomExpires');
        if (randomExpires) {
          var exp = new Date( + randomExpires );
        } else {
          var exp = new Date();
        }
        document.cookie = "random="+ randomArray.join(',') + ";path=/;expires=" + exp.toGMTString();
      } else {
        lvsCmd['cookie'].del('random');
        lvsCmd['random']['state'] = 'close';
      }
      return useRandom;
    } else {
      lvsCmd['random'].refresh();
      return null;
    }
  },
  refresh: function(){
    if ($('#j-executeframe').length == 0) {
      $('body').append('<div class="fn-hide"><iframe id="j-executeframe" src="about:blank"></iframe></div>');
    }
    lvsCmd['random']['state'] = 'wait';
    $('#j-executeframe').attr('src', executeServer + '/execute/?action=/random/execute.json&callback=randomCallback');
  }
};
// 刷新用户cookie
lvsCmd['tokenRefresh'] = function(){
  var list = ['orgId', 'orgName', 'role', 'token', 'userId'];
  $.each(list, function(){
    var val = lvsCmd['cookie'].get(this);
    lvsCmd['cookie'].set(this, val, (7*24-1) + 'h'); // 实际过期时间是7天
  });
};
// ajax请求，所有请求都需要 head: random, token, sign
lvsCmd['ajax'] = function (url, data, callback) {
  var token = lvsCmd['cookie'].get('token');
  if (!token) {
    alert('尚未登录或登录过期，请重新登录！');
    parent.location.href = 'login.html';
    return false;
  }
  function roundFn(){
    var random = lvsCmd['random'].get();
    if (random) {
      var dataStr = JSON.stringify(data);
      if (dataStr == '{}') dataStr = '';
      $.ajax({
        type: "post",
        dataType: "json",
        contentType: "application/json",
        url: url,
        data: dataStr,
        beforeSend: function (req) {
          req.setRequestHeader("Content-Type", 'application/json');
          req.setRequestHeader("random", random);
          req.setRequestHeader("token", token);
          req.setRequestHeader("sign", hex_sha512(dataStr));
        },
        success: function(res){
          lvsCmd.tokenRefresh();
          callback(true, res);
        },
        error: function(err){
          callback(false, err);
        }
      });
    } else {
      setTimeout(roundFn, 100);
    }
  }
  roundFn();
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

// 上传组件
lvsCmd['upfile'] = function(obj){
  this.obj = obj;
  this.init();
};
lvsCmd['upfile'].prototype = {
  init: function(){
    this.fileBtn = $('<p class="file"><span class="add">+</span></p>');
    var _this = this,
      callback = 'upfileCallback' + new Date().getTime();
    window[callback] = function(fileurl){
      _this.addfile(fileurl);
    }
    // 上传
    this.fileBtn.click(function(){
      var filetype = _this.obj.data('filetype'),
        iframe = _this.obj.data('iframe'),
        upfileUrl = '/overlay/upfile.html?filetype='+filetype+'&callback='+callback;
      if (filetype == 1 || filetype == 2 || filetype == 5) {
        upfileUrl = '/overlay/uploader.html?filetype='+filetype+'&callback='+callback;
      }
      if (iframe) upfileUrl += '&iframe=' + iframe;
      parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">title<em class="j-overlay-close">close</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" name="uploaderFrame" src="'+upfileUrl+'"></iframe></div>');
      return false;
    });
    this.obj.append(this.fileBtn);
  },
  addfile: function (fileurl) {
    var _this = this,
      filetype = this.obj.data('filetype'),
      newFileObj = $('<p class="file" data-fileurl="'+fileurl+'"><span></span><em>-</em></p>');
    /* filetype:
      USER_PORTRAIT(1,"xinhua-usercenter","portrait","用户头像"),
      REPORT_PIC(2,"xinhua-zbcb","report-img","报道图片"),
      REPORT_AUDIO(3,"xinhua-zbcb","report-audio","报道音频"),
      REPORT_VIDEO(4,"xinhua-zbcb","report-video","报道视频"),
      LIVE_COVER(5,"xinhua-zbcb","live-img","现场封面"),
      LIVE_VIDEO(6,"xinhua-zbcb","live-video","现场回看视频");
    */
    if (fileurl.substr(0,1) != '/') fileurl = '/' + fileurl;
    if (filetype == 1) {
      newFileObj.find('span').append('<img src="' + usercenterServer + fileurl + '">');
      this.fileBtn.hide();
    } else if (filetype == 2) {
      newFileObj.find('span').append('<img src="' + zbcbServer + fileurl + '">');
      if (this.obj.find('.file').length >= 4) {
        this.fileBtn.hide();
      }
    } else if (filetype == 3) {
      newFileObj.find('span').append('<img src="xxxx.jpg">');
      this.fileBtn.hide();
    } else if (filetype == 4 || filetype == 6) {
      newFileObj.find('span').append('<img src="xxxx.jpg">');
      this.fileBtn.hide();
    } else if (filetype == 5) {
      newFileObj.find('span').append('<img src="' + zbcbServer + fileurl + '">');
      this.fileBtn.hide();
    }
    newFileObj.find('em').click(function(){
      newFileObj.remove();
      _this.fileBtn.show();
    });
    this.fileBtn.before(newFileObj);
  }
};

// 日期格式化
lvsCmd['formatDate'] = function(date, typeStr) {
  if (date) {
    var thisDate = new Date(date);
  } else {
    var thisDate = new Date();
  }
  var YY = thisDate.getFullYear(),
    Y = YY.toString().substr(2, 2),
    M = 1 + thisDate.getMonth(),
    MM = M > 9 ? M : '0' + M,
    D = thisDate.getDate(),
    DD = D > 9 ? D : '0' + D,
    h = thisDate.getHours(),
    hh = h > 9 ? h : '0' + h,
    m = thisDate.getMinutes(),
    mm = m > 9 ? m : '0' + m,
    s = thisDate.getSeconds(),
    ss = s > 9 ? s : '0' + s;
  var formatStr = typeStr
    .replace(/YY/g, YY)
    .replace(/Y/g, Y)
    .replace(/MM/g, MM)
    .replace(/M/g, M)
    .replace(/DD/g, DD)
    .replace(/D/g, D)
    .replace(/hh/g, hh)
    .replace(/h/g, h)
    .replace(/mm/g, mm)
    .replace(/m/g, m)
    .replace(/ss/g, ss)
    .replace(/s/g, s);
  return formatStr;
};

// 返回
$('.lvs-crumb .back').click(function(){
  location.href = document.referrer;
  return false;
});



