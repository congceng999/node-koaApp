const Router = require('koa-router')
const uuidv1 = require('uuid/v1')
const { Sequelize } = require('sequelize');
const { SuccessModel } = require('../../../lib/resModel')
const { initalSearchValue } = require('../../../util')
// const { RegisterValidator } = require('../../validators/user')
const { Productlist } = require('@models/Productlist')
const { Auth } = require('@middlewares/auth')
const { handleResult } = require('../../../lib/helper')
const { updatePro } = require('./update')

const router = new Router({
  prefix: '/v1/create'
})
const Op = Sequelize.Op;
// 新增产品
router.post('/newproduct',new Auth(32).m, async (ctx) => {
  // const v = await new RegisterValidator().validate(ctx)
  let productBody = ctx.request.body
  const productId = uuidv1().replace(/\-/g, '');
  const r = await Productlist.createProduct(Object.assign({}, productBody, { productId }))


  handleResult('注册成功')
})
//查询产品
router.get('/getstorelist', async ctx => {
  // ctx.body = {
  //   data:r,
  //   code: '200',
  //   msg: '查询成功'
  // }
  let {
    page = 1,
    pageSize = 100,
    drawingNum,
    productName,
    belong,
    safetyStock,
    caveat,
    remark
  } = ctx.request.query;
  let limit = page * pageSize;
  let offset = page - 1;
  let search = {
    drawingNum,
    productName,
    belong,
    safetyStock,
    remark,
    Init: initalSearchValue
  }
  // console.log(search.Init)
  let params;
  if (drawingNum) {
    params = search.Init('drawingNum')
  } else {
    params = search.Init()
  }
  // console.log(params)
  // if (caveat === '1') {

  // }
  // if (drawingNum) {
  //   search['drawingNum'] = drawingNum
  // }
  // console.log(params)
  let productList = await Productlist.findAndCountAll({
    offset: parseInt(offset),
    limit,
    where: params,
    row: true,
    get: { plain: true }
  }).then(res => {
    let result = {};
    // for(let key in res.rows) {
    //   console.log(key)
    // }
    // console.log(res.toJSON())

    // for (let i of result.data) {
    //   console.log(i)
    //   Object.keys(i).forEach(key=>{
    //     console.log(key)
    //   })
    // }
    if (caveat) {
      let newArr = []
      const data = JSON.parse(JSON.stringify(res.rows))
      // console.log(res.rows)
      if (caveat === '0') {
        // console.log(data, '2323232323223')
        data.forEach(item => {
          if (Number(item['safetyStock']) < Number(item['factStock'])) {
            newArr.push(item)
          }
          // Object.keys(item).forEach(key => {
          //   if (Number(item['safetyStock'] < Number(item['factStock']))) {
          //     newArr.push(item)
          //     return
          //   }
          // })
        })
      }
      if (caveat === '1') {
        // console.log(data)
        data.forEach(item => {
          // console.log(Number(item['safetyStock']) > Number(item['factStock']))
          if (Number(item['safetyStock']) > Number(item['factStock'])) {
            newArr.push(item)
          }
          // Object.keys(item).forEach(key => {
          //   if (Number(item['safetyStock'] < Number(item['factStock']))) {
          //     newArr.push(item)
          //     return
          //   }
          // })
        })
      }
      // console.log(newArr)
      result.data = newArr;
    } else {
      result.data = res.rows;


    }
    result.total = res.count;
    result.page = page;
    result.pageSize = pageSize
    // console.log(newArr)
    return result;
  });
  // const data = Productlist.getData(caveat, productList)

  // console.log(data)
  // ctx.body = data
  // console.log(productList.data)
  ctx.body = Object.assign({}, new SuccessModel(productList.data), productList);

})
//更新接口
router.post('/update', new Auth(32).m,updatePro)
//查询
router.get('/search', new Auth(8).m,async ctx => {
  let {
    productId
  } = ctx.request.query;
  console.log(productId)
  let productList = await Productlist.findOne({
    where: { productId }
  })
  ctx.body = new SuccessModel(productList);
})

module.exports = router
