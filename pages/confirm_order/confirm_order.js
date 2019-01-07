const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {}, // 地址信息
    goodsList: [{}, {}],
    remak: '', // 留言
    loadngMsg: '加载中',
    isCoverFlag: false,
    allPirce: '' // 总价格 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.setData({
      goodsList: app.globalData.goodsList
    })
    this.getAddressInfo()
    this.computedAllPrice()

  },
  getAddressInfo() {
    // 获取默认信息
    wx.request({
      url: urlApi.WXQueryAddress,
      data: {},
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          app.globalData.addressItem = res.data.data
          this.setData({
            addressInfo: res.data.data
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
  onShow() {
    this.setData({
      addressInfo: app.globalData.addressItem || {}
    })
  },
  // 编辑框输入
  ChangeInputHander(e) {
    let _e = e.detail.value
    let _val = e.currentTarget.dataset.val
    this.setData({
      [_val]: _e
    })
  },
  // 选择地址
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/address/address?type=fromOrder',
    })
  },
  // 计算总金额
  computedAllPrice() {
    let _num = 0
    for (let i = 0; i < this.data.goodsList.length; i++) {
      _num += this.data.goodsList[i].price * this.data.goodsList[i].num
    }
    this.setData({
      allPirce: _num
    })
  },
  // 立即付款
  saveOrder() {
    // let _arr = app.globalData.SHOPCARLISTOBJ // 总数据
    let _list = this.data.goodsList
    if (!this.data.addressInfo.name) {
      this.kmShowToast.KMshowToast('请先添加收货地址', 1500)
    } else {
      var recharge = {};
      for (let i = 0; i < _list.length; i++) {
        _list[i].goodsName = _list[i].tit
        _list[i].goodsId = _list[i].id
        _list[i].number = _list[i].num
        _list[i].price = _list[i].price
        _list[i].totalPrice = _list[i].num * _list[i].price
        _list[i].picUrl = _list[i].imgUrl
        _list[i].classHour = _list[i].classTime
      }
      // recharge.addressInfo = JSON.stringify(this.data.addressInfo) // 收货信息
      recharge.goodsPrice = this.data.allPirce; //  总价格
      recharge.freightPrice = 0; // 配送费
      recharge.couponPrice = 0; // 优惠卷
      recharge.integralScore = 0; // 积分积分
      recharge.orderDetailPreList = JSON.stringify(_list); // 当前商品信息
      recharge.area = this.data.addressInfo.area;
      recharge.phone = this.data.addressInfo.mobile;
      recharge.contactor = this.data.addressInfo.name;
      recharge.address = this.data.addressInfo.address;
      recharge.remaks = this.data.remak
      wx.request({
        url: urlApi.WXOrderPay,
        header: util.requestHeader(),
        data: recharge,
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
                let _arr = []
                for (let i = 0; i < this.data.goodsList.length; i++) {
                  for (let k = 0; k < app.globalData.SHOPCARLISTOBJ.length; k++) {
                    if (this.data.goodsList[i].id === app.globalData.SHOPCARLISTOBJ[k].id) {
                      _arr.push(k)
                    }
                  }
                }
                let ar = app.globalData.SHOPCARLISTOBJ
                for (let j = _arr.length - 1; j >= 0; j--) {
                  ar.splice(j, 1)
                }
                app.globalData.SHOPCARLISTOBJ = ar
                wx.setStorageSync("SHOPCARLISTOBJ", JSON.stringify(ar));
                this.kmShowToast.KMshowToast('支付成功', 1500)
                // setTimeout(() => {
                //   wx.redirectTo({
                //     url: '/pages/payfor_success/payfor_success?money=' + recharge.goodsPrice,
                //   })
                // }, 1200)
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/order-details/order-details?id=' + orderid,
                  })
                }, 1200)
              },
              'fail': (res) => {
                this.kmShowToast.KMshowToast('支付失败', 1500)
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/order-details/order-details?id=' + orderid,
                  })
                }, 1200)
              }
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
    }
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