// 获取上传 accessid、policyBase64、signature
function loadUploaderSign (callback) {
  lvsCmd.ajax('/live-web-cms/uploader.json', {}, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        callback(res['data']);
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
}
// 创建上传实例
function loadUploaderMod (uploaderSign) {
  // http://xinhua-zbcb.oss-cn-hangzhou.aliyuncs.com
  var host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com',
    multipart_params = {
      // 'key' : 'a.png', // 文件路径 文件名
      'OSSAccessKeyId': uploaderSign['accessid'],
      'policy': uploaderSign['policyBase64'],
      'signature': uploaderSign['signature'],
      'success_action_status': '200' //让服务端返回200,不然，默认会返回204
    };

  function fileNameRandom(){
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
      maxPos = chars.length,
      random = '';
    for (i = 0; i < 32; i++) {
      random += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return random;
  }
  function fileNameExt (filename) {
    var pos = filename.lastIndexOf('.'),
      suffix = ''
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }

  lvsCmd['uploader'] = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'j-uploader-select', 
    multi_selection: false, // 单选
    container: document.getElementById('j-uploader'),
    flash_swf_url: '/lib/plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url: '/lib/plupload-2.1.2/js/Moxie.xap',
    url: host,
    filters: {
      /*
      mime_types : [ //只允许上传图片和zip文件
        { title : "Image files", extensions : "jpg,gif,png,bmp" },
        { title : "Zip files", extensions : "zip" }
      ],
      */
      max_file_size: '1048576kb', // 最大只能上传 1024 * 1024kb = 1G 的文件
      prevent_duplicates: true // 不允许选取重复文件
    },
    init: {
      PostInit: function(up, files) {
        document.getElementById('ossfile').innerHTML = '';
        document.getElementById('j-uploader-post').onclick = function(){
          //var 
          lvsCmd['uploader'].setOption({
            multipart_params: {
              'key' : 'a.png', //g_object_name,
              'policy': policyBase64,
              'OSSAccessKeyId': accessid, 
              'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
              'signature': signature,
            }
          });

          lvsCmd['uploader'].start();

          //set_upload_param(uploader, '', false);
          return false;
        };
      },

      FilesAdded: function (uploader, files) {
        var file = files[0];
        //console.log(file);
        //plupload.each(files, function(file) {
          document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
          +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
          +'</div>';
        //});
      },
      /*
      BeforeUpload: function(up, file) {
        check_object_radio();
        get_dirname();
        set_upload_param(up, file.name, true);
      },
      */

      UploadProgress: function(up, file) {
        var d = document.getElementById(file.id);
        d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
        var prog = d.getElementsByTagName('div')[0];
        var progBar = prog.getElementsByTagName('div')[0]
        progBar.style.width= 2*file.percent+'px';
        progBar.setAttribute('aria-valuenow', file.percent);
        console.log(file);
      },
      /*
      FileUploaded: function(up, file, info) {
        if (info.status == 200)
        {
          document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
        }
        else
        {
          document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
        } 
      },
      */

      Error: function (up, err) {
        if (err['code'] == -602) {
          // code: -602, message: "Duplicate file error.",
          alert('文件已选择！');
        }
        console.log(err);
        // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
      }
    }
  });
}