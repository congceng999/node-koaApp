const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt');


class Auth {
    constructor(level) {
        this.level = level || 1

        Auth.AUSE = 8
        Auth.ADMIN = 16
        Auth.SPUSER_ADMIN = 32
    }

    get m () {
        // token 检测
        // token 开发者 传递令牌
        // token body header
        // HTTP 规定 身份验证机制 HttpBasicAuth
        return async (ctx, next) => {
            // koajwt(ctx, {
            //     secret: global.config.security.secretKey
            // })
            const tokenToken = ctx.req.headers.authorization
            // console.log(token)
            // const tokenToken = new JwtStrategy(opts, (jwt_payload, next) => {
            //     // jwt_payload 解析好的 token字符串，
            //     // 和 jwt-decode 解析的一样， 但是这个会进行密钥的判断
            //     // 如果密钥匹配失败， 直接结束返回401状态码
            //     console.log(jwt_payload)
            // })

            let errMsg = "token不合法"

            // 无带token
            if (!tokenToken) {
                throw new global.errs.Forbidden(errMsg)
            }

            try {
                var decode = jwt.verify(tokenToken, global.config.security.secretKey)

            } catch (error) {
                // token 不合法 过期
                if (error.name === 'TokenExpiredError') {
                    errMsg = "token已过期"
                }

                throw new global.errs.Forbidden(errMsg)
            }

            if (decode.scope <= this.level) {
                errMsg = "权限不足"
                throw new global.errs.Forbidden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }

            await next()
        }
    }

    // 验证token是否有效
    static verifyToken (token) {
        try {
            jwt.verify(token, global.config.security.secretKey)

            return true;
        } catch (e) {
            return false
        }
    }

}

module.exports = {
    Auth
}