// pages/finshHomeTask/finshHomeTask.js
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optList: [{
      id: 1,
      "imgurl": '/images/head_img.png',
      workStatus: '作业完成',
      num: 5,
      int: 5
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id
    // this.setData({
    //   isCoverFlag: true
    // })
    this.getListInfo(options.id)
  },
  getListInfo: function(id) {
    let list = this.data.optionList
    wx.request({
      url: '',
      data: {
        id: id
      },
      header: util.requestHeader(),
      method: 'GET',
      success: (res) => {
        if (res.data.code == 200) {
          list.push(...res.data.arr)
          this.setData({
            optionList: list, //数据源
            isCoverFlag: false
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