const nodeXlsx = require('node-xlsx')


const errupload = (data,ctx) => {
  let FileName = '错误明细';  //表名,文件名 
  let keys = ["图号", "出库数量"]; //这里设置表头
  let sheet = [];
  if (!!data && data.length > 0) {
    if (!sheet[FileName]) {
      sheet[FileName] = { sheet: [], value: [] };
    }
    sheet[FileName].sheet = keys;

    let values = []; //用来存储每一行json的数值，
    data.forEach((item, index) => {
      values = [];
      keys.forEach(key => {
        values.push(item[key])
      });
      sheet[FileName].value[index] = values;
    });
  }
  sheet[FileName].value.unshift(sheet[FileName].sheet);
  let fileSheet = sheet[FileName].value;
  let obj = [{ name: FileName, data: fileSheet }];
  let file = nodeXlsx.build(obj);
  ctx.status = 208
  ctx.set("Content-Disposition", "attachment; filename=" + ` ${encodeURIComponent(FileName)}_${Date.now()}.xlsx`)
  ctx.set('Content-Type', 'application/vnd.openxmlformats')
  ctx.body = file
}
module.exports = {errupload}