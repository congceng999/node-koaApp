const { getExcelObjs } = require('../../util/index');
const { Auth } = require('@middlewares/auth')

const saveData = async function (ctx, next) {

  const getRes = await getExcelObjs(ctx);
  if (getRes.status) {
    if (getRes.datas.length > 1) {
      errorResult.errorRes(ctx, '暂时不支持多个sheet存在');
    } else { //得到的是数组
      let objs = getRes.datas[0];
      objs.forEach(item=>{
        Object.keys(item).forEach(key => {
          if(key ==='图号') {
            item.drawingNum = item[key].replace(/\s+/g, '')
          }
          if(key === '出库数量') {
            item.outLibNum = item[key]
          }
        })
      })
      return objs
      // ctx.body = {
      //   status: true,
      //   msg: '上传数据成功'
      // };
    }
  } else {
    throw new global.errs.NotFound();
  }

  await next();
};
module.exports = {
  saveData
};