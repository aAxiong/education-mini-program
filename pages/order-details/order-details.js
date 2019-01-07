const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadngMsg: '加载中',
    isCoverFlag: false,
    orderid: '',
    telphone: '13006672765', //电话
    // orderInfo: {
    //   name: '张三爸', // 收货人名字
    //   area: '广东省深圳市福田区彩田路新号e都三楼222室', // 收货人地址
    //   goodsList: [{
    //     pic: '/images/pic1.png', //图片
    //     id: 1,
    //     title: '夏天来了，为什么蚊子', //标题
    //     classtime: 36, //课时
    //     UnitPrice: 99, //单价
    //     num: 1
    //   }, {
    //     pic: '/images/pic1.png', //图片
    //     id: 2,
    //     title: '夏天来了，为什么蚊子',
    //     classtime: 2,
    //     UnitPrice: 100,
    //     num: 3
    //   }],
    //   allPrice: 1998.00, //总金额
    //   orderNum: '89765199873932873270', // 订单号
    //   createTime: '2018-11-09 17:28:28', // 下单时间
    //   status: 'recv' // 当前订单状态 pay=>未支付 send=>待发货 recv=>待收货 finish=>已收货
    // }
    orderInfo: '',
    payforTime: '00:00', // 倒计时
    Ispayfor: true // 是否可以付款
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.kmcomfirm = this.selectComponent("#kmcomfirm")
    this.setData({
      orderid: options.id || ''
    })
  },
  onShow() {
    // 根据订单ID获取订单信息
    this.getOrderinfo()
  },
  getPayforTime(addtime, queryTime) {
    // 查询时间 - 下单时间 = 已过多久
    let _time = new Date(queryTime).getTime() - new Date(addtime).getTime()
    // 倒计时长 30 * 60 * 1000
    let _allTime = 30 * 60 * 1000
    // 剩余时长
    let _extraTime = (_allTime - _time) / 1000
    if (_extraTime <= 0) {
      this.setData({
        Ispayfor: false
      })
      return
    }
    // 分钟
    let minutes = parseInt(_extraTime / 60) < 10 ? '0' + parseInt(_extraTime / 60) : parseInt(_extraTime / 60)
    let seconds = _extraTime % 60 < 10 ? '0' + _extraTime % 60 : _extraTime % 60
    this.timeControl = setInterval(() => {
      _extraTime--
      if (_extraTime > 0) {
        // 分钟
        minutes = parseInt(_extraTime / 60) < 10 ? '0' + parseInt(_extraTime / 60) : parseInt(_extraTime / 60)
        seconds = _extraTime % 60 < 10 ? '0' + _extraTime % 60 : _extraTime % 60
        this.setData({
          payforTime: minutes + ':' + seconds
        })
      } else {
        clearInterval(this.timeControl)
        this.setData({
          Ispayfor: false
        })
      }
    }, 1000)

    this.setData({
      payforTime: minutes + ':' + seconds
    })
  },
  // 获取订单信息
  getOrderinfo() {
    wx.request({
      // 这里是删除订单接口
      url: urlApi.WXOrderDetail,
      header: util.requestHeader(),
      data: {
        "orderId": this.data.orderid
      },
      method: 'post',
      success: (res) => {
        if (res.data.code == 200) {
          console.log('ssss' + this.data.orderid);
          var order = {};
          order.name = res.data.data.contactor; //;联系人
          order.area = res.data.data.area + res.data.data.address; //;联系人收货地址
          var goodList = [];
          if (res.data.data.orderDetailList.length > 0) {
            for (var i = 0; i < res.data.data.orderDetailList.length; i++) {
              var good = {};
              good.pic = res.data.data.orderDetailList[i].picUrl;
              good.id = res.data.data.orderDetailList[i].id;
              good.title = res.data.data.orderDetailList[i].goodsName;
              good.classtime = res.data.data.orderDetailList[i].classHour;
              good.UnitPrice = res.data.data.orderDetailList[i].price;
              good.num = res.data.data.orderDetailList[i].number;
              goodList.push(good);
            }
          }
          order.goodsList = goodList;
          order.allPrice = res.data.data.orderPrice;
          order.createTime = res.data.data.addTime;
          order.orderNum = res.data.data.orderCode;
          order.status = res.data.data.statusStr;
          this.setData({
            orderInfo: order,
            telphone: res.data.data.phone
          })
          // 记得补充查询时间
          this.getPayforTime(res.data.data.addTime, res.data.data.queryTime)
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
  telPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.telphone //仅为示例，并非真实的电话号码
    })
  },
  gocomment(tp) {
    let _e = tp.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + _e + '&type=order'
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
      header: util.requestHeader(),
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
        orderid: _e
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            isCoverFlag: false
          })
          this.kmShowToast.KMshowToast('确认成功', 1500)
          this.getOrderinfo()
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
  saveOrder() {
    wx.request({
      url: urlApi.WXPreGetpretpay,
      header: util.requestHeader(),
      data: {
        "orderId": this.data.orderid
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
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              console.log(res);
            }
          });
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  onUnload() {
    clearInterval(this.timeControl)
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