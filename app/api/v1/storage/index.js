const Router = require('koa-router')
const uuidv1 = require('uuid/v1')
const { Sequelize } = require('sequelize');
const { SuccessModel } = require('../../../lib/resModel')
const { initalSearchValue } = require('../../../util')
// const { RegisterValidator } = require('../../validators/user')
const { StorageList } = require('@models/Storage')
const { Productlist } = require('@models/Productlist')
const { handleResult } = require('../../../lib/helper')
const { Auth } = require('@middlewares/auth')

const router = new Router({
  prefix: '/v1/create'
})

// 新增入库单
//并且更新产品列表的实际库存
router.post('/newstorage', new Auth(16).m,async (ctx) => {
  // const v = await new RegisterValidator().validate(ctx)
  let storageBody = ctx.request.body
  // console.log(storageBody.productId)
  const result = await Productlist.findOne({
    where: {
      productId: storageBody.productId
    }
  }).then(res => {
    return res
  })
  const { factStock, belong, internalClassify, remark,
    productName, drawingNum } = result
  // if (!factStock) {
  //   handleResult('入库失败')
  //   return
  // }
  let num = factStock == null ? 0 : factStock
  const sum = (Number((num)) + Number(storageBody.wareNum)).toString()
  // console.log(sum)
  const upda = await Productlist.update({ factStock: sum }, {
    where: {
      productId: storageBody.productId
    }
  })
  const r = await StorageList.createStorage(Object.assign({}, storageBody, {
    belong, internalClassify, remark, productName, drawingNum
  }))

  // ctx.body = result

  handleResult('入库成功')
})
//查询产品
// router.get('/getstorelist', async ctx => {
//   // ctx.body = {
//   //   data:r,
//   //   code: '200',
//   //   msg: '查询成功'
//   // }
//   let {
//     page = 1,
//     pageSize = 100,
//     drawingNum,
//     productName,
//     factStock,
//     safetyStock,
//     remark
//   } = ctx.request.query;
//   let limit = page * pageSize;
//   let offset = page - 1;
//   let search = {
//     drawingNum,
//     productName,
//     factStock,
//     safetyStock,
//     remark,
//     Init: initalSearchValue
//   }
//   // console.log(search.Init)
//   let params = search.Init('drawingNum')
//   // if (drawingNum) {
//   //   search['drawingNum'] = drawingNum
//   // }

//   let productList = await Productlist.findAndCountAll({
//     offset: parseInt(offset),
//     limit,
//     where: params
//   }).then(res => {
//     let result = {};
//     result.data = res.rows;
//     result.total = res.count;
//     result.page = page;
//     result.pageSize = pageSize;
//     return result;
//   });

//   ctx.body = Object.assign({}, new SuccessModel(productList.data), productList);

// })

module.exports = router
