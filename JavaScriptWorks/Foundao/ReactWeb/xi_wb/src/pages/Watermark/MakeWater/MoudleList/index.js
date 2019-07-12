import React, {Component} from 'react'
import './index.scss'
import httpRequest from "@/utils/httpRequest";
import API from "@/API/api";
import messageBox from '@/utils/messageBox.js'
import tools from '@/utils/tool';
// import $ from 'jquery'

const $ = window.jQuery;
export default class MoudleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moudleList: [],
      activeIndex: 0,  //选中的index值
      isInput: false, //是否是正在输入状态
      inputIndex: '', //输入中的index
      isNoMoudleList: false,
      changeValue: ''
    };
  }

  componentDidMount() {
    this.getMoudleList()
  }

  //获取模板列表
  getMoudleList = () => {
    var _this = this
    const userInfo = tools.getUserData_storage()
    httpRequest({
      url: API.moudle_list,
      dataType: 'json',
      type: 'POST',
      data: {
        token: userInfo.token
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        const moudleList = res.data
        if (moudleList.length > 0 && localStorage.getItem('showMoudlesTip') !== 'true') {
          setTimeout(function () {
            $('#moudleTip').fadeIn()
            localStorage.setItem('showMoudlesTip', 'true')
            _this.moudleTipsTimer = setTimeout(_this.closeMoudleTip, 3000)
          }, 1000)
        }
        moudleList.forEach((item, index) => {
          if (item.data) {
            item.data = JSON.parse(item.data)
          }
        })
        let isNoMoudleList = false
        if (moudleList.length === 0) {
          isNoMoudleList = true
        }
        this.setState({moudleList: moudleList, isNoMoudleList})
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //关闭提示框
  closeMoudleTip = () => {
    if ($('#moudleTip')) {
      $('#moudleTip').fadeOut()
    } else {
      clearTimeout(this.moudleTipsTimer)
    }
  }

  //删除模板
  deleteMoudle = (index) => {
    const {moudleList} = this.state
    const userInfo = tools.getUserData_storage()
    httpRequest({
      url: API.delete_moudle,
      dataType: 'json',
      type: 'POST',
      data: {
        token: userInfo.token || '',
        id: moudleList[index].id || ''
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        moudleList.splice(index, 1)
        let isNoMoudleList = false
        if (moudleList.length === 0) {
          isNoMoudleList = true
        }
        this.setState({moudleList, activeIndex: 0, isNoMoudleList})
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  //切换到输入名字
  inputName = (index) => {
    const {moudleList, isInput} = this.state
    if (isInput) {
      this.saveMoudle(index)
    } else {
      this.setState({
        isInput: true,
        inputIndex: index,
        changeValue: moudleList[index].name
      })
    }
  }

  //输入模板名字
  changeMoudleName = (e) => {
    const value = e.target.value
    this.setState({
      changeValue: value
    })
  }

  //保存模板
  saveMoudle = (index) => {
    const {changeValue, moudleList} = this.state
    const userInfo = tools.getUserData_storage()
    httpRequest({
      url: API.save_moudle,
      dataType: 'json',
      type: 'POST',
      data: {
        token: userInfo.token,
        id: moudleList[index].id,
        name: changeValue,
      }
    }).done((res) => {
      if (res.code / 1 === 0) {
        moudleList[index].name = changeValue
        this.setState({
          isInput: false,
          moudleList
        })
      } else {
        messageBox(res.msg)
      }
    }).fail(() => {
      messageBox(window.intl.get('内部服务器错误！'))
    })
  }

  onKeyUp = (index, e) => {
    if (e.keyCode === 13) {
      this.saveMoudle(index);
    }
  }

  //使用模板
  confirmMoudle = () => {
    const {moudleList, activeIndex} = this.state
    if (moudleList[activeIndex]) {
      this.props.userMoudle(moudleList[activeIndex].data)
    }
  }

  render() {
    const {moudleList, activeIndex, isInput, inputIndex, changeValue, isNoMoudleList} = this.state
    return (
      <div className="moudleList_page">
        <div className="moudleList_box">
          <div className="moudleList_head">
            {window.intl.get('请选择您想应用的水印模版')}
            <span className="closeMoudleList" onClick={this.props.closeMoudleList}></span>
          </div>

          <ul className="moudleList_content">
            {moudleList.length > 0 ?
              moudleList.map((item, index) => {
                return <li className={activeIndex === index ?
                  "moudleList_detail active" : "moudleList_detail"}
                           key={index}>
                  {index === 0 ?
                    <div className="moudleTip" id="moudleTip">{window.intl.get('快来给模板起个新名字吧')}</div> : ''
                  }
                  <div className="moudle_detail_box"
                       onClick={() => this.setState({activeIndex: index})}>
                    <div className="moudle_detail_imgBox"
                         style={{
                           width: `${JSON.parse(item.videoInfo).videoWidth * (250 / 791)}px`,
                           height: `${JSON.parse(item.videoInfo).videoHeight * (140 / 443)}px`
                         }}
                    >
                      {item.cover ?
                        <img src={item.cover}
                             alt={item.name}/> : ''
                      }
                    </div>
                  </div>
                  <div className="moudle_controlBox">
                    <div className="moudle_nameBox">
                      {isInput && inputIndex === index ?
                        <input type="text"
                               maxLength={30}
                               value={changeValue}
                               autoFocus={true}
                               onChange={this.changeMoudleName}
                               onBlur={this.saveMoudle.bind(this, index)}
                               onKeyUp={this.onKeyUp.bind(this, index)}
                               className="input_name"/>
                        :
                        <p className="moudle_name"
                           onDoubleClick={this.inputName.bind(this, index)}>
                          {item.name}</p>
                      }
                      <span className={isInput && inputIndex === index ?
                        "moudle_editName edit_active" : "moudle_editName"}
                            onClick={this.inputName.bind(this, index)}></span>
                    </div>
                    <div className="moudle_timeBox">
                      <p className="moudle_time">{item.add_time}</p>
                      <span className={isInput && inputIndex === index ?
                        "moudle_delete delete_active" : "moudle_delete"}
                            onClick={this.deleteMoudle.bind(this, index)}
                      ></span>
                    </div>
                  </div>
                </li>
              })
              :
              isNoMoudleList ?
                <div className="nomoudleList_box">
                  <div className="nomoudleList_img"></div>
                  <p className="nomoudleList_tit">{window.intl.get('哎呀，这里空空如也！')}</p>
                  <p className="nomoudleList_tip">{window.intl.get('快去保存一个模板吧')}</p>
                </div>
                : ''
            }
          </ul>

          <div className="moudleList_bottom">
            <div className={moudleList.length === 0 ?
              "moudleList_btn cantClick" : "moudleList_btn"}
                 onClick={this.confirmMoudle}>
              {window.intl.get('使用')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}