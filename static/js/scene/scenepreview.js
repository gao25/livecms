// 获取参数
var searchFromData = lvsCmd['urlParams'];
if (isNaN(searchFromData['reportId']) || searchFromData['reportId'] < 1) {
  parent.location.href = 'reportlist.html';
}

// juicer函数
juicer.register('formatDate', lvsCmd['formatDate']);
juicer.register('formatType', function(type){
  var typeStr = '';
  if (type == 1) {
    typeStr = '图文';
  } else if (type == 2) {
    typeStr = '音频';
  } else if (type == 4) {
    typeStr = '视频';
  }
  return typeStr;
});
juicer.register('formatState', function(state){
  var stateDict = {
    "1": "未审核",
    "2": "审核通过",
    "8": "审核失败"
  }
  return stateDict[state];
});
// 渲染列表
var viewTpl = juicer($('#j-reportpreview script').html());
$('#j-reportpreview script').remove();
lvsCmd.ajax("/live-web-cms/report/preview.json", searchFromData, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      var viewHtml = viewTpl.render(res);
      $('#j-reportpreview').html(viewHtml);
      // 绑定操作
      bindReportList();
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});
function bindReportList(){
  //nothing
}