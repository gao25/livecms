// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;

// 渲染列表
var reportlistTpl = juicer($('#j-reportlist script').html());
$('#j-reportlist script').remove();
function loadReportList(){
  lvsCmd.ajax('/live-web-cms/report/getUnApprovedReport.json', {"page": page}, function (state, res) {
    if (state) {
      var reportlistHtml = reportlistTpl.render(res);
      $('#j-reportlist').html(reportlistHtml);
    }
  });
}
loadReportList();


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
newSearchform.render(searchConfig, null, function(config){

  var data = {page: 1},
    beginDate = $('#j-searchform input[name=beginDate]').val(),
    endDate = $('#j-searchform input[name=beginDate]').val(),
    reportType = $('#j-searchform select[name=reportType]').val(),
    key = $('#j-searchform input[name=key]').val(),
    keyType = $('#j-searchform select[name=reportType]').val();
  if (beginDate) data['beginDate'] = new Date(beginDate).getTime();
  if (endDate) data['endDate'] = new Date(endDate).getTime();
  if (reportType > 0) data['reportType'] = reportType;
  if (key) data['key'] = key;
  if (keyType > 0) data['keyType'] = keyType;
  lvsCmd.ajax(config['url'], data, function (state, res) {
    console.log(res);
  });  
});

// 分页
lvsCmd.page('j-page', 437, page, 20);
$('#j-page a').click(function(){
  alert($(this).data('page'));
});


// 列表
$('.more').hover(function(){
  $(this).find('img').attr('src','/static/img/green_menu.png');
  $(this).find('ul').show();
},function(){
  $(this).find('img').attr('src','/static/img/menu.png');
  $(this).find('ul').hide();
})
$('.more ul li a').hover(function(){
  $(this).css('color','#12bb9a');
},function(){
  $(this).css('color','#808080');
})

//置顶
$('.ltop').on('click',function(){
  var parent=$(this).parents('.detail');
  if(parent.index()==0){
    alert('已经置顶了！');
    return false;
  }else{
    var prev=parent.prev();
    parent.insertBefore(prev);
  }
})
