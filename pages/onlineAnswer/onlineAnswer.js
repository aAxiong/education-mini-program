// pages/homeSubject/homeSubject.js
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionNum: 0,
    optionList: [{
      question: '你认为黑客是你认为黑客是你认为黑客?', //问题
      "number": 4, //第几题
      "integral": 5, //积分
      'headerImg': '/images/head_img.png', //头像
      'imagurl': '/images/defaultimg.png', //问题图片
      nowQuestion: 1, //当前第几题
      list: [{ //题目选项
        id: '1',
        opt: "A", //选项
        content: '计算机很厉害的人'
      }, {
        id: '2',
        opt: "B",
        content: '长得黑的人'
      }, {
        id: '3',
        opt: "C",
        content: '喜欢穿黑衣服的人'
      }],
      commentList: [{
        id: 1,
        name: 'woshicct', //评论者姓名
        likeNum: 20,
        isLike: 1,
        headerImgUrl: '/images/bg.jpg', //评论者头像
        imgurl: ['https://img2018.cnblogs.com/news/24442/201811/24442-20181105150013344-185546354.jpg', 'https://img2018.cnblogs.com/news/24442/201811/24442-20181105150013344-185546354.jpg', 'https://img2018.cnblogs.com/news/24442/201811/24442-20181105150013344-185546354.jpg'], //评论图片
        content: '留言文字留言文字留言文字留言文字',
        videoUrl: [], //评论视频
        recoveryList: [{ //回复
          id: 0,
          name: '11', //回复者头像
          content: '留言文字留言文字留言文字留言文字' //回复内容
        }, {
          id: 2,
          name: '21',
          content: '留言文字留言文字留言文字留言文字111'
        }]
      }, {
        id: 1,
        name: 'woshicct',
        likeNum: 20,
        isLike: 0,
        headerImgUrl: '/images/bg.jpg',
        imgurl: [],
        content: '留言文字留言文字留言文字留言文字',
        videoUrl: ['https://655-3.vod.tv.itc.cn/sohu/v1/TmkGTm1ATCGiaUg3tHYMofhHjLJJxlj6x3k7kmxytHrChWoIyYv7r.mp4?k=igg1KY&p=j9lvzSw3omv30pvmqLx7opvB0px7qpXUhRYRzSPWXZxIWhoGgY2Uuho70ScAZMx4gf&r=TUldziJCtpCmhWB3tSCGhWlvsmCUqSkWtWaizY&q=OpCAhW7IWhodRD6XfYWSotE7ZD6XfOXsWDXOfYeHfh1svmbcWJetZY64fhWSqD2sWF9&cip=183.15.205.101', 'https://655-3.vod.tv.itc.cn/sohu/v1/TmkGTm1ATCGiaUg3tHYMofhHjLJJxlj6x3k7kmxytHrChWoIyYv7r.mp4?k=igg1KY&p=j9lvzSw3omv30pvmqLx7opvB0px7qpXUhRYRzSPWXZxIWhoGgY2Uuho70ScAZMx4gf&r=TUldziJCtpCmhWB3tSCGhWlvsmCUqSkWtWaizY&q=OpCAhW7IWhodRD6XfYWSotE7ZD6XfOXsWDXOfYeHfh1svmbcWJetZY64fhWSqD2sWF9&cip=183.15.205.101',
          'https://655-7.vod.tv.itc.cn/sohu/v1/TmviTmwAoKI6h4XXhAyRWmcOMEdXW6WNqLxbPFd1lm47fFoGRMNiNFoAgmPcWJ1sr.mp4?k=ihBTJr&p=XZhuOp3AjfK&r=TmI20LscWOoCNLfcWGe4vmXAyBj&q=OpCGoEOyzSwWsSCG0prmhWqDXpCG0poyoSkyoLrUTLw7qKOCzSP3qLv3qS1BhWCIWheXwmscWY&cip=183.15.206.184'
        ], //评论视频
        recoveryList: [{
          id: 0,
          name: '11',
          content: '留言文字留言文字留言文字留言文字'
        }, {
          id: 2,
          name: '21',
          content: '留言文字留言文字留言文字留言文字111'
        }]
      }]
    }],
    loadngMsg: '加载中',
    isCoverFlag: false,
  },
  choseOpt(e) {
    this.setData({
      optionNum: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id
    this.setData({
      isCoverFlag: true
    })
    this.getListInfo(options.id)
  },
  getListInfo: function(id) { //获取问题内容
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
  changeQue(e) { //换一批
    this.setData({
      isCoverFlag: true
    })
    let list = this.data.optionList
    wx.request({
      url: '',
      data: {
        id: this.id,
      },
      header: util.requestHeader(),
      method: 'POST',
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
  //视频播放事件
  videoTap(e) {
    this.videoContext = wx.createVideoContext(e.currentTarget.id, this)
    this.videoContext.requestFullScreen()
  },
  subAnswer() { //提交答案
    this.setData({
      isCoverFlag: true
    })
    let list = this.data.optionList
    wx.request({
      url: '',
      data: {
        id: this.id,
        answer: this.data.optionNum
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {

          list.push(...res.data.arr)
          this.setData({
            optionList: list, //数据源
            isCoverFlag: false
          })
          if (list[0].nowQuestion == list[0].Total) {
            wx.redirectTo({
              url: '/pages/finshOnlineTask/finshOnlineTask?id=' + list[0].id
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
  Lastquestion() { //上一题
    this.setData({
      isCoverFlag: true
    })
    let list = this.data.optionList
    wx.request({
      url: '',
      data: {
        id: this.id,
      },
      header: util.requestHeader(),
      method: 'POST',
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
  jumpComment() { //跳转到评论
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + this.id
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