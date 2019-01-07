const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TotalSelection: false,
    totalPage: '',
    list: [{
      price: 198,
      id: 8945441,
    }],
    classList: [{
      status: 200,
      list: [{
        pic: '/images/pic1.png', //图片
        id: 1,
        title: '夏天来了，为什么蚊子', //标题
        classtime: 36, //课时
        price: 99, //单价
        num: 1
      }, {
        pic: '/images/pic1.png', //图片
        id: 2,
        title: '夏天来了，为什么蚊子',
        classtime: 2,
        price: 100,
        num: 3
      }, {
        pic: '/images/pic1.png', //图片
        id: 3,
        title: '夏天来了，为什么蚊子',
        classtime: 2,
        price: 100,
        num: 3
      }, {
        pic: '/images/pic1.png', //图片
        id: 4,
        title: '夏天来了，为什么蚊子',
        classtime: 2,
        price: 100,
        num: 3
      }, {
        pic: '/images/pic1.png', //图片
        id: 5,
        title: '夏天来了，为什么蚊子',
        classtime: 2,
        price: 100,
        num: 3
      }]
    }],
    total: 0,
    payDesc: 0,
    loadngMsg: '加载中',
    isCoverFlag: false,
  },
  onLoad: function(options) {
    // this.setData({
    //   isCoverFlag: true
    // })
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.page = 1
    let classList = [{
      status: 200,
      list: app.globalData.SHOPCARLISTOBJ
    }]
    this.setData({
      classList: classList
    })
    this.allChose()
    // this.getListInfo();
  },
  addNum: function(e) {
    let id = e.currentTarget.dataset.id
    let classList = this.data.classList;
    for (var i = 0; i < classList[0].list.length; i++) {
      if (classList[0].list[i].id == id) {
        classList[0].list[i].num++
      }
    }
    this.setData({
      classList: classList,
      payDesc: this.payDesc()
    })

  },
  reduceNum: function(e) {
    let id = e.currentTarget.dataset.id
    let classList = this.data.classList;
    for (var i = 0; i < classList[0].list.length; i++) {
      if (classList[0].list[i].id == id) {
        if (classList[0].list[i].num == 1) return
        classList[0].list[i].num--
      }
    }
    this.setData({
      classList: classList,
      payDesc: this.payDesc()
    })
  },
  payDesc: function() { //计算总价
    let classList = this.data.classList;
    let payDesc = 0;
    for (var i = 0; i < classList[0].list.length; i++) {
      if (classList[0].list[i].check == true) {
        payDesc += classList[0].list[i].price * classList[0].list[i].num
        // console.log(payDesc);
      }
    }
    return payDesc
  },
  // getListInfo(e) { //加载购物车列表
  //   let classList = this.data.classList
  //   wx.request({
  //     url: '',
  //     data: {},
  //     header: util.requestHeader(),
  //     method: 'GET',
  //     success: (res) => {
  //       if (res.data.code == 200) {
  //         classList.push(...res.data.arr)
  //         let classList = this.data.classList[0].list;
  //         for (var i = 0; i < classList[0].list.length; i++) {
  //           classList[0].list[i].check = true
  //         }
  //         this.setData({
  //           isCoverFlag: false,
  //           totalPage: '',
  //           classList: classList, //数据源
  //         })
  //         this.setData({
  //           payDesc: this.payDesc()
  //         })
  //       } else {
  //         if (res.data.code == 403) {
  //           util.resetSessionId();
  //           return;
  //         }
  //         wx.showModal({
  //           title: '提示',
  //           content: res.data.msg,
  //           showCancel: false,
  //           success: function(r) {
  //             console.log(r);
  //           }
  //         });
  //       }
  //     }
  //   })
  // },
  allChose: function() { //全选
    let classList = this.data.classList;
    if (this.data.TotalSelection == false) {
      for (var i = 0; i < classList[0].list.length; i++) {
        classList[0].list[i].check = true
      }
      this.setData({
        TotalSelection: true
      })

    } else {
      for (var i = 0; i < classList[0].list.length; i++) {
        classList[0].list[i].check = false
      }
      this.setData({
        TotalSelection: false
      })
    }
    this.setData({
      classList: classList,
      payDesc: this.payDesc()
    })
  },
  uniceChose(e) { //单选
    let id = e.currentTarget.dataset.id
    let classList = this.data.classList;
    let _num = 0
    for (var i = 0; i < classList[0].list.length; i++) {
      if (id == classList[0].list[i].id) {
        if (classList[0].list[i].check == true) {
          classList[0].list[i].check = false
        } else {
          classList[0].list[i].check = true
        }
      }
      if (classList[0].list[i].check) {
        _num++
      }
    }
    this.setData({
      classList: classList,
      payDesc: this.payDesc(),
      TotalSelection: _num === classList[0].list.length
    })
  },
  // 立即购买按钮
  goBuy() {
    let _goodsList = []
    for (let i = 0; i < this.data.classList[0].list.length; i++) {
      if (this.data.classList[0].list[i].check === true) {
        _goodsList.push(this.data.classList[0].list[i])
      }
    }
    if (_goodsList.length === 0) {
      this.kmShowToast.KMshowToast('请勾选需要付款的商品', 1500)
      return
    }
    app.globalData.goodsList = _goodsList
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order',
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