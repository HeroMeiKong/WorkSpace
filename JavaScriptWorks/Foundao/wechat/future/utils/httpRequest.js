/**
 * Created by DELL on 2018/8/11.
 */
export default function (obj) {
  const {url, method = 'POST', data = {}, success, error} = obj;
  const loginSessionKey = wx.getStorageSync('loginSessionKey');
  wx.request({
    url: url,
    method: method.toUpperCase(),
    header: {
      "auth-token": loginSessionKey,
      "content-type": "application/x-www-form-urlencoded"
    },
    data: {...data},
    success: (resp) => {
      if (success) {
        success(resp)
      }
    },
    fail: () => {
      if (error) {
        error()
      }
    }
  })
}