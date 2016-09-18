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
    "title": "现场类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "现场类型", "value": "0"},
      {"text": "图文直播", "value": "1"},
      {"text": "音频直播", "value": "2"},
      {"text": "视频直播", "value": "4"}
    ]
  }, {
    "title": "关键字",
    "name": "keyword",
    "type": "text",
    "maxlength": 100,
    "placeholder": "关键字"
  }, {
    "title": "创建人",
    "name": "other",
    "type": "select",
    "option": [
      {"text": "创建人", "value": "0"},
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
  $(this).find('ul').show();
},function(){
  $(this).find('ul').hide();
})
$('.more ul li a').hover(function(){
  $(this).css('color','#12bb9a');
},function(){
  $(this).css('color','#808080');
})