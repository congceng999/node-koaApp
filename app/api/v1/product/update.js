const { SuccessModel } = require('../../../lib/resModel')
const { Productlist } = require('@models/Productlist')



const updatePro = async ctx => {
  const {
    drawingNum,
    productName,
    factStock,
    internalClassify,
    safetyStock,
    remark,
    belong,
    productId } = ctx.request.body;
  const result = await Productlist.update({
    drawingNum,
    productName,
    factStock,
    internalClassify,
    belong,
    safetyStock,
    remark,
  }, {
    where: {
      productId
    },
  })
    .then(res => {
      return res
    })
  ctx.body = Object.assign({}, new SuccessModel(result))
}

module.exports = {
  updatePro
}
