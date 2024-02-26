import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/api/member/register',
    method: 'post',
    data
  })
}
export function invite_code() {
  return request({
    url: '/api/invite_code',
    method: 'get'
  })
}

//注册短信验证
export function sms_register(data) {
  return request({
    url: '/api/public/sms_register',
    method: 'post',
    data
  })
}

//登录短信验证
export function sms_login(data) {
  return request({
    url: '/api/public/sms_login',
    method: 'post',
    data
  })
}


//登录接口
export function login_from_code(data) {
  return request({
    url: '/api/member/login_from_password',
    method: 'post',
    data
  })
}

//会员信息-修改
export function user_info_edit(data) {
  return request({
    url: '/api/member/info',
    method: 'post',
    data
  })
}

//会员信息
export function user_info() {
  return request({
    url: '/api/member/info',
    method: 'get'
  })
}



//申请认证
export function authentication(data) {
  return request({
    url: '/api/member/authentication',
    method: 'post',
    data
  })
}


//上传
export function uploadImg(data) {
  return request({
    url: '/api/public/file_upload',
    method: 'post',
    data
  })
}

//收款设置-获取
export function payment_config() {
  return request({
    url: '/api/payment/config',
    method: 'get'
  })
}

//收款设置-更改
export function payment_set(data) {
  return request({
    url: '/api/payment/set',
    method: 'post',
    data
  })
}


//收款地址-列表
export function payment_channel() {
  return request({
    url: '/api/payment/channel',
    method: 'get'
  })
}

//收款地址-添加
export function payment_channel_submit(data) {
  return request({
    url: '/api/payment/channel',
    method: 'post',
    data
  })
}

//收款地址-编辑
export function payment_channel_edit(data) {
  return request({
    url: '/api/payment/channel',
    method: 'put',
    data
  })
}


//公告列表
export function notice() {
  return request({
    url: '/api/notice',
    method: 'get'
  })
}


//公告详情
export function notice_detail(id) {
  return request({
    url: `/api/notice/${id}`,
    method: 'get'
  })
}

//会员账户-余额和资金
export function fund_data(params) {
  return request({
    url: `/api/fund/data`,
    method: 'get',
    params
  })
}


//充值订单-列表
export function recharge_list(params) {
  return request({
    url: `/api/recharge`,
    method: 'get',
    params
  })
}
//充值订单-发起充值
export function recharge_submit(data) {
  return request({
    url: `/api/recharge`,
    method: 'post',
    data
  })
}


//资金明细
export function fund_list(params) {
  return request({
    url: `/api/fund/list`,
    method: 'get',
    params
  })
}


//提现列表
export function withdraw_list(params) {
  return request({
    url: `/api/withdraw`,
    method: 'get',
    params
  })
}

//发起体现
export function withdraw_submit(data) {
  return request({
    url: `/api/withdraw`,
    method: 'post',
    data
  })
}



//工单列表
export function workorder_list(data) {
  return request({
    url: ` /api/workorder/list`,
    method: 'post',
    data
  })
}

//添加工单
export function workorder_add(data) {
  return request({
    url: `/api/workorder/store`,
    method: 'post',
    data
  })
}

//工单回复
export function workorder_reply(data) {
  return request({
    url: `/api/workorder/reply_store`,
    method: 'post',
    data
  })
}

//查看工单聊天信息
export function workorder_chat(data) {
  return request({
    url: `/api/workorder/get_chat_history`,
    method: 'post',
    data
  })
}


//工单已解决
export function workorder_resolved(data) {
  return request({
    url: `/api/workorder/resolved_store`,
    method: 'post',
    data
  })
}

//取消工单
export function workorder_cancel(data) {
  return request({
    url: `/api/workorder/cancel_store`,
    method: 'post',
    data
  })
}

//查看工单
export function workorder_detail(data) {
  return request({
    url: `/api/workorder/get_store`,
    method: 'post',
    data
  })
}


//收款-列表
export function collection_list(params) {
  return request({
    url: `/api/collection`,
    method: 'get',
    params
  })
}


//收款-发起或重新发起收款
export function collection_submit(data) {
  return request({
    url: `/api/collection`,
    method: 'post',
    data
  })
}



//款-发起前的数据详情获取
export function collection_detail(data) {
  return request({
    url: `/api/collection/detail`,
    method: 'post',
    data
  })
}


//收款订单-列表
export function order_list(params) {
  return request({
    url: `/api/order/list`,
    method: 'get',
    params
  })
}


//收款订单-订单详情
export function order_detail(id) {
  return request({
    url: `/api/order/detail/${id}`,
    method: 'get',
  })
}


//收款订单-确认合作
export function order_submit(data) {
  return request({
    url: `/api/order/confirm`,
    method: 'post',
    data
  })
}


//收款-取消合作
export function order_cancel(data) {
  return request({
    url: `/api/order/cancel`,
    method: 'post',
    data
  })
}

//收款订单-付款
export function order_paid(data) {
  return request({
    url: `/api/order/paid`,
    method: 'post',
    data
  })
}


//收款订单-我已收款
export function order_received(data) {
  return request({
    url: `/api/order/received`,
    method: 'post',
    data
  })
}

//款订单-发起争议
export function order_argue(data) {
  return request({
    url: `/api/order/argue`,
    method: 'post',
    data
  })
}

//收款订单-发起收款争议
export function order_received_argue(data) {
  return request({
    url: `/api/order/received_argue`,
    method: 'post',
    data
  })
}

//收款订单-申请退款
export function order_refund(data) {
  return request({
    url: `/api/order/refund`,
    method: 'post',
    data
  })
}

//收款订单-退款审核(同意或者不同意)
export function order_refund_examine(data) {
  return request({
    url: `/api/order/refund_examine`,
    method: 'post',
    data
  })
}

//收款订单-发起退款争议
export function order_refund_argue(data) {
  return request({
    url: `/api/order/refund_argue`,
    method: 'post',
    data
  })
}


//收款订单-我已退款
export function order_refunded(data) {
  return request({
    url: `/api/order/refunded`,
    method: 'post',
    data
  })
}


//收款订单-关闭退款
export function order_close_refund(data) {
  return request({
    url: `/api/order/close_refund`,
    method: 'post',
    data
  })
}

//收款订单-确认退款
export function order_confirm_refund(data) {
  return request({
    url: `/api/order/confirm_refund`,
    method: 'post',
    data
  })
}



//收款状态-列表
export function order_options(params) {
  return request({
    url: `/api/order/options`,
    method: 'get',
    params
  })
}
