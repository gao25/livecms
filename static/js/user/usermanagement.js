// 获取参数
var urlParams = lvsCmd['urlParams'];
if (isNaN(urlParams['currentPage']) || urlParams['currentPage'] < 1) urlParams['currentPage'] = 1;
urlParams['pageCount'] = 20;
var searchData = {},
  searchFields = ['startDate', 'endDate', 'identityType', 'state', 'key', 'keyType'];

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "id": "j-searchform",
  "type": "ajax",
  "method": "post",
  "action": "/report/searchUnApproved.json",
  "fields": [{
    "class": "j-starttime",
    "title": "开始时间",
    "name": "startDate",
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
    "title": "所属渠道",
    "name": "identityType",
    "type": "select",
    "option": [
      {"text": "所属渠道", "value": ""},
      {"text": "微信", "value": "weixin"},
      {"text": "微博", "value": "weibo"},
      {"text": "APP端", "value": "app"},
      {"text": "QQ", "value": "qq"}
    ]
  }, {
    "title": "用户状态",
    "name": "state",
    "type": "select",
    "option": [
      {"text": "用户状态", "value": ""},
      {"text": "启用", "value": "1"},
      {"text": "禁用", "value": "0"},
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
      {"text": "关键字类型", "value": ""},
      {"text": "用户名", "value": "identityNo"},
      {"text": "昵称", "value": "identityName"},
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
      if (this == 'startDate' || this == 'endDate') {
        searchData[this] = lvsCmd.formatDate( + urlParams[this], 'YY-MM-DD');
      } else {
        searchData[this] = urlParams[this];
      }
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
  urlParams['currentPage'] = 1;
  $.each(formInfo['data'], function (key, value) {
    if (value) {
      if (key == 'beginDate' || key == 'endDate') {
        newUrlParams[key] = new Date(value).getTime();
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
  if (state == 0) {
    return '禁用';
  } else if (state == 1) {
    return '启用';
  }
});

// 渲染列表
var listTpl = juicer($('#j-list script').html());
$('#j-list script').remove();
function renderList (state, res) {
  if (state) {
    if (res['status'] == '0') {
      if (res['data'] && res['data'].length > 0) {
        var listHtml = listTpl.render(res);
        $('#j-list').html(listHtml);
        // 绑定操作
        bindList();
      }
      // 分页
      lvsCmd.page('j-page', res['totalCount'], res['currentPage'], res['pageCount']);
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
}
searchData['currentPage'] = urlParams['currentPage'];
searchData['pageCount'] = urlParams['pageCount'];
if (searchData['endDate']) searchData['endDate'] = + searchData['endDate'] + 24 * 3600 * 1000;
parent.executeCallback('/thirduserquery/getList.json', searchData, 'renderList');

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
  // 启动
  $('.j-open').click(function(){
    var id = $(this).data('id');
    changeState([id], 1);
  });
  // 删除
  $('.j-delete').click(function(){
    var id = $(this).data('id');
    changeState([id], 0);
  });
  // 批量启动
  $('#j-openselect').click(function(){
    var idList = [];
    $('#j-list .lselected').each(function(){
      if ($(this).data('id')) {
        idList.push($(this).data('id'));
      }
    });
    changeState(idList, 1);
  });
  // 批量删除
  $('#j-delectselect').click(function(){
    var idList = [];
    $('#j-list .lselected').each(function(){
      if ($(this).data('id')) {
        idList.push($(this).data('id'));
      }
    });
    changeState(idList, 0);
  });
}

// 修改用户状态
function changeStateCallback(){
  location.href = document.URL;
}
function changeState (idList, state) {
  parent.executeCallback('/thirduserupdate/updateState.json', {idList: idList, state: state}, 'changeStateCallback');
}
