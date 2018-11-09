let batten = document.querySelector('.batteninner')
let oldBox, newBox = {},
  mouse = {}
let lock = false


batten.addEventListener('mousedown', (e) => {
  console.log('mousedown')
  oldBox = batten.getBoundingClientRect()
  console.log(oldBox)
  mouse.x = e.offsetX
  mouse.y = e.offsetY
  lock = true;
})
batten.addEventListener('mousemove', (e) => {
  if (lock) {
    console.log('mousemove')
    newBox.x = e.offsetX - mouse.x + oldBox.x
    newBox.y = e.offsetY - mouse.y + oldBox.y
    battenMove(newBox)
    //console.log(newBox)
  }


})
batten.addEventListener('mouseup', () => {
  lock = false;
  console.log('mouseup')
})

function battenMove(coordinate, ) {
  batten.setAttribute('style', 'top:' + coordinate.y + 'px;left:' + coordinate.x + 'px')
  //console.log(batten)
}