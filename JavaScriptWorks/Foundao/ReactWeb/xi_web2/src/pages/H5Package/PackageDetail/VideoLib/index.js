import React, {Component} from 'react';
import {
  Form, Input, Button, Dialog, Tabs, Loading, Table, Pagination, 
  // Select,MessageBox, 
  Message, Notification,Checkbox
} from 'element-react';

import httpRequest from '@/utils/httpRequest';
import tools from '@/utils/tool';
import api from '@/API/api';
import Upload from '@/components/Ks3Upload';
import './index.scss'
/*视频库管理*/
export default
class VideoLib extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit_id: '',           // 编辑的id
      multi_selection: [],   // 多选数组
      articleId: '',         // 具体文章的评论
      packageID: '', // 直播id
      page_size: 10,
      current_page: 1,
      activeTab: '1',  // 1 为回放列表   2为直播暂存
      total: 0,
      selectedNum:0, //已选数量
      videoEditForm: {
        title: '',  //视频名称
        cover: '',  //视频封面链接
        video_url: '' //视频链接
      },
      dialogVisible_videoEdit:false, //添加视频弹框
      rules: {  //添加视频form验证
        title: {required: true, message: '名称不能为空', trigger: 'blur'},
        cover: {required: true, message: '封面不能为空', trigger: 'blur'},
        video_url: {required: true, message: '视频不能为空', trigger: 'blur'},
      },
      form_audit: {
        audit_type: ''
      },
      columns: [
        {
          type: 'selection',
          minWidth: 50,
        },
        {
          label: "缩略图",
          width: 110,
          render: (row) => {
            return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
          }
        },
        {
          minWidth: 120,
          label: "频道名称",
          prop: "nickname",
          render: (row) => {
            return <span>{row.nick_name}</span>
          }
        },
        {
          label: "视频时长",
          width: 130,
          prop: "content"
        },
        {
          label: "添加时间",
          width: 170,
          prop: 'addTime',
          render: (row) => {
            return <span>{row.gmt_create}</span>
          }
        },
        {
          label: "操作",
          minWidth: 100,
          render: (row) => {
            const {activeTab} = this.state;
            if (activeTab === '1') { // 回放列表
              return (
                <span>
                  <Button type='text'
                          size='small'
                          onClick={this.handel_audit.bind(this, row, 'pass')}>视频地址</Button>
                </span>
              )
            } else if (activeTab === '2') {  // 直播暂存
              return (<span>
                {<Button type='text'
                         size='small'
                         onClick={this.handel_setTop.bind(this, row)}>预览</Button>}
                <Button type='text'
                        size='small'
                        onClick={this.handel_del.bind(this, row)}>裁剪</Button>
                <Button type='text'
                        size='small'
                        className='redColor'
                        onClick={this.handel_del.bind(this, row)}>下载地址</Button>
              </span>)
            } 
          }
        }
      ],
      data: []
    }
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = tools.getParams(search) || {};
    const page = params.page;
    const {packageID} = this.props.match.params;
    this.setState({
      current_page: page ? page / 1 : 1,
      packageID: packageID || ''
    }, () => {
      this.getList();
    });
  };

  componentWillUnmount() {
    tools.hide_loading();
  }

  getList = () => {
    this.setState({
      is_loading: true,
      data: [],
      multi_selection: [], // 多选选项置空
      total: 0,
    });
    const {current_page, page_size, activeTab} = this.state;
    httpRequest({
      url: api.commentList,
      type: 'post',
      data: {
        type: activeTab,
        page: current_page,
        limit: page_size,
        h5_id: this.state.packageID
      }
    }).done((resp) => {
      if (resp.code / 1 === 0) {
        this.setState({
          data: resp.data.list || [],
          total: resp.data.total,
          is_loading: false
        })
      } else {
        Message.error(resp.msg);
        this.setState({
          is_loading: false
        })
      }
    }).fail(err => {
      Notification.error({
        title: '接口请求失败',
        message: '内部服务器错误' + err.status
      });
    })
  };
  _onChange_forbid = (key, value) => {
    const {form_forbid} = this.state;
    this.setState({
      form_forbid: Object.assign({}, form_forbid, {[key]: value})
    })
  };
  form_auditChange = (key, value) => {
    const {form_audit} = this.state;
    this.setState({
      form_audit: Object.assign({}, form_audit, {[key]: value})
    })
  };

  // 重置表单
  handleReset(formName) {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].resetFields();
  }

  // 验证表单是否填写完毕
  validate_form = (formName, success) => {
    const form_ref = formName || 'ruleForm';
    this.refs[form_ref].validate((valid) => {
      if (valid) {
        if (typeof success === 'function') {
          success();
        }
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };

  // 删除
  // handel_del = (row) => {
  //   MessageBox.confirm('确定是否删除此评论?', '提示', {
  //     type: 'warning'
  //   }).then(() => {
  //     this.del_ajax(row.id);
  //   }).catch(() => {
  //   });
  // };
  // 删除的ajax
  del_ajax = (ids) => {
    // ids 多个id ,隔开
    httpRequest({
      url: api.commentDelete,
      type: 'POST',
      data: {
        ids: ids,
        h5_id: this.state.packageID,
        type: 'delete'
      }
    }).done(resp => {
      if (resp.code / 1 === 0) {
        this.setState({
          multi_selection: []
        });
        Message.success('操作成功');
        this.getList();
      } else {
        Message.error('操作成功: ' + resp.msg);
      }
    }).fail((jqXHR = {}) => {
      Notification.error({
        title: '操作失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    })
  };

  // 多选删除
  // multi_del = () => {
  //   const {multi_selection} = this.state;
  //   const idArr = multi_selection.map(item => {
  //     return item.id
  //   });
  //   if (idArr.length < 1) {
  //     Message.error('请先勾选相关内容');
  //     return false;
  //   }
  //   this.del_ajax(idArr.join(','));
  // };
  // 审核操作
  handel_audit = (row, type) => {
    this.audit_ajax(row.id, type);
  };
  // 审核ajax
  audit_ajax = (ids, type = 'no_pass') => {
    // type: no_pass审核不通过  pass审核通过
    const ary = ids.split(',');
    const idsAry = JSON.stringify(ary)
    httpRequest({
      url: api.commentCheck,
      type: 'POST',
      data: {
        ids: idsAry,
        type: type,
        h5_id: this.state.packageID
      }
    }).done(resp => {
      if (resp.code / 1 === 0) {
        Message.success('操作成功');
        this.setState({
          multi_selection: []
        });
        this.getList();
      } else {
        Message.error('操作失败: ' + resp.msg);
      }
    }).fail((jqXHR = {}) => {
      Notification.error({
        title: '操作失败',
        message: '内部服务器错误 ' + jqXHR.status
      });
    })
  };

  // 多选审核
  multi_audit = (type) => {
    const {multi_selection} = this.state;
    const idArr = multi_selection.map(item => {
      return item.id
    });
    if (idArr.length < 1) {
      Message.error('请先勾选相关内容');
      return false;
    }
    this.audit_ajax(idArr.join(','), type);
  };

  // 分页
  currentChange = (current_page) => {
    const {articleId} = this.state;
    const {pathname} = this.props.location;
    let articleIdParams = '';
    if (articleId) {
      articleIdParams = '&articleId=' + articleId;
    }
    this.props.history.replace(pathname + `?page=${current_page}${articleIdParams}`);
    this.setState({
      current_page: current_page
    }, () => {
      this.getList()
    });
  };

  // 改变tabs选项
  changeTabs = (tab) => {
    this.setState({
      activeTab: tab.props.name,
      current_page: 1
    }, () => {
      // const {articleId} = this.state;
      // const {pathname} = this.props.location;
      // let articleIdParams = '';
      // if (articleId) {
      //   articleIdParams = '&articleId=' + articleId;
      // }
      // this.props.history.replace(pathname + `?page=1${articleIdParams}`);
      if(tab.props.name === '1'){
        this.setState({
          columns: [
            {
              type: 'selection',
              minWidth: 50,
            },
            {
              label: "缩略图",
              width: 110,
              render: (row) => {
                return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
              }
            },
            {
              minWidth: 120,
              label: "频道名称",
              prop: "nickname",
              render: (row) => {
                return <span>{row.nick_name}</span>
              }
            },
            {
              label: "视频时长",
              width: 130,
              prop: "content"
            },
            {
              label: "添加时间",
              width: 170,
              prop: 'addTime',
              render: (row) => {
                return <span>{row.gmt_create}</span>
              }
            },
            {
              label: "操作",
              minWidth: 100,
              render: (row) => {
                  return (
                    <span>
                      <Button type='text'
                              size='small'
                              onClick={this.handel_audit.bind(this, row, 'pass')}>视频地址</Button>
                    </span>
                  )
              }
            }
          ],
        })
      } else {
        this.setState({
          columns: [
            {
              type: 'selection',
              minWidth: 50,
            },
            {
              label: "缩略图",
              width: 110,
              render: (row) => {
                return <div className="table_image avatar">{row.avatar ? <img src={row.avatar} alt=""/> : ""}</div>
              }
            },
            {
              minWidth: 120,
              label: "频道名称",
              prop: "nickname",
              render: (row) => {
                return <span>{row.nick_name}</span>
              }
            },
            {
              label: "视频时长",
              width: 130,
              prop: "content"
            },
            {
              label: "添加时间",
              width: 170,
              prop: 'addTime',
              render: (row) => {
                return <span>{row.gmt_create}</span>
              }
            },
            {
              label:'剩余暂存天数',
              render:() => {

              }
            },
            {
              label: "操作",
              minWidth: 100,
              render: (row) => {
                  return (<span>
                    {<Button type='text'
                             size='small'
                             onClick={this.handel_setTop.bind(this, row)}>预览</Button>}
                    <Button type='text'
                            size='small'
                            onClick={this.handel_del.bind(this, row)}>裁剪</Button>
                    <Button type='text'
                            size='small'
                            className='redColor'
                            onClick={this.handel_del.bind(this, row)}>下载地址</Button>
                  </span>)
              }
            }
          ],
        })
      }
      this.getList();
    })
  };

  // 多选
  selectChange = (selection) => {
    this.setState({
      multi_selection: selection
    })
  };

  close_dialog = () => {
    this.setState({
      dialogVisible_videoEdit: false
    })
  };


  //点击全选按钮
  onClick_checkedAll = () => {

  }

  //点击添加视频按钮
  addVideo = () => {
    const videoEditForm = {
      id: '',
      title: '',  //视频名称
      cover: '',  //视频封面链接
      video_url: '' //视频链接
    };
    this.setState({
      videoEditForm,
      dialogVisible_videoEdit: true
    })
  }

  // 编辑
  _onChange = (key, formName, value) => {
    this.setState({
      [formName]: Object.assign({}, this.state[formName], {[key]: value})
    });
  };

  render() {
    const {
      is_loading, page_size, current_page, total, activeTab, 
      // form_forbid, forbidTime,
      videoEditForm,
      dialogVisible_videoEdit
    } = this.state;
    return (
      <div className="comment_wrapper comment_page">


        {/*搜索框*/}
        {/* <div className="table_toolbar clearBoth">
         </div> */}
        <div className='commentHeader'>
          <Tabs activeName={activeTab} onTabClick={this.changeTabs}>
            <Tabs.Pane label="回放列表" name="1"/>
            <Tabs.Pane label="直播暂存" name="2"/>
          </Tabs>
          <div className="batch_wrapper clearBoth">
            <div className="batch-btn-group">
              {/*上方导航栏右侧内容*/}
              <span><Checkbox checked={this.state.checkedAll} onClick={this.onClick_checkedAll.bind(this)}>全选</Checkbox></span>
              <span className='selected'>已选 <span>{`(${this.state.selectedNum})`}</span> </span>
              {<Button onClick={this.multi_audit.bind(this, 'merge')}>合并</Button>}
              <span className='delButton'>
                {<Button onClick={this.multi_audit.bind(this, 'del')}>删除</Button>}
              </span>
              
              {<Button type='primary' icon="plus" onClick={this.addVideo.bind(this)}>添加视频</Button>}
            </div>
          </div>
        </div>

        <Loading loading={is_loading} text="拼命加载中">
          <Table
            columns={this.state.columns}
            data={this.state.data}
            border={true}
            stripe={true}
            align='center'
            onSelectChange={this.selectChange}
          />
          <div className="pagination_wrapper">
            <Pagination layout="total, prev, pager, next, jumper"
                        pageSize={page_size}
                        currentPage={current_page}
                        total={total}
                        onCurrentChange={this.currentChange}
            />
          </div>
        </Loading>
        {/* 视频编辑弹框 */}
        <Dialog
          title="添加视频"
          closeOnClickModal={false}
          visible={dialogVisible_videoEdit }
          onCancel={ () => this.setState({dialogVisible_videoEdit: false}) }
        >
          <Dialog.Body>
            <Form model={videoEditForm}
                  labelWidth="120"
                  ref="ruleForm"
                  rules={this.state.rules}>
              <Form.Item label="视频名称: "
                         prop="title"
              >
                <Input value={videoEditForm.title} onChange={this._onChange.bind(this, 'title', 'videoEditForm')}/>
              </Form.Item>
              <Form.Item label="视频封面: " prop="cover">
                <Upload cover={videoEditForm.cover}
                        type={'h5Icon'}
                        successCallBack={this._onChange.bind(this, 'cover', 'videoEditForm')}/>
              </Form.Item>
              <Form.Item label="上传视频: " prop="video_url">
                <p>
                  {videoEditForm.video_url ?
                    <a className="break_all" href={videoEditForm.video_url}
                       target="_blank">{videoEditForm.video_url}</a> : ''}
                </p>
                <Upload cover={videoEditForm.video_url}
                        fileType={'video'}
                        showButton={true}
                        successCallBack={this._onChange.bind(this, 'video_url', 'videoEditForm')}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({dialogVisible_videoEdit: false}) }>取 消</Button>
            <Button type="primary" onClick={ this.handel_submit}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}