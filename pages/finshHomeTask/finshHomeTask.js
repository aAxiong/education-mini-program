// pages/finshHomeTask/finshHomeTask.js
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optList: [{
      id: 1,
    }],
    workStatus: '作业完成',
    "imgurl": '/images/head_img.png',
    num: 5, // 答对的题目
    totalScore: 0,
    types: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id
    this.setData({
      num: options.num,
      totalScore: options.totalScore,
      imgurl: app.globalData.userInfo.avatarUrl,
      types: options.type,
      workStatus: options.type === '1' ? '答题完成' : '作业完成'
    })
    wx.setNavigationBarTitle({
      title: this.data.workStatus
    })

    // this.setData({
    //   isCoverFlag: true
    // })
    //  this.getListInfo(options.id)
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