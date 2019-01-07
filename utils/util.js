const app = getApp()
const urlApi = require('./api.js');
// 请求接口400  重新授权  公用方法
function resetSessionId() {
  UserLogin()
}

// 请求接口公用方法
function RequestPostFunc(urlStr, dataMsg, successFunc, errFunc) {
  wx.getStorage({
    key: 'Token',
    success: res => {
      var token = res.data;
      wx.request({
        url: urlStr + "?token=" + token,
        data: dataMsg,
        method: "POST",
        success: res => {
          successFunc(res.data)
        },
        error: err => {
          errFunc(err)
        }
      })
    },
  })
};

// 登陆
function UserLogin(fn, back) {
  wx.login({
    success: info => {
      var that = this
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.getStorage({
        key: 'myLoginMsg',
        success: res => {
          var datas = JSON.parse(res.data);
          setTimeout(function() {
            wx.request({
              url: urlApi.WeCharLoginAPI,
              method: 'POST',
              data: {
                "code": info.code,
                "user": datas,
                "type": "bijiaHelper"
              },
              success: function(res) {
                wx.setStorage({
                  key: 'wx_pet_sessionId',
                  data: res.data.data.sessionId
                });
                if (res.data.code == 200) {
                  if (!back) {
                    wx.navigateBack({
                      delta: 99
                    });
                  }
                  // app.globalData.userInfo = res.data.data.userInfo;
                  fn && fn()
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '获取用户信息失败请重试',
                    showCancel: false,
                    success: function(res) {
                      console.log(res);
                    }
                  });
                };
              },
              fail: function(err) {
                console.log(err);
              }
            })
          }, 200);
        },
      });
    }
  })
}


function ajaxGetFunc(urlStr, dataMsg, successFunc, errFunc) {
  wx.request({
    url: urlStr,
    data: dataMsg,
    method: "POST",
    header: requestHeader(),
    success: res => {
      successFunc(res.data)
    },
    error: err => {
      errFunc(err)
    }
  })
};

// 从本地储存中调出sessionId
function requestHeader() {
  var sessionId = wx.getStorageSync('wx_pet_sessionId');
  var header = {
    'content-type': 'application/x-www-form-urlencoded', // 默认值
    'Cookie': "JSESSIONID = " + sessionId
  }
  return header
};

function requestPostHeader() {
  var sessionId = wx.getStorageSync('wx_pet_sessionId');
  var header = {
    'content-type': 'application/json', // 默认值
    'Cookie': "JSESSIONID = " + sessionId
  }
  return header
};


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  ajaxGetFunc: ajaxGetFunc,
  resetSessionId: resetSessionId,
  RequestPostFunc: RequestPostFunc,
  requestHeader: requestHeader,
  requestPostHeader: requestPostHeader,
  UserLogin: UserLogin
}