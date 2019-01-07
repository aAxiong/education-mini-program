const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '', // 订单id
    status: '', // 订单状态  signin: 已签收  send:  派件中   transit: 运输中
    InfoList: [],
    createtime: '2016-06-14 21:46:45', // 下订单时间
    company: '顺丰快递', //配送商
    no: 'SF08754689908', // 快递编号
    // logisticsInfo: {
    //   "resultcode": "200",
    //   "reason": "查询成功",
    //   "result": {
    //     "company": "中通",
    //     "com": "zto",
    //     "no": "213816108506",
    //     "status": "1",
    //     "list": [{
    //         "datetime": "2018-07-01 17:19:34",
    //         "remark": "【玉林市】  【百香果市场二部】（0775-6350068） 的 谢显煌 （13768980139） 已揽收",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-01 23:08:25",
    //         "remark": "【玉林市】  快件离开 【百香果市场二部】 发往 【东莞中心】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 10:20:00",
    //         "remark": "【东莞市】  快件到达 【东莞中心】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 10:26:01",
    //         "remark": "【东莞市】  快件离开 【东莞中心】 发往 【深圳中心】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 11:36:55",
    //         "remark": "【深圳市】  快件到达 【深圳中心】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 11:47:16",
    //         "remark": "【深圳市】  快件离开 【深圳中心】 发往 【南山前海】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 15:03:51",
    //         "remark": "【深圳市】  快件到达 【南山前海】",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 15:14:08",
    //         "remark": "【深圳市】  【南山前海】 的林木清（18319417736） 正在第1次派件, 请保持电话畅通,并耐心等待",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 16:01:20",
    //         "remark": "【深圳市】  快件已被 【丰巢的嘉南美地(丰巢智能快递柜)】 代收, 如有问题请电联（18319417736 \/ 4000633333,18319417736）, 感谢使用中通快递, 期待再次为您服务!",
    //         "zone": ""
    //       },
    //       {
    //         "datetime": "2018-07-02 21:58:36",
    //         "remark": "【深圳市】  已签收, 签收人凭取货码签收, 如有疑问请电联: 18319417736 \/ 4000633333,18319417736, 您的快递已经妥投, 如果您对我们的服务感到满意, 请给个五星好评, 鼓励一下我们【请在评价快递员处帮忙点亮五颗星星哦~】",
    //         "zone": ""
    //       }
    //     ]
    //   },
    //   "error_code": 0
    // }
    logisticsInfo: '',
    pirUrl: '/images/pic1.png', //商品图片
    Allcount: 3, //商品总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        orderid: options.id
      })
    }
    var logisticsInfo = {};
    wx.request({
      url: urlApi.WXGetShippingInfo,
      data: {
        "orderId": this.data.orderid
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          logisticsInfo.resultcode = "200";
          logisticsInfo.reason = "查询成功";
          var result = {};
          result.company = res.data.data.company;
          result.com = res.data.data.com;
          result.no = res.data.data.no;
          result.status = "1";
          var list = [];
          if (res.data.data.list.length > 0) {
            for (var i = 0; i < res.data.data.list.length; i++) {
              var demo = {};
              demo.datetime = res.data.data.list[i].dateTime;
              demo.remark = res.data.data.list[i].remark;
              list.push(demo);
            }
            result.list = list;
          }
          logisticsInfo.result = result;
          this.setData({
            logisticsInfo: logisticsInfo, //数据源
            company: res.data.data.company,
            com: res.data.data.com,
            no: res.data.data.no
          })
          this.reserveJson(this.data.logisticsInfo);
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
  // 获取到json数据后进行数据重组
  reserveJson(logisticsInfo) {
    const regex = /\【([^()]+)\】/g; // [] 中括号
    let _list = logisticsInfo.result.list.reverse()
    let str = JSON.stringify(_list)
    if (str.indexOf('揽件') !== -1 || str.indexOf('收件') !== -1 || str.indexOf('转运') !== -1 || str.indexOf('运输') !== -1 || str.indexOf('发往') !== -1 ||
      str.indexOf('发出') !== -1 || str.indexOf('收入') !== -1 || str.indexOf('扫描') !== -1 || str.indexOf('到达') !== -1) {
      this.setData({
        status: 'transit'
      })
    }
    if (str.indexOf('派送') !== -1 || str.indexOf('派件') !== -1) {
      this.setData({
        status: 'send'
      })
    }
    if (str.indexOf('签收') !== -1) {
      this.setData({
        status: 'signin'
      })
    }
    _list.forEach(item => {
      if (item.datetime) {
        item.date = item.datetime.split(' ')[0].split('-')[1] + '-' + item.datetime.split(' ')[0].split('-')[2]
        item.times = item.datetime.split(' ')[1].split(':')[0] + '-' + item.datetime.split(' ')[1].split(':')[1]
      }
      if (item.remark.indexOf('签收') !== -1) {
        item.status = 'signin'
      } else if (item.remark.indexOf('收件') !== -1 || item.remark.indexOf('揽件') !== -1 || item.remark.indexOf('揽收') !== -1) {
        item.status = 'transit'
      }
      // item.area = item.remark.match(/([^\【\】]+)(?=\】)/g)[0]
      // item.remark = item.remark.replace(/\【.*?\】/g, '')
    })
    if (_list[0].remark.indexOf('签收') === -1) {
      _list[0].status = 'transit'
    }
    _list.push({
      remark: '卖家已发货',
      date: this.data.createtime.split(' ')[0].split('-')[1] + '-' + this.data.createtime.split(' ')[0].split('-')[2],
      times: this.data.createtime.split(' ')[1].split(':')[0] + '-' + this.data.createtime.split(' ')[1].split(':')[1],
      status: 'sendGoods',
    })
    this.setData({
      InfoList: _list
    })
    console.log(_list)
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