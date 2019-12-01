const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

// 定义产品模型
class Productlist extends Model {
  static async getData (caveat, productList) {
    let data = [];
    if (caveat === '1') {
      productList.data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (Number(item['safetyStock']) < Number(item['factStock'])) {
            data.push(item)
          }
        })
      })
    }
    if (caveat === '0') {
      productList.data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (Number(item['safetyStock']) > Number(item['factStock'])) {
            data.push(item)
          }
        })
      })
    }
    return data
  }
  static async verifyEmailPassword (drawingNum) {
    // 查询用户
    const productlist = await Productlist.findOne({
      where: {
        drawingNum
      }
    })
    if (productlist) {
      throw new global.errs.AuthFailed('该商品已添加')
    }

    // 验证密码
    // const correct = bcrypt.compareSync(plainPassword, user.password)

    // if (!correct) {
    //   throw new global.errs.AuthFailed('密码不正确')
    // }

    return productlist
  }

  // // 查询是否存在 
  // static async getUserBydrawingNum (drawingNum) {
  //   // 查询用户
  //   const user = await User.findOne({
  //     where: {
  //       openid
  //     }
  //   })

  //   return user;
  // }

  // // 注册产品
  static async createProduct (productBody) {
    // console.log(productBody)
    const isSend = await Productlist.verifyEmailPassword(productBody.drawingNum)
    const productlist = await Productlist.create({ ...productBody })

    return productlist;
  }


}

// 初始用户模型
Productlist.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  remark: {
    type: Sequelize.STRING(255),
  },
  safetyStock: {
    type: Sequelize.STRING(50),
  },
  versionNum: {
    type: Sequelize.STRING(50),
  },
  //所属车间
  belong: {
    type: Sequelize.STRING(50),
  },
  //图号
  drawingNum: {
    type: Sequelize.STRING(255),
  },
  //产品名称
  productName: {
    type: Sequelize.STRING(50),
  },
  //产品唯一id
  productId: {
    type: Sequelize.STRING(255),

  },
  outboundNum: {
    type: Sequelize.BIGINT()
  },
  factStock: {
    type: Sequelize.BIGINT()
  },
  state: {
    type: Sequelize.INTEGER()
  },
  author: {
    type: Sequelize.STRING(50)
  },
  internalClassify: {
    type: Sequelize.STRING(50),
  },
}, {
  sequelize,
  tableName: 'productlist'
})


module.exports = {
  Productlist
}
