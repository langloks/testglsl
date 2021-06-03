const paintings = [
  { src: "algo.png", title: "1 / 6" },
  { src: "botanica.png", title: "2 / 6" },
  { src: "shifting.png", title: "3 / 6" },
  { src: "narci.png", title: "4 / 6" },
  { src: "replace1.png", title: "5 / 6" },
  { src: "replace2.png", title: "6 / 6" }
]

const prevTag = document.querySelector("nav a.prev")
const nextTag = document.querySelector("nav a.next")
const descriptionTag = document.querySelector("header div")

const canvas = document.querySelector("div.canvas-holder canvas")
const sandbox = new GlslCanvas(canvas)
sandbox.load(frag(paintings))

let startIndex = 0
let endIndex = 0
let timeline = performance.now() - 9999

const sizer = function () {
  const ww = window.innerWidth
  const wh = window.innerHeight
  const s = Math.min(ww, wh)
  const dpi = window.devicePixelRatio
  
  canvas.width = s * 0.6 * dpi
  canvas.height = s * 0.9 * dpi
  canvas.style.width = Math.round(s * 0.6) + "px"
  canvas.style.height = Math.round(s * 0.9) + "px"
}

const next = function () {
  endIndex = endIndex + 1
  
  if (endIndex > paintings.length - 1) {
    endIndex = 0
  }
  
  update()
}

const prev = function () {
  endIndex = endIndex - 1
  
  if (endIndex < 0) {
    endIndex = paintings.length - 1
  }
  
  update()
}

const update = function () {
  
  descriptionTag.innerHTML = paintings[endIndex].title
  timeline = performance.now()
  
  sandbox.setUniform("startIndex", startIndex)
  sandbox.setUniform("endIndex", endIndex)
  tick()
  
  // for the next time we update
  startIndex = endIndex
}

const tick = function () {
  const diff = (performance.now() - timeline) / 1000
  sandbox.setUniform("timeline", diff)
  requestAnimationFrame(tick)
}

const load = function () {
  sizer()
  tick()
  
  paintings.forEach((painting, index) => {
    sandbox.setUniform(`textures[${index}]`, painting.src)
  })
}

// events
load()

nextTag.addEventListener("click", function (event) {
  event.preventDefault()
  next()
})

prevTag.addEventListener("click", function (event) {
  event.preventDefault()
  prev()
})

window.addEventListener("resize", function () {
  sizer()
})