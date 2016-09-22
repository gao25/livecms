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
    "title": "账号",
    "name": "key",
    "type": "text",
    "maxlength": 100,
    "placeholder": "账号"
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
    key = $('#j-searchform input[name=key]').val();
  if (beginDate) data['beginDate'] = new Date(beginDate).getTime();
  if (endDate) data['endDate'] = new Date(endDate).getTime();
  if (key) data['key'] = key;
  lvsCmd.ajax(config['url'], data, function (state, res) {
    console.log(res);
  });  
});

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
//删除操作
$('.comment-delete-btn').click(function(){
  $('.select-btn').each(function(){
    if($(this).hasClass('lselected')){
      $(this).parent().parent().remove();
      if($('.lselect-btn').hasClass('lselected')){
        $('.lselect-btn').removeClass('lselected');
        select_num=0;
      } 
    }
  })
})
$('.delete-btn').on('click',function(){
  $(this).parents('tr').remove();
})
$('.delete-btn').hover(function(){
  $(this).css('color','#f00');
},function(){
  $(this).css('color','#2c1cca');
})