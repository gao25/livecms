// 获取参数
var page = + lvsCmd['urlParams']['page'];
if (isNaN(page) || page < 1) page = 1;

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
    "title": "关键字类型",
    "name": "keyType",
    "type": "select",
    "option": [
      {"text": "关键字类型", "value": "0"},
      {"text": "创建人", "value": "1"},
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
lvsCmd.page('j-page', 437, page,20);
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

//上排 下排 置顶
$('.lsort-btn').on('click','a',function(event){
  event=event?event:window.event;
  if(event.preventDefault){
    event.preventDefault();
  }else{
    event.returnValue=false;
  }
  var parent=$(this).parents('tr');
  var val=parent.find('.sort-num').html();
  var parents=$(this).parents('table');
  var len=parents.children().length-1;
  if(($(this).is('.lup')||$(this).is('.ltop'))&&parent.index()==1){
    alert('已经置顶了！');
    return false;
  }else if($(this).is('.ldown')&&parent.index()==len){
    alert('已经置底了！');
    return false;
  }
  switch(true){
    case $(this).is('.lup'):
      var prev=parent.prev(),
          val1=prev.find('.sort-num').html();
      parent.find('.sort-num').html(val1);
      prev.find('.sort-num').html(val);
      parent.insertBefore(prev);
      break;
    case $(this).is('.ldown'):
      var next=parent.next(),
          val1=next.find('.sort-num').html();
      parent.find('.sort-num').html(val1);
      next.find('.sort-num').html(val);
      parent.insertAfter(next);
      break;
    case $(this).is('.ltop'):
      $('.sort-num').each(function(){
        var val=parseInt($(this).html());
        if($(this).html()<parent.index()){
          $(this).html(val+1);
        }
      });
      parent.find('.sort-num').html(1);
      parent.insertBefore(parents.find('tr').eq(1));
      break;
  }
})