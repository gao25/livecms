// 获取参数
var page = + lvsCmd['urlParams']['page'],
  action = lvsCmd['urlParams']['action'],
  callback = lvsCmd['urlParams']['callback'];
if (isNaN(page) || page < 1) page = 1;
var beginDate = '',
  endDate = '',
  mstate = 0,
  key = '',
  keyType = 0;

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "type": "ajax",
  "method": "post",
  "action": "xxx",
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
newSearchform.render(searchConfig, null, function (formInfo) {
  

  
  page = 1;
  beginDate = $('#j-searchform input[name=beginDate]').val(),
  endDate = $('#j-searchform input[name=beginDate]').val(),
  mstate = $('#j-searchform select[name=state]').val(),
  key = $.trim($('#j-searchform input[name=key]').val()),
  keyType = $('#j-searchform select[name=reportType]').val();
  if (beginDate) beginDate = new Date(beginDate).getTime();
  if (endDate) endDate = new Date(endDate).getTime();
  loadList(); 
});

// juicer函数
juicer.register('formatDate', lvsCmd['formatDate']);
juicer.register('formatState', function(state){
  var stateStr = '';
  if (state == 1) {
    stateStr = '未启用';
  } else if (state == 2) {
    stateStr = '启用';
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
var url = '/live-web-cms/media/getList.json',
  searchUrl = '/live-web-cms/media/search.json',
  data = {page: page};
if (beginDate) {
  data['beginDate'] = beginDate;
  url = searchUrl;
}
if (endDate) {
  data['endDate'] = endDate;
  url = searchUrl;
}
if (mstate > 0) {
  data['state'] = mstate;
  url = searchUrl;
}
if (key) {
  data['key'] = key;
  url = searchUrl;
}
if (keyType > 0) {
  data['keyType'] = keyType;
  url = searchUrl;
}
lvsCmd.ajax(url, data, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      res['action'] = action;
      var listHtml = listTpl.render(res);
      $('#j-list').html(listHtml);
      // 绑定操作
      bindList();
      // 分页
      lvsCmd.page('j-page', res['totalcount'], res['currentpage'], 10);
      $('#j-page a').click(function(){
        page = $(this).data('page');
        loadList();
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});
function bindList(){
  if (action == 'select') {
    $(".select-btn").click(function(){
      var mediaurl = $(this).data('mediaurl');
      parent.window.frames['mainframe'][callback](mediaurl);
      parent.window.mainOverlay.hide();
    });
  }
}



