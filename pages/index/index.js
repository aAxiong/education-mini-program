const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    loadngMsg: '加载中',
    loadingFlag: false,
    tabActive: "2", // 2每日推荐 0家庭作业 1在线答题
    rows: 10, // 每页条目
    totalPage: '', //总页数
    indexList: '',
    homeTaskList: [],
    // homeTaskList: [{
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 1,
    //   "title": " 科普月科学实验课1 ",
    //   "finshen": 26,
    //   "total": 60,
    //   "type": 0
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 2,
    //   "title": " 科普月科学实验课2 ",
    //   "finshen": 26,
    //   "total": 60,
    //   "type": 0
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 3,
    //   "title": " 科普月科学实验课4 ",
    //   "finshen": 60,
    //   "total": 60,
    //   "type": 1
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 4,
    //   "title": " 科普月科学实验课3 ",
    //   "finshen": 26,
    //   "total": 60,
    //   "type": 1
    // }],
    onlineSubjectList: [],
    // onlineSubjectList: [{
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 4,
    //   "title": " 科普月科学实验课3 ",
    //   "finshen": 26,
    //   "total": 60,
    //   "type": 1,
    //   "totalFraction": 60
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 3,
    //   "title": " 科普月科学实验课3 ",
    //   "finshen": 26,
    //   "total": 60,
    //   "type": 1,
    //   "totalFraction": 60
    // }],
    remocoList: [], //每日推荐
    // remocoList: [{
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 0,
    //   "title": " 艾克斯科学实验室走进社区科普嘉年华 ",
    //   "intfomation": "艾克斯科学实验室创新户外课程",
    //   "type": 1
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 1,
    //   "title": " 艾克斯科学实验室走进社区科普嘉年华 ",
    //   "intfomation": "艾克斯科学实验室创新户外课程",
    //   "type": 0
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 2,
    //   "title": " 艾克斯科学实验室走进社区科普嘉年华 ",
    //   "intfomation": "艾克斯科学实验室创新户外课程",
    //   "type": 0
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 3,
    //   "title": " 艾克斯科学实验室走进社区科普嘉年华 ",
    //   "intfomation": "艾克斯科学实验室创新户外课程",
    //   "type": 0
    // }, {
    //   "imgUrl": "/images/bg.jpg",
    //   "id": 4,
    //   "title": " 艾克斯科学实验室走进社区科普嘉年华 ",
    //   "intfomation": "艾克斯科学实验室创新户外课程",
    //   "type": 0
    // }],
    date: '2015-09-01',
    finshStatus: 0,
    count: 10
  },
  onLoad() {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.page = 1
    let myDate = new Date()
    let date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
    this.setData({
      date: date
    })
  },
  onShow() {
    // this.kmShowToast.KMshowToast('弹窗', 1500)
    wx.getStorage({
      key: 'loginMsg',
      success: (res) => {
        if (!app.globalData.userInfo && res.data) {
          // 如果已授权 且未获取到微信数据 则登陆
          console.log(res)
          this.loginFunc(JSON.parse(res.data)) // 请求登录
        } else {
          this.page = 1;
          this.setData({
            homeTaskList: [],
            onlineSubjectList: [],
            remocoList: [],
          })
          this.setData({
            loadingFlag: false
          });
          this.getBannerInfo();
          this.getListInfo(this.data.tabActive);
        }
      }
    });
  },
  getBannerInfo() { //加载banner
    let indexList = [];
    wx.request({
      url: urlApi.WXBannerUrl,
      data: {},
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        //indexList.push(...res.data.data)
        if (res.data.code == 200) {
          var demo = {};
          var sliderList = [];
          if (res.data.data.length > 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              var banner = {};
              banner.id = res.data.data[i].id;
              banner.imgUrl = res.data.data[i].imageUrl;
              sliderList.push(banner);
            }
            demo.statuCode = res.data.code;
            demo.sliderList = sliderList;
            indexList.push(demo);
          }
          this.setData({
            indexList: indexList, //数据源
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
  // 首页每日推荐
  getremocoList() {
    wx.request({
      url: urlApi.WXSelectIsHostObject,
      data: {
        pageIndex: this.page,
        pageRow: 5
      },
      header: util.requestHeader(),
      method: 'GET',
      success: (res) => {
        if (res.data.code == 200) {
          let _arr = []
          let _list = this.data.remocoList
          for (let i = 0; i < res.data.data.results.length; i++) {
            let demo = {
              "imgUrl": res.data.data.results[i].imgUrl,
              "id": res.data.data.results[i].id,
              "title": res.data.data.results[i].title,
              "intfomation": res.data.data.results[i].intfomation,
              "type": res.data.data.results[i].type
            }
            _arr.push(demo)
          }
          _list.push(..._arr)
          this.setData({
            totalPage: res.data.data.totalPage, // 总页数
            remocoList: _list, //数据源
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
  getListInfo: function(types) { //加载列表
    if (types === "2") { // 每日推荐
      this.setData({
        isCoverFlag: false
      })
      this.getremocoList()
    }
    wx.request({
      url: urlApi.WXQueryExamRecordList,
      data: {
        pageIndex: this.page,
        type: types, // 1 在线答题 0 家庭作业
        pageRow: this.data.count,
        // '2018-11-27' ||
        date: this.data.date,
        status: this.data.finshStatus // 是否完成 0 否 1 是
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          let _arr = []
          if (types === "0") {
            let _list = this.data.homeTaskList
            for (let i = 0; i < res.data.data.results.length; i++) {
              let demo = {
                "imgUrl": res.data.data.results[i].picUrl,
                "id": res.data.data.results[i].id,
                "title": res.data.data.results[i].subjectName,
                "finshen": res.data.data.results[i].currentQuestionNum,
                "total": res.data.data.results[i].number,
                "totalFraction": res.data.data.results[i].totalScore
              }
              _arr.push(demo)
            }
            _list.push(..._arr)
            this.setData({
              totalPage: res.data.data.totalPage, // 总页数
              homeTaskList: _list, //数据源
              isCoverFlag: false
            })
          } else {
            let _list = this.data.onlineSubjectList
            for (let i = 0; i < res.data.data.results.length; i++) {
              let demo = {
                "imgUrl": res.data.data.results[i].picUrl,
                "id": res.data.data.results[i].id,
                "title": res.data.data.results[i].subjectName,
                "finshen": res.data.data.results[i].currentQuestionNum,
                "total": res.data.data.results[i].number,
                "type": 1,
                "totalFraction": res.data.data.results[i].totalScore
              }
              _arr.push(demo)
            }
            _list.push(..._arr)
            this.setData({
              totalPage: res.data.data.totalPage, // 总页数
              onlineSubjectList: _list, //数据源
              isCoverFlag: false
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
  /**
   * 页面上拉触底事件的处理函数y
   */
  onReachBottom: function() {
    if (this.page >= this.data.totalPage) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getListInfo(this.data.tabActive)
  },

  loginFunc: function(dataS) {
    this.setData({
      loadngMsg: '加载中',
      loadingFlag: true
    });
    app.globalData.userInfo = dataS;
    util.UserLogin(() => {
      this.page = 1;
      this.setData({
        homeTaskList: [],
        onlineSubjectList: [],
        remocoList: [],
      })
      this.setData({
        loadingFlag: false
      });
      this.getBannerInfo();
      this.getListInfo(this.data.tabActive);
    })
  },
  getInfo() {
    wx.request({
      url: urlApi.indexDataAPI,
      data: {},
      method: 'POST',
      header: util.requestHeader(),
      success: (res) => {}
    })
  },
  swtichTab(e) { //切换导航
    this.setData({
      tabActive: e.currentTarget.dataset.index,
      homeTaskList: [],
      onlineSubjectList: [],
      remocoList: [],
      isCoverFlag: true
    })
    this.page = 1;
    this.getListInfo(this.data.tabActive)
  },
  changeWork(e) { //切换家庭作业 完成列表
    this.setData({
      finshStatus: e.currentTarget.dataset.index,
      homeTaskList: []
    })
    this.page = 1;
    this.getListInfo(this.data.tabActive)
  },
  bindDateChange(e) { //时间监听
    this.setData({
      date: e.detail.value,
      isCoverFlag: true,
      homeTaskList: []
    })
    this.page = 1;
    this.getListInfo(this.data.tabActive)
  },
  jumpClassPage(e) { //跳转
    let id = e.currentTarget.dataset.id
    let _type = e.currentTarget.dataset.type
    if (_type === 2) {
      wx.navigateTo({
        url: '/pages/curriculum-info/curriculum-info?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/pic_details/pic_details?id=' + id,
      })
    }
  },
  homeWorkAnswer(e) { //家庭作业跳转
    let tel = app.globalData.tel
    let id = e.currentTarget.dataset.id
    let types = e.currentTarget.dataset.type
    let _tit = e.currentTarget.dataset.title
    console.log(e.currentTarget.dataset)
    app.globalData.answerTitle = _tit
    if (tel == null || tel == "") {
      wx.navigateTo({
        url: '/pages/verification/verification?type=0&id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/homeSubject/homeSubject?type=' + types + '&id=' + id,
      })
    }
  },
  onlineAnswer(e) { //在线答题跳转
    let tel = app.globalData.tel
    let id = e.currentTarget.dataset.id
    if (tel == null || tel == "") {
      wx.navigateTo({
        url: '/pages/verification/verification?type=1&id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/homeSubject/homeSubject?type=1&id=' + id,
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