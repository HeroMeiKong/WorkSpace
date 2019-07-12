import React from 'react';
// import {hydrate ,render} from 'react-dom';//zh
import ReactDOM from 'react-dom';//en
import {Provider} from 'react-redux';
import './index.css';
// import 'babel-polyfill'; // 兼容IE
import App from './App';
import {store} from './redux/create';
// const rootElement = document.getElementById("root");
ReactDOM.render( <Provider store={store}><App/></Provider>,document.getElementById('root'));//en
// if (rootElement.hasChildNodes()) {//zh
//   hydrate(<Provider store={store}><App/></Provider>, rootElement);
// } else {
//   render(<Provider store={store}><App/></Provider>, rootElement);
// }
/* 热加载 */
if (module.hot) {
  module.hot.accept();
}