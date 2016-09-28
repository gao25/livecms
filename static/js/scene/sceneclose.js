// 参数
var urlData = lvsCmd['urlParams'],
  callback = urlData['callback'],
  iframe = urlData['iframe'];
if (!iframe) iframe = 'mainframe';

var formData = {
  liveId: urlData['liveId']
};
// 关闭报道
function closeFn(){
  lvsCmd.ajax('/live-web-cms/live/close.json', formData, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        parent.window.frames[iframe][callback]();
        parent.window.mainOverlay.hide();
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
}
$('#j-true').click(function(){
  // 确定
  closeFn();
});
$('#j-false').click(function(){
  // 取消
  parent.window.mainOverlay.hide();
});
