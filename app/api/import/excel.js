const Router = require('koa-router')
// const { getExcelObjs } = require('../../util/index');
const { saveData } = require('./uploadData')
const { OutStorageList } = require('@models/outstorage')
const { Productlist } = require('@models/Productlist')
const { handleResult } = require('../../lib/helper')
const { errupload } = require('./errorupload')
const moment = require('moment')
const router = new Router({
  prefix: '/import'
})

router.post('/importExcel', async (ctx, next) => {
  // saveData(ctx, next).then(res => {
  //   console.log(res)
  // })
  let { outLibtime } = ctx.request.body
  outLibtime = moment(Number(outLibtime)).format('YYYY-MM-DD HH:mm:ss')
  const importData = await saveData(ctx, next)
  // console.log(importData)
  // if (!importData.hasOwnProperty('drawingNum')) {
  //   handleResult('请选择正确的文件格式')
  //   // throw new global.errs.NotFound('请选择正确的文件格式')
  // }
  importData.forEach(item => {
    
    if (!item.hasOwnProperty('drawingNum')) {
      handleResult('请选择正确的文件格式')
      // throw new global.errs.NotFound('请选择正确的文件格式')
    }
  })
  let rep = []
  let sum;
  for (let item of importData) {
    // console.log(item)
    const result = await Productlist.findOne({
      where: {
        drawingNum: item.drawingNum
      }
    })
    // console.log(result)
    const { factStock, belong, internalClassify, drawingNum, productName, remark } = result
    // console.log(result)

    sum = ((factStock || 0) - Number(item.outLibNum))
    // console.log(sum)
    // console.log(item)
    // console.log(factStock)
    if (sum <= 0) {

      rep.push(item)
      continue
      // handleResult(item)
      // ctx.body = {
      //   data: item
      // }
    }


    // ctx.body = {
    //   msg
    // }

  }
  if (rep.length > 0) {
    // console.log(rep)
    // handleResult(json2Excel(rep)) 
    errupload(rep,ctx)
     
  } else {
    for (let item of importData) {
      const result = await Productlist.findOne({
        where: {
          drawingNum: item.drawingNum
        }
      })

      const { factStock, belong, internalClassify, drawingNum, productName, remark, productId } = result

      const sum = ((factStock || 0) - Number(item.outLibNum))
      // console.log(sum)
      const upda = await Productlist.update({ factStock: sum }, {
        where: {
          drawingNum: item.drawingNum
        }
      })
      const outLibObj = Object.assign({}, { belong, internalClassify, drawingNum, productName, remark, outLibNum: item.outLibNum, productId, outLibtime: outLibtime })

      const r = await OutStorageList.createOutStorage(outLibObj)
    }
    handleResult('出库成功')
  }
})

// const file = ctx.request.body.file.file;
// const filename = file.name;
// const reader = fs.createReadStream(file.path);
// const homeDir = path.resolve(__dirname, '..');
// const newpath = homeDir + '/static/' + filename;
// const stream = fs.createWriteStream(newpath);
// reader.pipe(stream); // 写入文件流
// console.log('上传成功 %s -> %s', filename, stream.path);
// if (stream.path !== "") {
//   // 读取excel
//   const datas = xlsx.parse(stream.path);
//   const values = datas[0].data;
//   // 写入表
//   // const sqls = "INSERT INTO tab_users (username,password,email,age,realname,birthday,address) VALUES ?";
//   // await dbUtils(sqls, [values], function (error, results, fields) {
//   //   if (error) throw error;
//   //   // 写入日志·
//   //   // logger.info("上传文件excel" + stream.path + 'ok');
//   // });
// }
// await ctx.redirect('/users');

module.exports = router