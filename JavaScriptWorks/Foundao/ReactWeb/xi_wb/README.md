# xi_wb

* react脚手架 基于`react-router4`、`redux`

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).


## 项目结构

```

├── build                                 # 项目打包输出目录
│   └── ...
├── config                                # 配置文件
│   └── ...
├── public
│   ├── favicon.ico
│   └── index.html
├── scripts                               # 打包开发脚本
│   ├── build.js
│   └── start.js
├── src                                   # 源码
│   ├── assets                            # 项目资源
│   │   └── ...
│   ├── components                        # 组件
│   │   └── ...
│   ├── pages                        # 页面容器
│   │   └── ...
│   ├── redux                             # redux
│   │   ├── create.js                     # 初始化store
│   │   ├── reducers.js                   # 所有reducer
│   │   └── models                        # actions
│   │       └── ...
│   ├── router                            # 路由
│   │   └── ...
│   ├── theme                             # 主题
│   │   └── ...
│   │── utils                             # 其他工具类
│   │   └── ...
│   ├── index.js                          # webpack打包入口文件
│   └── Main.js                           # 组件入口
├── package.json                          # 项目信息
└── README.md                             # README.md

```

## 快速开始

**安装依赖:**

``npm install``

**开发：**

``npm start``

**构建:**

中英文版打包出来的html 模板title,keywords, description 有所不同
```
中文版 :
npm run build
英文版 :
npm run build en
```

*****
## 环境配置

* 中文测试环境
 ```

 服务器：成都机房服务器 （192.168.100.6）
 服务器目录： data0/dk/cdn/foundao_zh
 线上地址：http://enjoycut-zh.foundao.com:10090/
 ```

* 中文预上线环境（暂时没有正式环境 这个就是正式环境）
```
 服务器：成都机房服务器 （192.168.100.11）
服务器目录： /home/www/enjoycut_cn_before/
线上地址：http://zh.enjoycut.com:11080/home
```

* 英文测试环境
```
服务器：成都机房服务器 （192.168.100.6）
服务器目录：/home/data0/dk/cdn/foundao_en
线上地址：http://enjoycut-en.foundao.com:10090/home
```

* 英文预上线环境
```
服务器：72.14.190.25
服务器目录：/data0/dk/enjoycut_en_before
线上地址：https://before.enjoycut.com/
```

* 英文正式环境
```
服务器：72.14.190.25
服务器目录：/data0/dk/enjoycut_en
线上地址：https://enjoycut.com/
```

* 打包注意
```
如果需要打包中文 在运行完成 npm run build 后运行 npm run runSnap
```
## !!!!???
```
打包正式环境时： ???
在config/webpack.config.prod.js 文件里放开'filename: 'index_react.html','这句代码，来打包一个名为index_react.html的文件
```

# 预加载配置 (Prerender SPA Plugin)

/config/webpack.config.prod.js 文件

```
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  plugins: [
    ...
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, '../build'),
      // Required - Routes to render.
      routes: ['/home', '/convert', '/trim', '/merge', '/watermark', '/remove', '/download'],
    })
  ]
}

```
如需添加路由则在 routes 里面添加，同时需要后端更改ngnix配置
```
/ -> home/index.html
/home -> home/index.html
/convert -> convert/index.html
/trim -> trim/index.html
/merge -> merge/index.html
/watermark -> watermark/index.html
/remove -> remove/index.html
/download -> download/index.html

除了上面的路径，其他路径全部指向 index.html

```
单页应用多路由预渲染指南 [https://juejin.im/post/59d49d976fb9a00a571d651d](https://juejin.im/post/59d49d976fb9a00a571d651d)

使用说明 [https://github.com/chrisvfritz/prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)

