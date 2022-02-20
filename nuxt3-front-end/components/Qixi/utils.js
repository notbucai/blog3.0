export function fullScreen () {
  var el = document.documentElement;
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  };
  return;
}

export const requestAnimFrame = (function () {
  if (typeof window == 'undefined') return ()=>{};
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

export const heartShape = (r, value) => {
  let m, n, x, y;

  m = value;
  n =
    -r * (((Math.sin(m) * Math.sqrt(Math.abs(Math.cos(m))))
      /
      (Math.sin(m) + 1.4)) - 2 * Math.sin(m) + 2);

  x = n * Math.cos(m);
  y = n * Math.sin(m);

  return {
    x, y
  }
};

export const randomIndex = (len, last) => {
  let current = 0;
  for (let i = 0; i < 3; i++) {
    current = (Math.random() * len) | 0;
    if (current !== last) return current;
  }
  return current;
}

export const getImageByUrl = (src) => {
  const img = new Image();
  img.src = src;
  return img;
}

export function getGenerate (canvas) {
  let fontSize = 130
  let CANVAS_WIDTH = window.innerWidth;
  let CANVAS_HEIGHT = window.innerHeight;
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  let ctx = canvas.getContext('2d')
  ctx.font = 'bold ' + fontSize + 'px Microsoft YaHei'
  ctx.fillStyle = 'blue'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  let circleList
  let colors = [
    '#a09d1d',
    '#84b826',
    '#168a30',
    '#155fbf',
    '#40148c',
    '#5f168b',
    '#93148c',
    '#970c0d',
    '#af2e15',
    '#ab4913',
    '#a45a12',
    '#514e0e',
  ]

  const randomInt = (min, max) => {
    return (Math.random() * (max - min) + min) | 0;
  }

  const toHex = (num = 0) => {
    return parseInt(num).toString(16).padStart(2, '0');
  }

  const randomColor = () => {

    const r = randomInt(0, 0xff);
    const g = randomInt(0, 0xff);
    const b = randomInt(0, 0xff);
    const a = randomInt(0x55, 0xff);
    return '#' + toHex(r) + toHex(g) + toHex(b) + toHex(a);
  }

  let Circle = function (targetX, targetY, curX, curY) {
    this.targetX = targetX
    this.targetY = targetY
    this.x = curX || targetX
    this.y = curY || targetY
    this.color = randomColor();
    let _speed = 0.1;
    this.done = false

    this.update = function () {
      if (Math.abs(this.targetX - this.x) >= 0.05 || Math.abs(this.targetY - this.y) >= 0.05) {
        this.x += (this.targetX - this.x) * _speed
        this.y += (this.targetY - this.y) * _speed
      }
      else {
        this.done = true
      }
      this.render()
    }

    this.render = function () {
      Circle.ctx.save()
      Circle.ctx.fillStyle = this.color
      Circle.ctx.strokeWeight = 3;
      Circle.ctx.strokeStyle = '#000';
      Circle.ctx.beginPath()
      Circle.ctx.arc(this.x, this.y, Circle.radius, 0, 2 * Math.PI, false)
      Circle.ctx.fill()
      Circle.ctx.restore()
    }
  }

  Circle.ctx = ctx
  Circle.diameter = 8
  Circle.radius = Circle.diameter / 4
  Circle.space = 1

  function generate (word) {
    let wordWidth = ctx.measureText(word).width
    let wordHeight = 300;
    let wordPosition = {
      x: (CANVAS_WIDTH - wordWidth) / 2,
      y: (CANVAS_HEIGHT - wordHeight) / 2
    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillText(word, wordPosition.x, wordPosition.y) //轻微调整绘制字符位置
    let imageData = new Uint32Array(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.buffer)
    let i, j
    !circleList && (circleList = [])
    let totalCount = 0
    let circle
    for (i = 0; i < CANVAS_HEIGHT; i += Circle.diameter + Circle.space) {
      for (j = 0; j < CANVAS_WIDTH; j += Circle.diameter + Circle.space) {
        if (!!imageData[i * CANVAS_WIDTH + j]) {
          if (totalCount < circleList.length) {
            circle = circleList[totalCount]
            circle.targetX = j
            circle.targetY = i
            circle.done = false
          }
          else {
            circleList.push(new Circle(j, i, wordPosition.x + Math.random() * wordWidth, Math.random() * 200))
          }
          totalCount++
        }
      }
    }
    circleList = circleList.slice(0, totalCount - 1)
    tick(true)
  }

  let doneCount = 0

  function updateAll () {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    doneCount = 0
    for (let i = 0; i < circleList.length; i++) {
      circleList[i].update()
      circleList[i].done && doneCount++
    }
    doneCount === circleList.length && (rendering = false)
  }

  let rendering = true
  let last = Date.now()
  let now
  let delta
  let fps
  let tick = function (forceRender) {
    forceRender === true && (rendering = true)
    if (!rendering) return false
    now = Date.now()
    delta = now - last
    last = now
    updateAll()
    requestAnimationFrame(tick)
  }

  // generate('start!')
  return generate;
}