import React, { Component } from 'react'
import './PageCounter.scss'

class PageCounter extends Component {
  static defaultProps = {
    page: 1,
  }

  constructor() {
    super()
    this.state = {
      whichPage: 0
    }
  }

  componentDidMount() {
    if(this.props.url && this.props.url.params.page){
      const page = this.props.url.params.page.split('=')[1]
      this.setState({
        whichPage: page-1 || 0
      })
    }
  }

  pickkMe = (e) => {
    window.scrollTo(0,0)
    const { whichPage } = this.state
    if(whichPage === e.target.innerText-1){
      console.log('Same Page')
    } else {
      this.setState({
        whichPage: e.target.innerText-1,
        page: e.target.innerText
      })
      this.props.callBack(e.target.innerText)
    }
  }

  previousPage = () => {
    window.scrollTo(0,0)
    const { whichPage } = this.state
    let page = whichPage + 1
    if(page > 1){
      this.setState({
        whichPage: whichPage-1,
      })
      this.props.callBack(page-1)
    } else {
      console.log('First Page')
    }

  }

  nextPage = () => {
    window.scrollTo(0,0)
    const { whichPage } = this.state
    let page = whichPage + 1
    if(page < this.props.page){
      this.setState({
        whichPage: whichPage+1,
      })
      this.props.callBack(page+1)
    } else {
      console.log('Last Page')
    }

  }

  renderPage = (length) => {
    let arr = []
    if(length){
      for(let i=0;i<length;i++){
        arr.push(i)
      }
    } else {
      arr.push(1)
    }
    return arr
  }

  render () {
    const { page } = this.props
    const { whichPage } = this.state
    const arrs = this.renderPage(page)
    return (
      <div className='pagecounter'>
        <div className="pagecounter_inner">
          <div className="previous" onClick={this.previousPage}></div>
          <div className="pages">
            {arrs.map((arr,i) => <div onClick={this.pickkMe} className={whichPage-0 === i ? 'page active' : 'page'} key={i}>{i+1}</div>)}
          </div>
          <div className="next" onClick={this.nextPage}></div>
        </div>
      </div>
    )
  }
}

export default PageCounter