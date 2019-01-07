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
    cartNum: 0,
    currList: [{
      status: 200,
      list: [{
        imgUrl: "/images/bg.jpg", //课程商品头像
        tit: '深度实践核心技术篇1深度实践核心技术篇', //课程商品描述
        id: '1',
        allitem: '36', // 总课时
        price: '328' //课程商品价格
      }, {
        imgUrl: "/images/bg.jpg",
        tit: '深度实践核心技术篇2深度实践核心技术篇2深度实践核心技术篇2',
        id: '2',
        price: '8',
        allitem: '12', // 总课时
      }, {
        imgUrl: "/images/bg.jpg",
        tit: '深度实践核心技术篇',
        id: '3',
        allitem: '16', // 总课时
        price: '328'
      }, {
        imgUrl: "/images/bg.jpg",
        tit: '深度实践核心技术篇3',
        id: '4',
        allitem: '12', // 总课时
        price: '378'
      }]
    }],
    carShow: false,
    animationData: [],
    shopId: 0,
    num: 1,
    loadngMsg: '加载中',
    isCoverFlag: false,
    SHOPCARLISTOBJ: [], // 当前购物车数组
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    this.kmShowToast = this.selectComponent("#kmShowToast")
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          Proportion: res.windowWidth / 750,
        })
      },
    })
    this.setData({
      SHOPCARLISTOBJ: app.globalData.SHOPCARLISTOBJ
    })

    // this.setData({
    //   isCoverFlag: true
    // })
    this.page = 1
    this.getListInfo(options.id)
  },
  openShopCar: function(e) {
    let _goodsid = e.currentTarget.dataset.id
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    this.setData({
      shopId: e.currentTarget.dataset.index,
      carShow: true
    })
    let _item = {}
    for (let i = 0; i < this.data.SHOPCARLISTOBJ.length; i++) {
      if (this.data.SHOPCARLISTOBJ[i].id === _goodsid) {
        _item = this.data.SHOPCARLISTOBJ[i]
      }
    }
    _item.num = _item.num || 1
    animation.translate(0, -(this.data.Proportion * 440)).step();

    this.setData({
      animationData: animation.export(),
      num: _item.num
    })
  },
  closeShopCar: function() { //关闭购物车
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation.translate(0, 0).step();
    this.setData({
      carShow: false,
      animationData: animation.export(),
      num: 1
    })
  },

  addNum: function() { //+数量
    let num = this.data.num
    this.setData({
      num: num + 1
    })

  },
  reduceNum: function(e) { //-数量
    let num = this.data.num;
    if (num == 1) return
    this.setData({
      num: num - 1
    })
  },
  jumpShopCartaa() {
    wx.navigateTo({
      url: '/pages/shopCar-list/shopCar-list'
    })
  },
  jumpShopCart(e) { //跳转购物车
    let _e = e.currentTarget.dataset.id
    let _item = e.currentTarget.dataset.item
    let _arr = this.data.SHOPCARLISTOBJ
    let _fg = true
    for (let i = 0; i < _arr.length; i++) {
      if (_arr[i].id === _e) {
        _arr[i].num = this.data.num
        _arr[i].check = true
        _fg = false
      }
    }
    if (_fg) {
      _item.num = this.data.num
      _arr.unshift(_item)
    }
    this.setData({
      num: 1,
      SHOPCARLISTOBJ: _arr
    })
    this.closeShopCar()
    this.kmShowToast.KMshowToast('添加购物车成功', 1300)
    wx.setStorageSync("SHOPCARLISTOBJ", JSON.stringify(_arr));
  },
  jumpClassInfo: function(e) { //跳转到课程详情
    wx.navigateTo({
      url: '/pages/curriculum-info/curriculum-info?id=' + e.currentTarget.dataset.id
    })
  },

  getListInfo: function(id) { //加载课程列表内容
    let currList = [];
    wx.request({
      url: urlApi.WXGoodDetailByGategoryId,
      data: {
        "categoryId": id,
        "pageIndex": this.page,
        "pageRow": this.data.rows,
      },
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        // list.push(...res.data.arr)
        if (res.data.code == 200) {
          var demo = {};
          var results = res.data.data.results;
          var courseList = [];
          if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
              var banner = {};
              banner.id = results[i].id;
              banner.imgUrl = results[i].picUrl;
              banner.allitem = results[i].allitem || '1';
              banner.tit = results[i].name; //主题
              banner.price = results[i].price; //价格
              banner.classTime = 32
              courseList.push(banner);
            }
            demo.statuCode = res.data.code;
            demo.list = courseList;
            currList.push(demo);
          }
          this.setData({
            totalPage: res.data.data.totalPage, // 总页数
            currList: currList, //数据源
            isCoverFlag: false
          })
        }
      }
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