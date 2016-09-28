// 获取参数
var urlParams = lvsCmd['urlParams'];
if (isNaN(urlParams['page']) || urlParams['page'] < 1) urlParams['page'] = 1;
var searchData = {},
  searchState = false,
  searchFields = ['beginDate', 'endDate', 'state', 'key', 'keyType'];

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
    "title": "转码状态",
    "name": "state",
    "type": "select",
    "option": [
      {"text": "转码状态", "value": "0"},
      {"text": "未启用", "value": "1"},
      {"text": "启用", "value": "2"},
      {"text": "N/A", "value": "4"}
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
      {"text": "创建人", "value": "1"},
      {"text": "标题", "value": "2"}
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
      } else if (key == 'state' || key == 'keyType') {
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
  var stateStr = '';
  if (state == 1) {
    stateStr = '未启用';
  } else if (state == 2) {
    stateStr = '启用';
  } else if (state == 4) {
    stateStr = 'N/A';
  }
  return stateStr;
});
juicer.register('formatSize', function(size){
  var sizeStr = size + 'KB';
  if (size > 1024 * 1024) {
    sizeStr = Math.ceil(size / (1024 * 1024) * 100) / 100 + 'GB';
  } else if (size > 1024) {
    sizeStr = Math.ceil(size / 1024 * 100) / 100 + 'MB';
  }
  return sizeStr;
});

// 渲染列表
var listTpl = juicer($('#j-list script').html());
$('#j-list script').remove();
if (searchState) {
  var url = '/live-web-cms/media/search.json';
} else {
  var url = '/live-web-cms/media/getList.json';
}
searchData['page'] = urlParams['page'];
if (searchData['endDate']) searchData['endDate'] = + searchData['endDate'] + 24 * 3600 * 1000;
lvsCmd.ajax(url, searchData, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      res['action'] = urlParams['action'];
      if (res['data'] && res['data'].length > 0) {
        var listHtml = listTpl.render(res);
        $('#j-list').html(listHtml);
        // 绑定操作
        bindList();
      }
      // 分页
      lvsCmd.page('j-page', res['totalcount'], res['currentpage'], res['pagecount']);
      $('#j-page a').click(function(){
        page = $(this).data('page');
        urlParams['page'] = page;
        locationFn();
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});
function bindList(){
  if (urlParams['action'] == 'select') {
    $(".select-btn").click(function(){
      var mediaurl = $(this).data('mediaurl');
      parent.window.frames['mainframe'][callback](mediaurl);
      parent.window.mainOverlay.hide();
    });
  }
}
