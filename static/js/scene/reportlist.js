// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;
var beginDate = '',
  endDate = '',
  reportType = '',
  key = '',
  keyType = '';

// 渲染列表
var reportlistTpl = juicer($('#j-reportlist script').html());
$('#j-reportlist script').remove();
function loadReportList(){
  $('#j-reportlist').html('');
  var url = '/live-web-cms/report/getUnApprovedReport.json',
    searchUrl = '/live-web-cms/report/searchUnApproved.json',
    data = {page: page};
  if (beginDate) {
    data['beginDate'] = beginDate;
    url = searchUrl;
  }
  if (endDate) {
    data['endDate'] = endDate;
    url = searchUrl;
  }
  if (reportType > 0) {
    data['reportType'] = reportType;
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
  lvsCmd.ajax(searchUrl, data, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        var reportlistHtml = reportlistTpl.render(res);
        $('#j-reportlist').html(reportlistHtml);
        // 绑定操作
        bindReportList();
        // 分页
        lvsCmd.page('j-page', 437, page, 20);
        $('#j-page a').click(function(){
          page = $(this).data('page');
          loadReportList();
        });
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
}
function bindReportList(){
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
loadReportList();

// 渲染搜索栏
var newSearchform = new cake["tplform-1.0.1"]('j-search'),
searchConfig = {
  "id": "j-searchform",
  "type": "ajax",
  "method": "post",
  "action": "/live-web-cms/report/searchUnApproved.json",
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
newSearchform.render(searchConfig, null, function(){
  page = 1;
  beginDate = $('#j-searchform input[name=beginDate]').val(),
  endDate = $('#j-searchform input[name=beginDate]').val(),
  reportType = $('#j-searchform select[name=reportType]').val(),
  key = $.trim($('#j-searchform input[name=key]').val()),
  keyType = $('#j-searchform select[name=reportType]').val();
  if (beginDate) beginDate = new Date(beginDate).getTime();
  if (endDate) endDate = new Date(endDate).getTime();
  loadReportList(); 
});

