// pages/payfor_success/payfor_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 198.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      money: options.money || ''
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