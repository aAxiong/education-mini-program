var WxParse = require('../../wxParse/wxParse.js');
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    time: '',
    nodes: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: urlApi.WXSelectNewsDetail + '/' + options.id,
      header: util.requestHeader(),
      method: 'GET',
      success: (res) => {
        let _content = res.data.data.content.replace('<img', '<img style="max-width:100%;height:auto" ')
        if (res.data.code == 200) {
          this.setData({
            title: res.data.data.title,
            time: res.data.data.gmtModified,
            nodes: _content
          })


          // WxParse.wxParse('article', 'html', _content, this, 0)
        } else {
          if (res.data.code == 403) {
            util.resetSessionId();
            return;
          }
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(r) {
              console.log(r);
            }
          });
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '艾克斯科学实验室',
      desc: '最具人气的小程序!',
      path: '/pages/index/index',
      imageUrl: '/images/sharPt.png'
    }
  }
})