import React, { Component, Fragment } from 'react'
import './MessageBoard.scss'
// import _tool from '@/utils/tool'
import httpRequest from "@/utils/httpRequest";
import _api from "@/API/api";
import messageBox from '@/utils/messageBox'
import PageCounter from './PageCounter/PageCounter'
import MessageForAdmin from './MessageForAdmin/MessageForAdmin'
import MessageForUser from './MessageForUser/MessageForUser'
// import SendMessage from './SendMessage/SendMessage'
import MasterNote from './MasterNote/MasterNote'

class MessageBoard extends Component {
  constructor() {
    super()
    this.state = {
      page: '1',
      lists: [],
      masterNotePage: '1',
      masterNoteLists: [],
    }
  }

  componentDidMount() {
    this.getMessageBoard(1)//默认第一页
    this.getMasterNotes(1)//默认最新一篇，一开始是隐藏的，看不到
  }

  //根据页数，渲染留言板
  getMessageBoard = (page) => {
    httpRequest({
      url: _api.msgboard_list+'?page='+page,
      dataType: 'json',
    }).done((res) => {
      if (res.code / 1 === 0) {
        const length = res.data.total-0 || 1
        const per = res.data.limit-0 || 6
        this.setState({
          page: Math.ceil(length/per),
          lists: res.data.rows
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //根据页数，渲染站长笔记
  getMasterNotes = (page) => {
    httpRequest({
      url: _api.masternotes+'?page='+page,
      dataType: 'json',
    }).done((res) => {
      if (res.code / 1 === 0) {
        const length = res.data.total-0 || 1
        const per = res.data.limit-0 || 6
        this.setState({
          masterNotePage: Math.ceil(length/per),
          masterNoteLists: res.data.rows
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //判断url，返回改显示的页面
  getType = () => {
    // if(this.props.match.parmas && this.props.match.parmas.type === 'masterNote'){
    //   return true
    // } else {
    //   return false
    // }
    if(this.props.location.pathname.indexOf('/masterNote') > 0){
      return true
    } else {
      return false
    }
  }

  //改变页面内容
  changePage = (e,value) => {
    if(e === 'masterNotePage'){
      this.getMasterNotes(value)
    } else {
      this.getMessageBoard(value)
      this.props.history.push('/messageBoard/page?'+value)
    }
  }

  render () {
    const { page, lists, masterNotePage, masterNoteLists } = this.state
    const type = this.getType()
    return (
      <div className='messageboard'>
        <div className="messageboard_top">
          <h1>{window.intl.get('留言板')}</h1>
          <div className="messageboard_line"></div>
        </div>
        <div className="messageboard_bottom">
          <div className="messageboard_inner">
            {type 
              ? <Fragment>
                  <div className='masternote_wrapper'>
                    <p>{window.intl.get('站长记事本')}</p>
                    {masterNoteLists.map((masterNote,i) => <MasterNote key={i} data={masterNote} />)}
                    <PageCounter callBack={this.changePage.bind(this,'masterNotePage')} page={masterNotePage} />
                  </div>
                </Fragment>
              : <Fragment>
                  <MessageForAdmin />
                  <div className='usermessage'>{window.intl.get('用户留言')}</div>
                  {lists.map((list,i) => <MessageForUser key={i} data={list} />)}
                  <PageCounter callBack={this.changePage.bind(this,'page')} page={page} url={this.props.match} />
                </Fragment>
            }
            {/* <SendMessage /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default MessageBoard