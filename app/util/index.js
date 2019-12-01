
const { Sequelize } = require('sequelize');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Blob = require('node-blob');
const downPath = path.resolve(__dirname, '../../fileUpload');
const upPath = path.resolve(__dirname, '../../upPath');

function initalSearchValue (likeSearch) {
  let inital = {};
  for (let key in this) {
    if (this[key] && typeof this[key] !== 'function') {
      inital[key] = this[key]
    }
    if (key === likeSearch) {
      const Op = Sequelize.Op
      inital[key] = { [Op.like]: `%${this[key]}%` }
    }
  }
  return inital
}


async function getExcelObjs (ctx) {
  const file = ctx.request.files.file; // 获取上传文件
  const reader = fs.createReadStream(file.path); // 创建可读流
  const ext = file.name.split('.').pop(); // 获取上传文件扩展名
  const filePath = `${downPath}/${Math.random().toString()}.${ext}`;

  const upStream = fs.createWriteStream(filePath); // 创建可写流
  const getRes = await getFile(reader, upStream); //等待数据存储完成

  const datas = []; //可能存在多个sheet的情况
  if (!getRes) { //没有问题
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      datas.push(data);
    }
    return {
      status: true,
      datas
    };
  } else {
    return {
      status: false,
      msg: '上传文件错误'
    };
  }
}

function getFile (reader, upStream) {
  return new Promise(function (result) {
    let stream = reader.pipe(upStream); // 可读流通过管道写入可写流
    stream.on('finish', function (err) {
      result(err);
    });
  });
}


function json2Excel (dataSource) {
  var wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };
  var workBook = {
    SheetNames: ['Sheet1'],
    Sheets: {},
    Props: {}
  };
  //1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
  //2、将数据放入对象workBook的Sheets中等待输出
 
    workBook.Sheets['Sheet1'] = xlsx.utils.json_to_sheet([
      { A: "S", B: "h", C: "e", D: "e", E: "t", F: "J", G: "S" },
      { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 },
      { A: 2, B: 3, C: 4, D: 5, E: 6, F: 7, G: 8 }
    ], { header: ["B", "D", "F", "H"] })

  //3、XLSX.write() 开始编写Excel表格
  //4、changeData() 将数据处理成需要输出的格式
  // saveAs()
  // new Blob([])
  // const blob = new File([changeData(xlsx.write(workBook, wopts))], { type: 'application/octet-stream' })
  const filePath = `${upPath}/${Math.random().toString()}.xls`;
  // const upStream = fs.createWriteStream(filePath);
  // getFile(xlsx.write(workBook, wopts), upStream);·
  // console.log(blob)
  // return blob
}
function changeData (s) {

  //如果存在ArrayBuffer对象(es6) 最好采用该对象
  if (typeof ArrayBuffer !== 'undefined') {

    //1、创建一个字节长度为s.length的内存区域
    // console.log(s)
    var buf = new ArrayBuffer(s.length);

    //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
    var view = new Uint8Array(buf);

    //3、返回指定位置的字符的Unicode编码
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;

  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}
module.exports = {
  getExcelObjs,
  initalSearchValue,
  json2Excel
};


