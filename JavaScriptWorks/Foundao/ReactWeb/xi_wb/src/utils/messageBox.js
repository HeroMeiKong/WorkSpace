// import $ from 'jquery'
const $ = window.jQuery;
export default function messageBox(msg,time) {
  const messageBoxBg = $('#Message_box_bg')
  const messageBox = $('#Message_box')
  messageBoxBg.fadeIn()
  messageBox.html(msg)
  setTimeout(function () {
    messageBoxBg.fadeOut(function () {
      messageBox.html('')
    })
  },time || 2000)
}