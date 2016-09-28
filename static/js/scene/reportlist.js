// 获取参数
var urlParams = lvsCmd['urlParams'];
if (isNaN(urlParams['page']) || urlParams['page'] < 1) urlParams['page'] = 1;
var searchData = {},
  searchState = false,
  searchFields = ['beginDate', 'endDate', 'reportType', 'key', 'keyType'];

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "type": "ajax",
  "method": "post",
  "action": "",
  "fields": [{
    "class": "j-starttime",
    "title": "开始时间",
    "name": "beginDate",
    "type": "date",
    "placeholder": "开始时间",
    "config": {
      format: "Y.m.d",
      onShow: function(ct){
        this.setOptions({
          maxDate: $('.j-endtime input').val()?$('.j-endtime input').val():false
        })
      }
    }
  }, {
    "class": "j-endtime",
    "title": "结束时间",
    "name": "endDate",
    "type": "date",
    "placeholder": "结束时间",
    "config": {
      format: "Y.m.d",
      onShow: function(ct){
        this.setOptions({
          minDate: $('.j-starttime input').val()?$('.j-starttime input').val():false
        })
      }
    }
  }, {
    "title": "报道类型",
    "name": "reportType",
    "type": "select",
    "option": [
      {"text": "报道类型", "value": "0"},
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "title": "关键字",
    "name": "key",
    "type": "text",
    "maxlength": 100,
    "placeholder": "关键字"
  }, {
    "title": "关键字类型",
    "name": "keyType",
    "type": "select",
    "option": [
      {"text": "关键字类型", "value": "0"},
      {"text": "报道人", "value": "1"},
      {"text": "报道内容", "value": "2"},
      {"text": "报道ID", "value": "4"},
      {"text": "现场标题", "value": "8"}
    ]
  }],
  "button": [
    {
      "value": "搜索",
      "type": "submit"
    }
  ]
};
newSearchform.render(searchConfig, function(){
  $.each(searchFields, function(){
    if (urlParams[this]) {
      if (this == 'beginDate' || this == 'endDate') {
        searchData[this] = lvsCmd.formatDate( + urlParams[this], 'YY-MM-DD');
      } else {
        searchData[this] = urlParams[this];
      }
      searchState = true;
    }
  });
  newSearchform.setval(searchData);
}, function (formInfo) {
  var newUrlParams = {},
    searchFieldsStr = ','+searchFields.join(',')+',';
  $.each(urlParams, function (key, value) {
    if (searchFieldsStr.indexOf(','+key+',') == -1) {
      newUrlParams[key] = value;
    }
  });
  urlParams['page'] = 1;
  $.each(formInfo['data'], function (key, value) {
    if (value) {
      if (key == 'beginDate' || key == 'endDate') {
        newUrlParams[key] = new Date(value).getTime();
      } else if (key == 'reportType' || key == 'keyType') {
        if (value > 0) newUrlParams[key] = value;
      } else {
        newUrlParams[key] = value;
      }
    }
  });
  urlParams = newUrlParams;
  locationFn();
});
// 跳转
function locationFn(){
  var toUrl = '';
  $.each(urlParams, function (key, val) {
    if (toUrl == '') {
      toUrl += '?';
    } else {
      toUrl += '&';
    }
    toUrl += key + '=' + val;
  });
  location.href = toUrl;
}

// juicer函数
juicer.register('formatDate', lvsCmd['formatDate']);
juicer.register('formatState', function(state){
  var stateDict = {
    "1": "未审核",
    "2": "审核通过",
    "8": "审核失败"
  }
  return stateDict[state];
});

// 渲染列表
var reportlistTpl = juicer($('#j-reportlist script').html());
$('#j-reportlist script').remove();
if (searchState) {
  var url = '/live-web-cms/report/searchUnApproved.json';
} else {
  var url = '/live-web-cms/report/getUnApproved.json';
}
searchData['page'] = urlParams['page'];
if (searchData['endDate']) searchData['endDate'] = + searchData['endDate'] + 24 * 3600 * 1000;
lvsCmd.ajax(url, searchData, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      if (res['data'] && res['data'].length > 0) {
        var reportlistHtml = reportlistTpl.render(res);
        $('#j-reportlist').html(reportlistHtml);
        // 绑定操作
        bindReportList();
      }
      // 分页
      lvsCmd.page('j-page', res['totalcount'], res['currentpage'], res['pagecount']);
      $('#j-page a').click(function(){
        searchFromData['page'] = $(this).data('page');
        locationFn();
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});
function verifyCallback(){
  location.reload();
}
function closeCallback(){
  location.reload();
}
function bindReportList(){
  // 审核
  $('#j-reportlist .j-verify').click(function(){
    parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">title<em class="j-overlay-close">close</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" src="scene/reportverify.html?reportId='+$(this).data('id')+'&callback=verifyCallback"></iframe></div>');
    return false;
  });
  // 关闭
  $('#j-reportlist .j-close').click(function(){
    parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">title<em class="j-overlay-close">close</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" src="scene/reportclose.html?reportId='+$(this).data('id')+'&callback=closeCallback"></iframe></div>');
    return false;
  });
  // 列表
  $('#j-reportlist .more').hover(function(){
    $(this).find('img').attr('src','/static/img/green_menu.png');
    $(this).find('ul').show();
  },function(){
    $(this).find('img').attr('src','/static/img/menu.png');
    $(this).find('ul').hide();
  })
  $('#j-reportlist .more ul li a').hover(function(){
    $(this).css('color','#12bb9a');
  },function(){
    $(this).css('color','#808080');
  })
}


