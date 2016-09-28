// 获取参数
var urlParams = lvsCmd['urlParams'];
if (isNaN(urlParams['page']) || urlParams['page'] < 1) urlParams['page'] = 1;
var searchData = {},
  searchState = false,
  searchFields = ['beginDate', 'endDate', 'key', 'keyType'];

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
      {"text": "评论用户", "value": "1"},
      {"text": "评论内容", "value": "2"},
      {"text": "报道ID", "value": "4"},
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
      } else if (key == 'keyType') {
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
    "4": "审核失败",
    "8": "未开始直播",
    "16": "正在直播",
    "32": "直播结束",
    "64": "删除"
  }
  return stateDict[state];
});

//渲染列表
var listTpl = juicer($('#j-list script').html());
$('#j-list script').remove();
if (searchState) {
  var url = '/live-web-cms/comment/search.json';
} else{
  var url = '/live-web-cms/comment/getUnApproved.json';
}
searchData['page'] = urlParams['page'];
if (searchData['endDate']) searchData['endDate'] = + searchData['endDate'] + 24 * 3600 * 1000;
lvsCmd.ajax(url, searchData, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      if (res['data'] && res['data'].length > 0) {
        var listHtml = listTpl.render(res);
        $('#j-list').html(listHtml);
        // 绑定操作
        bindList();
      }
      // 分页
      lvsCmd.page('j-page', res['totalcount'], res['currentpage'], 10);
      $('#j-page a').click(function(){
        searchFromData['page'] = $(this).data('page');
        locationFn();
      });
    } else {
      if (res['errCode'] == 'get_comment_empty') {
        // nothing
      } else {
        alert(res['errMsg']);
      }
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});


function verifyCallback(){
  location.reload();
}
function bindList(){
  // 选中操作
  var select_num=0;
  $('.lselect-btn').click(function(){
    if(select_num==0){
      $('.lselect-btn').addClass('lselected');
      $('.select-btn').addClass('lselected');
      select_num=1;
    }else{
      $('.lselect-btn').removeClass('lselected');
      $('.select-btn').removeClass('lselected');
      select_num=0;
    }
  })
  $(".select-btn").on("click",function(){
    $('.lselect-btn').removeClass('lselected');
    select_num=0;
    if(!$(this).hasClass("lselected")){
      $(this).addClass('lselected');
    }else{
      $(this).removeClass('lselected');
    }
  })
  // 审核
  $('#j-list .j-verify').click(function(){
    lvsCmd.ajax('/live-web-cms/comment/approve.json', {'ids': $(this).data('id')}, function (state, res) {
      location.reload();
    });
    return false;
  });
  $('#j-verify').click(function(){
    var ids = '';
    $('#j-list .lselected').each(function(){
      var id = $(this).data('id');
      if (ids) ids += ',';
      ids += id;
    });
    lvsCmd.ajax('/live-web-cms/comment/approve.json', {'ids': ids}, function (state, res) {
      location.reload();
    });
    return false;
  });
  // 删除
  $('#j-list .j-delete').click(function(){
    lvsCmd.ajax('/live-web-cms/comment/del.json', {'commentIds': $(this).data('id')}, function (state, res) {
      location.reload();
    });
    return false;
  });
  $('#j-delete').click(function(){
    var commentIds = '';
    $('#j-list .lselected').each(function(){
      var id = $(this).data('id');
      if (commentIds) commentIds += ',';
      commentIds += id;
    });
    lvsCmd.ajax('/live-web-cms/comment/approve.json', {'commentIds': commentIds}, function (state, res) {
      location.reload();
    });
    return false;
  });
}

