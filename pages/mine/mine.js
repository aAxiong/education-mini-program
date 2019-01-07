const app = getApp()
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    loadngMsg: '加载中',
    loadingFlag: false,
    score: 0, //积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userAuto = this.selectComponent("#userAuto")
    wx.setStorage({
      key: 'pageNumber',
      data: 'mine'
    })
    wx.getStorage({
      key: 'myLoginMsg',
      success: (res) => {
        this.setData({
          userInfo: JSON.parse(res.data)
        })
      },
    })
    this.getInfo()
  },
  getInfo() {
    wx.request({
      url: urlApi.WXBannerUrl,
      data: {},
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        //indexList.push(...res.data.data)
        if (res.data.code == 200) {
          this.setData({
            score: 11
          })
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
  // 订单列表
  navigatorHandle(e) {
    let _status = e.currentTarget.dataset.tp
    let _page = e.currentTarget.dataset.page
    if (!this.data.userInfo) {
      this.userAutoHander()
      return
    }

    wx.navigateTo({
      url: `/pages/${_page}/${_page}?tp=${_status}`,
    })
  },
  // 请求授权
  userAutoHander() {
    if (!this.data.userInfo) {
      this.userAuto.showLogin()
    }
  },
  // 确认授权
  AutoLogin(e) {
    this.setData({
      loadngMsg: '加载中',
      loadingFlag: true
      // userInfo: app.globalData.userInfo
    })
    // 登陆
    util.UserLogin(() => {
      this.setData({
        loadingFlag: false,
        userInfo: app.globalData.userInfo,
      });
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