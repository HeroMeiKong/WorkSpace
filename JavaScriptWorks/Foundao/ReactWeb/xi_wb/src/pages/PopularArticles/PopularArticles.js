import React, { Component } from 'react';
import {Link} from "react-router-dom";
import './PopularArticles.scss'
import _tool from '@/utils/tool'
import Articles from './Articles'

class PopularArticles extends Component {
  
  //根据语言选择渲染文章类型
  changeLanguage = () => {
    if(_tool.isForeign()){
      return Articles.data_en
    } else {
      return Articles.data_zh
    }
  }

  gotoDetails (id) {
    window.open('/articleDetails/'+ id)
  }

  render () {
    const articles = this.changeLanguage()
    const isForeign = _tool.isForeign()
    return (
      <div className='popularArticles'>
        <div className="articles_top">
          <div className="popularArticles_title">{window.intl.get('热门文章')}</div>
          <div className="redline"></div>
        </div>
        <div className="articles_list">
          {articles.reverse().map((article,index) => 
            {return <div className='article_box' key={index}>
              <Link to={'/articleDetails/'+article.id} target='_blank'>{article.title}</Link>
              <div className="article_box_left" style={{backgroundImage: 'url('+article.cover+')'}}></div>
              <div className="article_box_right">
                <div className="article_box_title">{article.title}</div>
                <div className="article_box_msg">
                  <p style={isForeign ? {marginRight: '6px'} : {marginRight: '32px'}}>{window.intl.get('作者：')}{article.author}{isForeign ? ' |' : ''}</p>
                  <p>{window.intl.get('更新时间：')}{article.date}</p>
                </div>
                <div className="article_box_desc">{article.desc}</div>
                <div className="article_box_details">{window.intl.get('查看详情')}</div>
              </div>
            </div>}
          )}
        </div>
      </div>
    )
  }
}

export default PopularArticles