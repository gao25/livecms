var lvsCmd = {};
// url参数
lvsCmd['urlParams'] = (function(){
  var data = {},
    params = document.URL.split('?')[1];
  if (params) {
    $.each(params.split('&'), function(){
      var thisData = this.split('=');
      data[thisData[0]] = thisData[1];
    });
  }
  return data;
})();
// ajax请求
lvsCmd['ajax'] = function (url, data, callback) {
  $.ajax({
    type: "post",
    dataType: "json",
    contentType: "application/json",
    url: url,
    data: JSON.stringify(data),
    success: function(res){
      callback(true, res);
    },
    error: function(err){
      callback(false, err);
    }
  });
};
/* 分页 */
lvsCmd['page'] = function (obj, count, page, pageSize) {
  if (typeof(obj) != 'object') {
    obj = $('#' + obj);
  }
  var html = '',
    countPage = Math.ceil(count / pageSize);
  html += '<span>共'+count+'条/'+countPage+'页记录</span>';
  if (page > 1) {
    html += '<a href="javascript:void(0)" data-page="1">首页</a>';
    html += '<a href="javascript:void(0)" data-page="'+(page-1)+'">上一页</a>';
  }
  if (page > 4) {
    var toPage = page + 4;
    if (toPage > countPage) toPage = countPage;
    var fromPage = toPage - 7;
    if (fromPage < 1) fromPage = 1;
  } else {
    var fromPage = 1,
      toPage = 8;
    if (toPage > countPage) toPage = countPage;
  }
  for (var i=fromPage; i<=toPage; i++) {
    html += '<a href="javascript:void(0)" data-page="'+i+'"';
    if (i == page) html += ' class="current"';
    html += '>'+i+'</a>';
  }
  if (page < countPage) {
    html += '<a href="javascript:void(0)" data-page="'+(page+1)+'">下一页</a>';
    html += '<a href="javascript:void(0)" data-page="'+countPage+'">尾页</a>';
  }
  obj.html(html);
};

// 返回
$('.lvs-crumb .back').click(function(){
  history.back();
  return false;
});



