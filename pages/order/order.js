const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'all', // 默认全部
    orderList: [],
    // orderList: [{
    //   status: 'finish', // 当前订单状态 pay=>未支付 send=>待发货 recv=>待收货 finish=>已收货
    //   orderid: 1, // 订单id
    //   goods: [{ // 商品list
    //     id: 1, //商品id
    //     pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', //商品图片
    //     title: '这是商品标题12312132这是商品标题12312132', //商品标题
    //     allitem: '36', // 共几节课
    //     number: 3,
    //     price: '99.00', //商品总价
    //   }, { // 商品list
    //     id: 1, //商品id
    //     pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', //商品图片
    //     title: '这是商品标题12312132这是商品标题12312132', //商品标题
    //     allitem: '36', // 共几节课
    //     number: 3,
    //     price: '99.00', //商品总价
    //   }],
    //   allPirce: '99', //当前订单总价格
    // }, {
    //   status: 'send', // 当前订单状态 pay=>未支付 send=>待发货 recv=>待收货 finish=>已收货
    //   orderid: 2, // 订单id
    //   goods: [{ // 商品list
    //     id: 1, //商品id
    //     pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', //商品图片
    //     title: '这是商品标题12312132这是商品标题12312132', //商品标题
    //     allitem: '36', // 共几节课
    //     number: 3,
    //     price: '99.00', //商品总价
    //   }],
    //   allPirce: '99', //当前订单总价格
    // }],
    rows: 10, // 每页条目
    totalPage: '', //总页数
    loadngMsg: '加载中',
    isCoverFlag: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.page = 1
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.kmcomfirm = this.selectComponent("#kmcomfirm")
    if (options.tp) {
      this.setData({
        active: options.tp
      })
    }
    this.getListInfo()
  },
  onShow() {
    // 针对代付款订单是否操作过订单支付
    wx.getStorage({
      key: 'ISUPDATEORDERINFO',
      success: function(res) {
        wx.removeStorageSync('ISUPDATEORDERINFO')
        this.page = 1
        this.setData({
          orderList: []
        })
        this.getListInfo()
      },
    })
  },
  // 获取数据
  getListInfo() {
    let _orderList = this.data.orderList
    wx.request({
      url: urlApi.WXOrderList,
      data: {
        "pageIndex": this.page,
        "pageRow": this.data.rows,
        "status": this.data.active
      },
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          var results = res.data.data.results;
          let _list = []
          if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
              var order = {};
              order.status = results[i].statusStr; //前端状态标识
              order.orderid = results[i].id;
              order.allPirce = results[i].orderPrice; //价格
              order.addtime = results[i].addTime
              order.queryTime = results[i].queryTime
              var goodResults = results[i].orderDetailList || []; //订单商品详情
              order.goods = []
              if (goodResults && goodResults.length > 0) {
                for (var j = 0; j < goodResults.length; j++) {
                  var item = {};
                  item.id = goodResults[j].goodsId;
                  item.pic = goodResults[j].picUrl; //图片路径
                  item.allitem = goodResults[j].classHour; //课时
                  item.number = goodResults[j].number; //商品数量
                  item.price = goodResults[j].totalPrice; //
                  order.goods.push(item);
                }
              }
              _list.push(order);
            }
          }
          _orderList.push(..._list)
          this.setData({
            totalPage: res.data.data.totalPage, // 总页数
            orderList: _orderList, //数据源
            isCoverFlag: false
          })
          this.InitTime()
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

  // 切换
  ChangeTab(tp) {
    let _e = tp.currentTarget.dataset.tab
    this.setData({
      active: _e
    })
    this.page = 1
    this.setData({
      orderList: [],
      isCoverFlag: true
    })
    this.getListInfo()
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.page >= this.data.totalPage) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getListInfo()
  },
  // 查看物流
  lookLogistics(tp) {
    let _e = tp.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/logistics/logistics?id=' + _e
    })
  },
  // 前往订单详情
  gotoDetails(tp) {
    let _e = tp.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/order-details/order-details?id=' + _e
    })
  },
  //前往评论
  gocomment(tp) {
    // 当前商品id
    let _e = tp.currentTarget.dataset.goodsid
    console.log(_e)
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + _e + '&type=goods'
    })
  },
  // 删除按钮点击
  deleteUserHandler(tp) {
    this.$orderid = tp.currentTarget.dataset.orderid
    this.kmcomfirm.show()
  },
  // 取消
  cancelFn() {
    this.kmcomfirm.hide()
  },
  // 删除
  surelFn() {
    this.setData({
      isCoverFlag: true
    })
    wx.request({
      // 这里是删除订单接口
      url: urlApi.deleteAccountAPI,
      header: util.requestPostHeader(),
      data: {
        orderid: this.$orderid
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            isCoverFlag: false
          })
          this.cancelFn()
          this.kmShowToast.KMshowToast('取消成功', 1500)
          this.page = 1
          this.setData({
            orderList: []
          })
          this.getListInfo()
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
  // 确认收货
  resureGet(tp) {
    // 当前订单id
    let _e = tp.currentTarget.dataset.orderid
    wx.request({
      // 确认收货
      url: urlApi.WXConfirmGetOrder,
      header: util.requestPostHeader(),
      data: {
        "orderId": _e
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            isCoverFlag: false
          })
          this.kmShowToast.KMshowToast('确认成功', 1500)
          this.page = 1
          this.setData({
            orderList: []
          })
          this.getListInfo()
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

  // 立即付款
  saveOrder(tp) {
    let _id = tp.currentTarget.dataset.orderid
    wx.request({
      url: urlApi.WXPreGetpretpay,
      header: util.requestHeader(),
      data: {
        "orderId": _id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          let orderid = res.data.orderId;
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': (res) => {
              wx.setStorage({
                key: 'ISUPDATEORDERINFO',
                data: 'true',
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/order-details/order-details?id=' + orderid,
                })
              }, 1200)
            },
            'fail': (res) => {}
          })
        } else {
          if (res.data.code == 403) {
            util.resetSessionId();
            return;
          }
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          //   showCancel: false,
          //   success: function(res) {
          //     console.log(res);
          //   }
          // });
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  // 初始化倒计时
  InitTime() {
    let _arr = this.data.orderList
    //_arr[i].queryTime
    let _allTime = 30 * 60 * 1000
    for (let i = 0; i < _arr.length; i++) {
      if (_arr[i].status === 'pay') {
        let _time = new Date(_arr[i].queryTime).getTime() - new Date(_arr[i].addtime).getTime()
        let _extraTime = (_allTime - _time) / 1000
        if (_extraTime <= 0) {
          _arr[i].isoverdue = true
        } else {
          _arr[i].isoverdue = false
          let _minutes = parseInt(_extraTime / 60) < 10 ? '0' + parseInt(_extraTime / 60) : parseInt(_extraTime / 60)
          let _seconds = _extraTime % 60 < 10 ? '0' + _extraTime % 60 : _extraTime % 60
          _arr[i].payforTime = _minutes + ':' + _seconds
          _arr[i].extraTime = _extraTime
        }
      }
    }
    this.setData({
      orderList: _arr
    })
    this.getPayforTime()
  },
  // 倒计时
  getPayforTime() {
    clearInterval(this.orderTime)
    let _arr = this.data.orderList
    let _len = _arr.length
    let sum = 0; // 多少个已过期的
    let _allTime = 30 * 60 * 1000
    this.orderTime = setInterval(() => {
      for (let i = 0; i < _arr.length; i++) {
        if (_arr[i].status === 'pay') {
          if (!_arr[i].isoverdue) {
            let _extraTime = _arr[i].extraTime
            _extraTime--
            if (_extraTime <= 0) {
              _arr[i].isoverdue = true
              sum++
            } else {
              let _minutes = parseInt(_extraTime / 60) < 10 ? '0' + parseInt(_extraTime / 60) : parseInt(_extraTime / 60)
              let _seconds = _extraTime % 60 < 10 ? '0' + _extraTime % 60 : _extraTime % 60
              _arr[i].payforTime = _minutes + ':' + _seconds
              _arr[i].extraTime = _extraTime
            }
          } else {
            sum++
          }
        }
      }
      if (sum === _len) {
        clearInterval(this.orderTime)
      }
      this.setData({
        orderList: _arr
      })
    }, 1000)
  },
  onUnload() {
    clearInterval(this.orderTime)
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