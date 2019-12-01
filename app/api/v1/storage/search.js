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
  prefix: '/v1/search'
})


router.get('/getstoragelist', new Auth(16).m,async ctx => {
  // ctx.body = {
  //   data:r,
  //   code: '200',
  //   msg: '查询成功'
  // }
  let {
    page = 1,
    pageSize = 100,
    belong,
    waretime,
    productName,
    wareNum,
    drawingNum,
    remark,
  } = ctx.request.query;
  let limit = page * pageSize;
  let offset = page - 1;
  let search = {
    belong,
    waretime,
    productName,
    wareNum,
    drawingNum,
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
  // if (drawingNum) {
  //   search['drawingNum'] = drawingNum
  // }

  let productList = await StorageList.findAndCountAll({
    offset: parseInt(offset),
    limit,
    where: params
    // where: params
  }).then(res => {
    console.log(res)
    let result = {};
    result.data = res.rows;
    result.total = res.count;
    result.page = page;
    result.pageSize = pageSize;
    return result;
  });
  // let productList = await StorageList.findAll({
  //   // offset: parseInt(offset),
  //   // limit,
  //   attributes: ['id'],
  //   include: [{
  //     attributes: ['id'],
  //     model: Productlist
  //   }]
  //   // where: params
  // }).then(res=>{
  //   console.log(res)
  // })

  ctx.body = Object.assign({}, new SuccessModel(productList.data), productList);

})

module.exports = router
