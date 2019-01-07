const urlApi = require('utils/api.js');
App({
  onLaunch: function() {
    wx.removeStorageSync('pageNumber')
   // wx.hideTabBar()
    // 登录

    // 有登陆接口，记得把这里注释了
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res.userInfo)
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getStorage({
      key: 'SHOPCARLISTOBJ',
      success: (res) => {
        this.globalData.SHOPCARLISTOBJ = JSON.parse(res.data)
        console.log(JSON.parse(res.data))
      },
    })
  },
  globalData: {
    userInfo: null,
    addressItem: null, // 全局地址数据
    tel: '1',
    SHOPCARLISTOBJ: [], // 购物车数组
    goodsList: [], // 下订单数组
    answerTitle: ''
  }
})

// SHOPCARLISTOBJ // 教育全局缓存购物车数据