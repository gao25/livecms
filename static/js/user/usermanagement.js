// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;

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
    "title": "所属渠道",
    "name": "userchannel",
    "type": "select",
    "option": [
      {"text": "报道类型", "value": "0"},
      {"text": "微信", "value": "1"},
      {"text": "微博", "value": "2"},
      {"text": "APP端", "value": "4"}
    ]
  }, {
    "title": "用户状态",
    "name": "userstate",
    "type": "select",
    "option": [
      {"text": "用户状态", "value": "0"},
      {"text": "启用", "value": "1"},
      {"text": "禁用", "value": "2"},
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
      {"text": "用户名", "value": "1"},
      {"text": "昵称", "value": "2"},
    ]
  }],
  "button": [
    {
      "value": "搜索",
      "type": "submit"
    }
  ]
};
newSearchform.render(searchConfig, null, function(config){

  var data = {page: 1},
    beginDate = $('#j-searchform input[name=beginDate]').val(),
    endDate = $('#j-searchform input[name=beginDate]').val(),
    userchannel = $('#j-searchform select[name=userchannel]').val(),
    userstate = $('#j-searchform select[name=userstate]').val(),
    key = $('#j-searchform input[name=key]').val(),
    keyType = $('#j-searchform select[name=reportType]').val();
  if (beginDate) data['beginDate'] = new Date(beginDate).getTime();
  if (endDate) data['endDate'] = new Date(endDate).getTime();
  if (userchannel > 0) data['userchannel'] = userchannel;
  if (userstate > 0) data['userstate'] = userstate;
  if (key) data['key'] = key;
  if (keyType > 0) data['keyType'] = keyType;
  lvsCmd.ajax(config['url'], data, function (state, res) {
    console.log(res);
  });  
});



// 获取列表
function getList (state, res) {
  if (state) {
    if (res['status'] == '0') {
      //newTplform.setval(res['data']);
      console.log(res);
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}
parent.executeCallback('/thirduserquery/getList.json', {currentPage:1,pageCount:20}, 'getList');


// 分页
lvsCmd.page('j-page', 437, page, 20);
$('#j-page a').click(function(){
  alert($(this).data('page'));
});
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