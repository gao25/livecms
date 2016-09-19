var executeCmd = {};
// url参数
executeCmd['urlParams'] = (function(){
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
executeCmd['ajax'] = function (url, ajaxHead, ajaxBody, callback) {
  url = url.replace('.json', '.do');
  var data = JSON.stringify(ajaxBody);
  if (data == '{}') data = '';
  $.ajax({
    type: "post",
    dataType: "json",
    contentType: "application/json",
    url: url,
    data: data,
    beforeSend: function (req) {
      req.setRequestHeader("sign", hex_sha512(data));
      $.each(ajaxHead, function (key, val) {
        req.setRequestHeader(key, val);
      });
    },
    success: function(res){
      callback(true, res);
    },
    error: function(err){
      callback(false, err);
    }
  });
};
