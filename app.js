require('module-alias/register')

const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
const catchError = require('./middlewares/exception')
const koaBody = require('koa-body');
const koajwt = require('koa-jwt');
const app = new Koa()

app.use(catchError)
app.use(koaBody({
  multipart: true, // 支持文件上传
  // patchNode: true,
  // patchKoa: true,
  formidable: {
    keepExtensions: true,

    maxFieldsSize: 4 * 1024 * 1024, // 最大文件为2兆
    multipart: true // 是否支持 multipart-formdate 的表单
  }
}))

app.use(parser())
app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.response.status = 200
    // ctx.send(200)
  }
  await next();
});

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', 'http://localhost:8081');
//   ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
//   ctx.set("Access-Control-Allow-Credentials", "true")
//   await next();
// });

app.use(async function (ctx, next) {
  ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Max-Age", 86400000);
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "Authorization, accept, origin, content-type");
  await next()
})
// app.use(koajwt({
//   secret: 'abcdefg'
// }));
InitManager.initCore(app)

app.listen(3000)
