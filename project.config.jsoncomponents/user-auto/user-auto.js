const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow: true,
    userInfo: {}
  },
  attached() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        if (res.data) {
          this.setData({
            isShow: false
          });
        }
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        isShow: false,
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          isShow: false,
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            isShow: false,
            userInfo: res.userInfo
          })
        }
      })
    }
  },
  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // closeBox() {
    //   this.setData({
    //     isShow: false
    //   })
    // },
    // showLogin() {
    //   this.setData({
    //     isShow: true
    //   })
    // },
    getUserInfo: function(e) {
      var datas = e.detail.rawData
      // this.setData({
      //   isShow: false
      // })
      if (!datas) {
        return
      }

      wx.setStorage({
        key: 'userinfo',
        data: e.detail.userInfo,
      });
      wx.setStorage({
        key: 'loginMsg',
        data: datas,
      });
      wx.setStorage({
        key: 'myLoginMsg',
        data: datas,
      })

      wx.reLaunch({
        url: '/pages/index/index',
      })

      // this.getInfo(() => {
      //   this.triggerEvent('myevent', {}, {})
      //   this.setData({
      //     isShow: false
      //   })
      // })
    },
    getInfo(fn) {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          app.globalData.userInfo = res.userInfo
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          fn && fn()
        }
      })
    }
  }
})