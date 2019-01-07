const util = require('../../utils/util.js');
const urlApi = require('../../utils/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPage: 1,
    isShowPlaying: true,
    animationData: {},
    videoSrc: '',
    tabActive: 0,
    toView: "c1",
    num: 1,
    infoList: [], //课程详情列表
    commentList: [],
    // commentList: [{ //评论数组
    //   id: 1, //id
    //   nickName: 'lzx', //评论者姓名
    //   avatar: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论者头像
    //   videoUrl: ['https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4', 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4'], //评论视频
    //   imgurl: ['https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png'], //评论图片
    //   content: 'asdasdsa', //评论内容
    //   recoveryList: [{ //二级评论数组
    //     name: 'zzx', //二级评论者姓名
    //     content: '123' //二级评论者评论内容
    //   }]
    // }, { //评论数组
    //   id: 1, //id
    //   nickName: 'lzx', //评论者姓名
    //   avatar: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论者头像
    //   videoUrl: ['https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4', 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4'], //评论视频
    //   imgurl: ['https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png'], //评论图片
    //   content: 'asdasdsa', //评论内容
    //   recoveryList: [{ //二级评论数组
    //     name: 'zzx', //二级评论者姓名
    //     content: '123' //二级评论者评论内容
    //   }]
    // }], 
    //评论详情列表
    loadngMsg: '加载中',
    isCoverFlag: false,
    orderStatus: 0,
    id: '',
    isFree: 0, // 当前课程是否收费 0免费 1收费
    row: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.videoContext = wx.createVideoContext('storeVideo')
    this.kmShowToast = this.selectComponent("#kmShowToast")
    let self = this;
    this.page = 1
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          Proportion: res.windowWidth / 750,
        })
      },
    })
    this.setData({
      isCoverFlag: true
    })
    this.setData({
      id: options.id,
      SHOPCARLISTOBJ: app.globalData.SHOPCARLISTOBJ
    })
    this.getListInfo(options.id, "")
  },
  loadNewList(e) {
    this.setData({
      isCoverFlag: true
    })
    let detailId = e.currentTarget.dataset.id
    this.getListInfo(this.data.id, detailId);
    this.getCommentListInfo(this.data.id, detailId);
  },
  getListInfo(id, detailId) { //加载页面详情
    wx.request({
      url: urlApi.WXGoodDetail,
      data: {
        goodId: id,
        goodDetailId: detailId
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        // this.setData({
        //   isCoverFlag: false
        // })
        if (res.data.code == 200) {
          this.setData({
            infoList: res.data.data, //数据源
          })
          this.getCommentListInfo(this.data.id, res.data.data.goodsDetail && res.data.data.goodsDetail.id || '');
        } else {
          this.setData({
            isCoverFlag: false
          })
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
  getCommentListInfo(id, detailId) { //加载评论详情
    let _commentList = this.data.commentList
    wx.request({
      url: urlApi.WXQueryCommentByPage,
      data: {
        "goodId": id,
        "goodDetailId": '',
        "pageIndex": this.page,
        "pageRow": this.data.row,
        "type": 1
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        this.setData({
          isCoverFlag: false
        })
        if (res.data.code == 200) {
          let commentList = res.data.data.results
          for (var i = 0; i < commentList.length; i++) {
            commentList[i].imgurl = commentList[i].imgUrl && commentList[i].imgUrl.split(',') || []
            commentList[i].videoUrl = commentList[i].videoUrl && commentList[i].videoUrl.split(',') || []
          }
          _commentList.push(...commentList)
          this.setData({
            totalPage: res.data.data.totalPage,
            // commentList: res.data.data.commentList, //数据源
            commentList: _commentList, //数据源
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
  jumpShopCart() { //加入购物车
    wx.request({
      url: '',
      data: {
        id: this.data.id
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          this.kmShowToast.KMshowToast('购买成功', 1300)
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/shopCar-list/shopCar-list'
            })
          }, 1500)
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
  orderChange(e) { //倒序
    let id = e.currentTarget.dataset.id
    let list = this.data.infoList
    list.goodsDetailList.reverse()
    this.setData({
      infoList: list,
      orderStatus: id
    })

  },
  swtichTab(e) {
    this.setData({
      tabActive: e.currentTarget.dataset.index,
      toView: "c" + e.currentTarget.dataset.index
    })
  },
  likeOpt(e) { //点赞
    let id = e.currentTarget.dataset.id
    let like = e.currentTarget.dataset.like
    let infoList = this.data.infoList
    let list = infoList.commentList;
    for (var i = 0, len = list.length; i < len; i++) {
      if (id = list[i].id) {
        list[i].isLike = like;
        if (like == 0) {
          list[i].likeNum--
        } else {
          list[i].likeNum++
        }
      }
    }
    this.setData({
      infoList: infoList
    })
  },
  prevImgsTap(e) {
    let currentImg = e.currentTarget.dataset.url
    let id = e.currentTarget.dataset.id
    wx.previewImage({
      urls: this.data.commentList[id].imgurl,
      current: currentImg
    })
  },
  //视频播放事件
  videoTap(e) {
    this.videoContext = wx.createVideoContext(e.currentTarget.id, this)
    this.videoContext.requestFullScreen()
  },
  bindfullscreenchanges(e) {
    this.videoContext.pause()
  },


  /*购物车*/
  openShopCar: function(e) {
    let _goodsid = this.data.infoList.id
    let _index = e.currentTarget.dataset.index
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    this.setData({
      shopCarType: _index,
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
  quickBuy(e) {
    let num = this.data.num;
    let _goodsList = [{
      imgUrl: this.data.infoList.picUrl, //课程商品头像
      tit: this.data.infoList.name, //课程商品描述
      id: this.data.infoList.id,
      num: num,
      allitem: this.data.infoList.classHour, // 总课时
      price: this.data.infoList.price //课程商品价格
    }]
    app.globalData.goodsList = _goodsList
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order'
    })
  },
  jumpShopCart(e) { //跳转购物车
    let _e = e.currentTarget.dataset.id
    let _item1 = e.currentTarget.dataset.item
    let _item = {
      imgUrl: this.data.infoList.picUrl, //课程商品头像
      tit: this.data.infoList.name, //课程商品描述
      id: this.data.infoList.id,
      num: 1,
      allitem: this.data.infoList.classHour, // 总课时
      price: this.data.infoList.price //课程商品价格
    }
    let _arr = this.data.SHOPCARLISTOBJ
    let _fg = true
    for (let i = 0; i < _arr.length; i++) {
      if (_arr[i].id == _e) {
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.page >= this.data.totalPage) {
      return
    }
    if (this.data.tabActive == 0) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getCommentListInfo(this.data.id, this.data.infoList.goodsDetail.id);
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