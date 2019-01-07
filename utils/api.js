var url01 = 'https://dogs.xingjinkj.com/xlab/'; //APi地址  https://dogs.xingjinkj.com/xlab/  http://localhost:8080
const WeCharLogin = url01 + '/api/user/wxAuth'; //登录
const WXBannerUrl = url01 + '/api/sysBanner/queryList'; //首页banner
const WXGoodCategoryList = url01 + '/api/good/queryGoodCategoryList'; //课程页面商品分类
const WXGoodDetailByGategoryId = url01 + '/api/good/queryFoodsByCategoryId'; //查找分类下的商品
const WXGoodDetail = url01 + '/api/good/queryGoodDetail'; //查找商品详情 查找多个子课程
const WXOrderPay = url01 + '/api/wxPay/order_pay'; //订单预支付
const WXOrderList = url01 + '/api/xlabOrder/queryOrderList'; //订单列表
const WXOrderDetail = url01 + '/api/xlabOrder/order_detail'; //订单详情 queryFreeGoodList
const WXGetShippingInfo = url01 + '/api/xlabOrder/get_shipping_info'; //查看物流信息
const WXQueryFreeGoodList = url01 + '/api/good/queryFreeGoodList'; //查看免费的课程列表
const WXQueryUserInfo = url01 + '/api/user/userInfo'; //查看用户信息
const WXInsertStuApply = url01 + '/api/apply/insertStuApply'; //新增在线报名记录
const WXInsertCustomerApply = url01 + '/api/apply/insertCustomerApply'; //新增在线加盟记录
const WXAddressList = url01 + '/api/customerAddress/addressList'; //地址列表
const WXInsertAddress = url01 + '/api/customerAddress/insertAddress'; //新增地址
const WXUpdateAddress = url01 + '/api/customerAddress/updateAddress'; //更新地址
const WXQueryAddress = url01 + '/api/customerAddress/queryDefaultAddress'; //获取当前默认地址
const WXQueryExamRecordList = url01 + '/api/exam/queryExamRecordList'; //首页家庭作业和在线答题目录
const WXQueryExamQuestions = url01 + '/api/exam/queryExamQuestions'; //查找题目详情列表
const WXInsertExamRecord = url01 + '/api/exam/insertExamRecord'; //用户答题
const WXUploadFile = url01 + '/api/upload/uploadFile'; //上传图片路径
const WXConfirmGetOrder = url01 + '/api/xlabOrder/confirmGetOrder'; //确认收货
const WXPreGetpretpay = url01 + '/api/xlabOrder/pre_get_prePay'; //重新吊起支付
const WXQueryCommentByPage = url01 + '/api/good/queryCommentByPage'; //评论分页
const WXQueryQuestionCommentByPage = url01 + '/api/exam/queryQuestionCommentByPage'; //评论分页
const WXInsertUserComment = url01 + '/api/good/insertUserComment'; //新增评论
const WXSelectIsHostObject = url01 + '/api/news/selectIsHostObject'; //分页
const WXSelectNewsDetail = url01 + '/api/news/selectNewsDetail'; //详情 "/selectNewsDetail/{id}",
module.exports = {
  WeCharLoginAPI: WeCharLogin,
  WXBannerUrl: WXBannerUrl,
  WXGoodCategoryList: WXGoodCategoryList,
  WXGoodDetailByGategoryId: WXGoodDetailByGategoryId,
  WXGoodDetail: WXGoodDetail,
  WXOrderPay: WXOrderPay,
  WXOrderList: WXOrderList,
  WXOrderDetail: WXOrderDetail,
  WXGetShippingInfo: WXGetShippingInfo,
  WXQueryFreeGoodList: WXQueryFreeGoodList,
  WXQueryUserInfo: WXQueryUserInfo,
  WXInsertStuApply: WXInsertStuApply,
  WXInsertCustomerApply: WXInsertCustomerApply,
  WXAddressList: WXAddressList,
  WXInsertAddress: WXInsertAddress,
  WXUpdateAddress: WXUpdateAddress,
  WXQueryAddress: WXQueryAddress,
  WXQueryExamRecordList: WXQueryExamRecordList,
  WXQueryExamQuestions: WXQueryExamQuestions,
  WXInsertExamRecord: WXInsertExamRecord,
  WXUploadFile: WXUploadFile,
  WXConfirmGetOrder: WXConfirmGetOrder,
  WXPreGetpretpay: WXPreGetpretpay,
  WXQueryCommentByPage: WXQueryCommentByPage,
  WXInsertUserComment: WXInsertUserComment,
  WXSelectIsHostObject: WXSelectIsHostObject,
  WXSelectNewsDetail: WXSelectNewsDetail,
  WXQueryQuestionCommentByPage: WXQueryQuestionCommentByPage

}