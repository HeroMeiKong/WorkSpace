/**
 * Created by DELL on 2018/11/15.
 */

/*cms打包时间 打包时node脚本自动获取*/
/*eslint-disable no-undef */

/*基础配置， 主要配置cms api地址 和h5预览页地址*/
// const _hostname = window.location.hostname;
const _protocol = window.location.protocol;

let _environment = 'test'; // 环境变量 offline/pre/test -> 正式/预上线/测试



const test_config = {  // 测试环境配置
  API_HOST: _protocol + '//foundao.f3322.net:10032/',
};

// const online_config = {  // 线上环境配置
//   API_HOST: _protocol + '//foundao.f3322.net:10032/',
// };


let _config = test_config;  // 默认测试环境


const API_HOST = _config.API_HOST; //  cms api
const h5_base = _config.h5_base;   //  h5 地址

export {API_HOST, h5_base, _environment}