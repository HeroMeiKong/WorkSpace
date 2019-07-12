import React, { Component } from 'react'
import './ArticleDetails.scss'
import _tool from '@/utils/tool'
import Articles from '../PopularArticles/Articles'

class ArticleDetails extends Component {

  //根据语言区分渲染那个语言文章
  changeLanguage = () => {
    const id = this.props.match.params.id
    if(_tool.isForeign()){
      const length = Articles.data_en.length
      for(let i=0;i<length;i++){
        if(Articles.data_en[i].id === id){
          return Articles.data_en[i]
        }
      }
    } else {
      const length = Articles.data_zh.length
      for(let i=0;i<length;i++){
        if(Articles.data_zh[i].id === id){
          return Articles.data_zh[i]
        }
      }
    }
  }

  render () {
    const articles = this.changeLanguage()
    const isForeign = _tool.isForeign()
    return (
      <div className='articleDetails'>
        <div className="article_top">
          <div className="article_title">{articles.title}</div>
          <div className="redline"></div>
          <div className="article_msg">
                  <p style={isForeign ? {marginRight: '6px'} : {marginRight: '32px'}}>{window.intl.get('作者：')}{articles.author}{isForeign ? ' |' : ''}</p>
                  <p>{window.intl.get('更新时间：')}{articles.date}</p>
                </div>
        </div>
        <div className="article_bottom">
          <div className="article_abstract">
            <div className="article_abstract_text">
              <div className="article_abstract_pic"></div>
              {articles.abstract}
            </div>
          </div>
          <div className='article_text'>
            <div dangerouslySetInnerHTML={{__html: articles.content}} />
          </div>
        </div>
      </div>
    )
  }
}

export default ArticleDetails