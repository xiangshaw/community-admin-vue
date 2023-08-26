// 跨域配置
module.exports = {
    devServer: {                //记住，别写错了devServer//设置本地默认端口  选填
        port: 80,
        proxy: {                 //设置代理，必须填
            '/api': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://localhost:221/',     //代理的目标地址
                changeOrigin: true,              //是否设置同源，输入是的
                secure: false,                     // 设置支持https协议的代理
                pathRewrite: {'^/api': ''} //路径重写 //选择忽略拦截器里面的内容
            },
            '/api2': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://localhost:2022/',     //代理的目标地址
                changeOrigin: true,              //是否设置同源，输入是的
                secure: false,                     // 设置支持https协议的代理
                pathRewrite: {'^/api': ''} //路径重写 //选择忽略拦截器里面的内容
            },
            '/api3': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://localhost:1123/',     //代理的目标地址
                changeOrigin: true,              //是否设置同源，输入是的
                secure: false,                     // 设置支持https协议的代理
                pathRewrite: {'^/api': ''} //路径重写 //选择忽略拦截器里面的内容
            },
        }
    }
}
