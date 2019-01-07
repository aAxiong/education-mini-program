const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: '',
    id: '',
    sex: 0,
    tphone: "", //手机号
    name: "", //姓名
    classs: "", //班级
  },
  changeSex(e) {
    this.setData({
      sex: e.currentTarget.dataset.index
    })
  },
  getname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      tphone: e.detail.value
    })
  },
  getclasss(e) {
    this.setData({
      classs: e.detail.value
    })
  },
  subInfo() { //提交
    let phone = this.data.tphone;
    let sex = this.data.sex;
    let name = this.data.name;
    let classs = this.data.classs;
    let id = this.data.id;
    let types = this.data.types;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.request({
      url: '',
      data: {
        phone: phone,
        sex: sex, // 是否设置为默认
        name: name,
        classs: classs
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          app.globalData.tel = phone
          if (types == 0) {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/homeSubject/homeSubject?id=' + id,
              })
            }, 1300)
          } else {
            wx.navigateTo({
              url: '/pages/onlineAnswer/onlineAnswer?id=' + id,
            })
          }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      types: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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