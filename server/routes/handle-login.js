const router = require('koa-router')();
const axios = require('axios');

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = router.post('/api/login', async (ctx, next) => {
  try {
    const res = await axios.post(`${baseUrl}/accesstoken`, {
      accesstoken: ctx.request.body.accessToken
    })
    if (res.status === 200 && res.data.success) {
      ctx.session.user = {
        accessToken: ctx.request.body.accessToken,
        loginName: res.data.loginname,
        id: res.data.id,
        avatarUrl: res.data.avatar_url
      }
      ctx.status = 200;
      ctx.body = res.data
    }
  } catch (err) {
    if (err.response) {
      ctx.body = {
        success: false,
        data: err.response.data
      }
    } else {
      next(err);
    }
  }
})
