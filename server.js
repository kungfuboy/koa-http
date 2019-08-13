// server.js

const Koa = require('koa')
const path = require('path')
const proxy = require('http-proxy-middleware')
const static = require('koa-static')
const fs = require('fs')

const app = new Koa()

const url = 'http://192.168.30.156:8089'    // 后端服务器地址
const ws = 'ws://192.168.30.75:8091'

app.use(async (ctx, next) => {
    if(ctx.url.startsWith('/api')) {    // 以api开头的异步请求接口都会被转发
        ctx.respond = false
        return proxy({
            target: url, // 服务器地址
            changeOrigin: true,
            secure: false,
        })(ctx.req, ctx.res, next)
    }
    if(ctx.url.startsWith('/socketServer')) {    // 以api开头的异步请求接口都会被转发
        ctx.respond = false
        return proxy({
            target: ws, // WebSocket服务器地址
            changeOrigin: true,
            secure: false,
            ws: true
        })(ctx.req, ctx.res, next)
    }
    return next()
})

// 指定静态资源文件夹
app.use(static(path.join(__dirname, './dist')))

// 指定首页
app.use(async (ctx) => {
    ctx.body = fs.readFile('./dist/index.html', (err, data) => {console.log('Error:' + err)})
})

// 监听
app.listen(3300, () => {
    console.log('Listening 3000...')
});