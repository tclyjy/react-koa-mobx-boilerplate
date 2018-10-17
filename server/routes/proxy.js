const router = require('koa-router')();
const axios = require('axios');
const queryString = require('query-string');

const baseUrl = 'https://cnodejs.org/api/v1'
module.exports = router.all('/api/*', async (ctx, next) => {
  const path = ctx.path;
  const user = ctx.session.user
  const needAccessToken = ctx.query.needAccessToken
  if (needAccessToken && !user.accessToken) {
    ctx.response.body = {
      success: false,
      msg: 'node login'
    }
  }
  const query = Object.assign({}, ctx.query, {
    accesstoken: (needAccessToken && ctx.method === 'GET') ? user.accessToken : ''
  });
  if (query.needAccessToken) delete query.needAccessToken;
  const data = queryString.stringify(Object.assign({}, ctx.body, {
    accesstoken: (needAccessToken && ctx.method === 'POST') ? user.accessToken : ''
  }))

  try {
    const res = await axios({
      url: `${baseUrl}${path.replace('/api', '')}`,
      method: ctx.method,
      params: query,
      data,
    })
    ctx.status = res.status
    ctx.response.body = res.data
  } catch (err) {
    if (err.response) {
      ctx.response.body = err.response.data
    } else {
      next(err);
    }
  }
})
