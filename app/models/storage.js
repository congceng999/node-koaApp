const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

// 定义产品模型
class StorageList extends Model {
  // static async verifyEmailPassword (drawingNum) {
  //   // 查询用户
  //   const productlist = await Productlist.findOne({
  //     where: {
  //       drawingNum
  //     }
  //   })
  //   if (productlist) {
  //     throw new global.errs.AuthFailed('该商品已添加')
  //   }

  //   // 验证密码
  //   // const correct = bcrypt.compareSync(plainPassword, user.password)

  //   // if (!correct) {
  //   //   throw new global.errs.AuthFailed('密码不正确')
  //   // }

  //   return productlist
  // }

  // // // 查询是否存在 opendid 的小程序用户
  // // static async getUserByOpenid (openid) {
  // //   // 查询用户
  // //   const user = await User.findOne({
  // //     where: {
  // //       openid
  // //     }
  // //   })

  // //   return user;
  // // }

  // // // 注册产品
  static async createStorage (body) {
    
    // const isSend = await Productlist.verifyEmailPassword(body.drawingNum)
    const wareNo = Date.now() + Math.random().toString().slice(-6)//随机6位数
    body = Object.assign({}, { ...body, wareNo})
    const storagelist = await StorageList.create({...body})
    return storagelist;
  }
}

// 初始入库单模型
StorageList.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  remark: {
    type: Sequelize.STRING(255),
  },

  productId:{
    type: Sequelize.STRING(255)
  },
  waretime: {
    type: Sequelize.STRING(255)
  },
  //图号
  drawingNum: {
    type: Sequelize.STRING(255),
  },
  //产品名称
  productName: {
    type: Sequelize.STRING(50),
  },
  belong: {
    type: Sequelize.STRING(50),
  },
  internalClassify: {
    type: Sequelize.STRING(50),
  },
  wareNum: {
    type: Sequelize.STRING(255)
  },
  wareNo: {
    type: Sequelize.STRING(255)
  },
  state: {
    type: Sequelize.INTEGER(),
    defaultValue:1
  },
  author: {
    type: Sequelize.STRING(50)
  },
}, {
  sequelize,
  tableName: 'storageList'
})


module.exports = {
  StorageList
}
