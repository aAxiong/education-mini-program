const app = getApp()
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadngMsg: '加载中',
    isCoverFlag: false,
    addressItem: {
      id: '', // 地址id
      name: '', // 名字
      sex: 1, // 0 女性  1 男性
      address: '', // 详细地址
      mobile: '', // 电话
      area: '', // 区域
    },
    setAuto: false, // 默认为不设置默认 0 
    region: ['广东省', '深圳市', '宝安区'], // 默认地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.kmcomfirm = this.selectComponent("#kmcomfirm")
    if (app.globalData.addressItem) {
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      this.setData({
        addressItem: app.globalData.addressItem,
        setAuto: app.globalData.addressItem.num === 1 ? true : false
      })
    }
  },
  setAutoHandle() {
    this.setData({
      setAuto: !this.data.setAuto
    })
  },
  ChangeInputHander(e) {
    let _e = e.detail.value
    let _val = e.currentTarget.dataset.val
    this.setData({
      [_val]: _e
    })
  },
  changeSex(e) {
    let _val = Number(e.currentTarget.dataset.ind)

    // let sex = this.data.addressItem.sex
    this.setData({
      'addressItem.sex': _val
    })
  },
  // 区域选择 
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value,
      'addressItem.area': e.detail.value.join('')
    })
  },
  // 保存
  save() {
    let reg = /^1[3|4|5|7|8][0-9]{9}$/
    if (this.data.addressItem.name === '') {
      this.kmShowToast.KMshowToast('请填写收货人姓名', 2000)
      return
    } else if (this.data.addressItem.address === '') {
      this.kmShowToast.KMshowToast('请填写收货人姓名', 2000)
      return
    } else if (this.data.addressItem.mobile === '') {
      this.kmShowToast.KMshowToast('请填写联系电话', 2000)
      return
    } else if (!reg.test(this.data.addressItem.mobile)) {
      this.kmShowToast.KMshowToast('请输入正确的手机号码', 2000)
      return
    }

    this.setData({
      isCoverFlag: true
    })
    var url = '';
    if (this.data.addressItem.id == '') { //新增
      url = urlApi.WXInsertAddress;
    } else { //修改
      url = urlApi.WXUpdateAddress;
    }
    this.data.addressItem.isDefault = this.data.setAuto == false ? 0 : 1; // 是否设置为默认
    this.data.addressItem.area = this.data.region.join(",");
    wx.request({
      url: url,
      data: this.data.addressItem,
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.kmShowToast.KMshowToast('保存成功', 1500)
          this.setData({
            isCoverFlag: false
          })
          wx.setStorage({
            key: "updateAddress",
            data: "true"
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1300)
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
  // 删除按钮点击
  deleteUserHandler() {
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
      url: urlApi.deleteAccountAPI,
      header: util.requestPostHeader(),
      data: this.data.addressItem.id,
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            isCoverFlag: false
          })
          this.kmShowToast.KMshowToast('删除成功', 1500)
          wx.setStorageSync({
            key: 'updateAddress',
            data: "true"
          })
          this.cancelFn()
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1300)
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
  onUnload() {
    app.globalData.addressItem = null
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