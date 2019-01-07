const app = getApp()
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: 10, // 每页条目
    totalPage: '', //总页数
    // curriculumList: [{
    //   status: 200,
    //   characteristicList: [{ //特色课程
    //     "imgUrl": "/images/pic1.png", //特色课程背景图片
    //     "id": 0,
    //     "title": " 社区课程 ", //标题
    //     "intfomation": "想象力培养激发", //描述
    //     "type": 1
    //   }, {
    //     "imgUrl": "/images/pic2.png",
    //     "id": 2,
    //     "title": " 科普活动 ",
    //     "intfomation": "想象力培养激发",
    //     "type": 1
    //   }, {
    //     "imgUrl": "/images/pic3.png",
    //     "id": 3,
    //     "title": " 校园课程 ",
    //     "intfomation": "想象力培养激发",
    //     "type": 1
    //   }, {
    //     "imgUrl": "/images/pic4.png",
    //     "id": 4,
    //     "title": " 户外课 ",
    //     "intfomation": "想象力培养激发",
    //     "type": 1
    //   }]
    // }],
    curriculumList: '',
    freeList: '',
    // freeList: [{
    //   status: 200,
    //   courseList: [{
    //     "imgUrl": "/images/bg.jpg",
    //     "id": 4,
    //     "title": " 户外课 ", //标题
    //     "intfomation": "想象力培养激发", //描述
    //     "name": "子怒", //姓名
    //     "position": "心理学博士", //职位
    //     "type": 1 //类型
    //   }, {
    //     "imgUrl": "/images/bg.jpg",
    //     "id": 4,
    //     "title": " 户外课 ",
    //     "intfomation": "想象力培养激发",
    //     "name": "子怒",
    //     "position": "心理学博士",
    //     "type": 1
    //   }, {
    //     "imgUrl": "/images/bg.jpg",
    //     "id": 4,
    //     "title": " 户外课 ",
    //     "intfomation": "想象力培养激发",
    //     "name": "子怒",
    //     "position": "心理学博士",
    //     "type": 1
    //   }]
    // }],
    loadngMsg: '加载中',
    isCoverFlag: false,
    cartNum: 0 // 购物车数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorage({
      key: 'pageNumber',
      data: 'curriculum'
    })
    // this.setData({
    //   isCoverFlag: true
    // })

  },
  onShow() {
    this.page = 1
    this.getcurriculumList();
    this.getListInfo(0);
    this.setData({
      cartNum: app.globalData.SHOPCARLISTOBJ.length
    })
  },

  getcurriculumList(e) { //获取特色课程
    let curriculumList = [];
    wx.request({
      url: urlApi.WXGoodCategoryList,
      data: {},
      header: util.requestPostHeader(),
      method: 'post',
      success: (res) => {
        if (res.data.code == 200) {
          var demo = {};
          var characteristicList = [];
          if (res.data.data.length > 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              var banner = {};
              banner.id = res.data.data[i].id;
              banner.imgUrl = res.data.data[i].picUrl;
              banner.title = res.data.data[i].name;
              banner.intfomation = res.data.data[i].introduction;
              banner.type = res.data.data[i].id;
              characteristicList.push(banner);
            }
            demo.statuCode = res.data.code;
            demo.characteristicList = characteristicList;
            curriculumList.push(demo);
          }
          this.setData({
            curriculumList: curriculumList, //数据源
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
  getListInfo(e) { //获取免费课程
    let freeList = [];
    wx.request({
      url: urlApi.WXQueryFreeGoodList,
      data: {
        "pageIndex": this.page,
        "pageRow": this.data.rows,
      },
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        //freeList.push(...res.data.arr)
        if (res.data.code == 200) {
          var demo = {};
          var results = res.data.data.results;
          var courseList = [];
          if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
              var banner = {};
              banner.id = results[i].id;
              banner.imgUrl = results[i].picUrl;
              banner.name = results[i].leader; //作者名字
              banner.intfomation = results[i].introduction;
              banner.type = results[i].id;
              banner.position = results[i].position; //作者职位
              banner.title = results[i].name; //课程主题
              courseList.push(banner);
            }
            demo.statuCode = res.data.code;
            demo.courseList = courseList;
            freeList.push(demo);
          }
          this.setData({
            totalPage: res.data.data.totalPage, // 总页数
            freeList: freeList, //数据源
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
  jumpTeInfo: function(e) { //跳转到课程列表
    wx.navigateTo({
      url: '/pages/curriculum-list/curriculum-list?id=' + e.currentTarget.dataset.id
    })
  },
  jumpCourseInfo: function(e) { //跳转课程详情
    wx.navigateTo({
      url: '/pages/curriculum-info/curriculum-info?id=' + e.currentTarget.dataset.id
    })
  },
  jumpShopCart: function() { //跳转到购物车
    wx.navigateTo({
      url: '/pages/shopCar-list/shopCar-list'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.page >= this.data.totalPage) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getListInfo()
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