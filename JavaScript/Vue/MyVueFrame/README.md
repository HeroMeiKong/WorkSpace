# SoulWalker - 一个 Vue UI 组件
[![Build Status](https://travis-ci.org/HeroMeiKong/MyVueFrame.svg?branch=master)](https://travis-ci.org/HeroMeiKong/MyVueFrame)  

##介绍  
这是我在学习 Vue 过程中做的一个 UI 框架，希望对你有用。  

##开始使用  
1. 安装  
使用本框架前，请在 CSS 中设置 border-box
    ```
    *,*::before,*::after{box-sizing: border-box;}
    ```
    IE 8 及以上浏览器都支持此样式。  
    你还需要设置默认颜色变量（后续会改成 SCSS 变量）
    ```
    html {
                --button-height: 32px;
                --font-size: 14px;
                --button-bg: white;
                --button-active-bg: #eee;
                --border-radius: 4px;
                --color: #999;
                --border-color: #999;
                --border-color-hover: #666;
            }
    ```
    IE 15 及以上浏览器都支持此样式。  

2. 安装 SoulWalker
    ```
    npm install --save soulwalker
    ```
3. 引入 SoulWalker
    ```
    import {ButtonGroup, Button, Icon} from 'soulwalker'
    import 'soulwalker/dist/index.css'

    export default {
      name: 'app',
      components: {
        HelloWorld,
        'g-button': Button
      }
    }
    ```

##文档
##提问
##变更记录
##联系方式
##贡献代码