// 参数
var urlData = lvsCmd['urlParams'],
  callback = urlData['callback'],
  iframe = urlData['iframe'];
if (!iframe) iframe = 'mainframe';

var formData = {
  liveId: urlData['liveId']
};
// 提交审核
function verifyFn(){
  lvsCmd.ajax('/live-web-cms/live/approve.json', formData, function (state, res) {
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
  // 确定审核不通过
  formData['state'] = 4;
  formData['notThroughReason'] = $('#j-notThroughReason').val();
  verifyFn();
});
$('#j-false').click(function(){
  // 取消
  parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">现场审核<em class="j-overlay-close">X</em></div><iframe scrolling="auto" frameborder="0" width="640" height="200" src="scene/sceneverify.html?liveId='+urlData['liveId']+'&callback='+urlData['callback']+'"></iframe></div>');
});
