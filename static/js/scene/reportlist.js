// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;

// 渲染列表
var reportlistTpl = juicer($('#j-reportlist script').html());
$('#j-reportlist script').remove();
function loadReportList(){
  lvsCmd.ajax('/live-web-reporter/report/getUnApproved.json', {"page": page}, function (state, res) {
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
  "type": "ajax",
  "method": "post",
  "action": "xxx",
  "fields": [{
    "class": "j-starttime",
    "title": "开始时间",
    "name": "starttime",
    "type": "date",
    "required": true,
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
    "name": "endtime",
    "type": "date",
    "required": true,
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
    "name": "type",
    "type": "select",
    "option": [
      {"text": "报道类型", "value": "0"},
      {"text": "图文", "value": "1"},
      {"text": "视频", "value": "2"},
      {"text": "语音", "value": "4"}
    ]
  }, {
    "title": "关键字",
    "name": "keyword",
    "type": "text",
    "maxlength": 100,
    "placeholder": "关键字"
  }, {
    "title": "报道人",
    "name": "other",
    "type": "select",
    "option": [
      {"text": "报道人", "value": "0"},
      {"text": "张三", "value": "1"},
      {"text": "李四", "value": "2"}
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
  alert('ajax');
});

// 分页
lvsCmd.page('j-page', 437, 8, 10);
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


