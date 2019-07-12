/**
 * Created by DELL on 2019/5/14.
 */
import React, {Component} from 'react';
import './index.scss';

export default
class ImgPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgList: ['1', '2']
    };

  }

  componentWillMount() {

  }

  componentDidMount() {

    setTimeout(this.initSwiper, 1000)
  }

  componentWillUnmount() {

  }

  initSwiper = () => {
    const galleryThumbs = new window.Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 8,
      // slidesPerView: 'auto',
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });
    new window.Swiper('.gallery-top', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs
      }
    });

  };
  preventEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  close = () => {
    const {onClose} = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const {imgList = []} = this.state;

    return (
      <div className="img_preview" onClick={this.close}>
        {/*<!-- Swiper -->*/}
        <div className="swiper-container gallery-top" onClick={this.preventEvent}>
          <div className="swiper-wrapper">

            {imgList.map((item, index) => {
              return <div key={index} className="swiper-slide">
                <div className="preview_img_box">{item}</div>
              </div>
            })}
          </div>
          {/*<!-- Add Arrows -->*/}
          <div className="swiper-button-next swiper-button-white"/>
          <div className="swiper-button-prev swiper-button-white"/>
        </div>
        <div className="swiper-container gallery-thumbs" onClick={this.preventEvent}>
          <div className="swiper-wrapper">
            {imgList.map((item, index) => {
              return <div key={index} className="swiper-slide">{item}</div>
            })}
          </div>
        </div>

      </div>
    );
  }
}
