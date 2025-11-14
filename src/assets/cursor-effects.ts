type Point = { x: number; y: number }

class Circle {
  origin: Point
  position: Point
  color: string
  speed: number
  angle: number
  context: CanvasRenderingContext2D
  renderCount: number

  constructor({
    origin,
    speed,
    color,
    angle,
    context,
  }: {
    origin: Point
    speed: number
    color: string
    angle: number
    context: CanvasRenderingContext2D
  }) {
    this.origin = origin
    this.position = { ...this.origin }
    this.color = color
    this.speed = speed
    this.angle = angle
    this.context = context
    this.renderCount = 0
  }

  draw(): void {
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
    this.context.fill()
  }

  move(): void {
    this.position.x = Math.sin(this.angle) * this.speed + this.position.x
    this.position.y = Math.cos(this.angle) * this.speed + this.position.y + this.renderCount * 0.3
    this.renderCount++
  }
}

class Boom {
  origin: Point
  context: CanvasRenderingContext2D
  circleCount: number
  area: { width: number; height: number }
  stop: boolean
  circles: Circle[]

  constructor({
    origin,
    context,
    circleCount = 10,
    area,
  }: {
    origin: Point
    context: CanvasRenderingContext2D
    circleCount?: number
    area: { width: number; height: number }
  }) {
    this.origin = origin
    this.context = context
    this.circleCount = circleCount
    this.area = area
    this.stop = false
    this.circles = []
  }

  private randomArray(range: string[]): string {
    const length = range.length
    const randomIndex = Math.floor(length * Math.random())
    return range[randomIndex] || '0'
  }

  private randomColor(): string {
    const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    return (
      '#' +
      this.randomArray(range) +
      this.randomArray(range) +
      this.randomArray(range) +
      this.randomArray(range) +
      this.randomArray(range) +
      this.randomArray(range)
    )
  }

  private randomRange(start: number, end: number): number {
    return (end - start) * Math.random() + start
  }

  init(): void {
    for (let i = 0; i < this.circleCount; i++) {
      const circle = new Circle({
        context: this.context,
        origin: this.origin,
        color: this.randomColor(),
        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
        speed: this.randomRange(1, 6),
      })
      this.circles.push(circle)
    }
  }

  move(): void {
    this.circles.forEach((circle, index) => {
      if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
        this.circles.splice(index, 1)
        return
      }
      circle.move()
    })
    if (this.circles.length === 0) {
      this.stop = true
    }
  }

  draw(): void {
    this.circles.forEach((circle) => circle.draw())
  }
}

class CursorSpecialEffects {
  computerCanvas: HTMLCanvasElement
  renderCanvas: HTMLCanvasElement
  computerContext: CanvasRenderingContext2D
  renderContext: CanvasRenderingContext2D
  globalWidth: number
  globalHeight: number
  booms: Boom[]
  running: boolean

  constructor() {
    this.computerCanvas = document.createElement('canvas')
    this.renderCanvas = document.createElement('canvas')

    this.computerContext = this.computerCanvas.getContext('2d')!
    this.renderContext = this.renderCanvas.getContext('2d')!

    this.globalWidth = window.innerWidth
    this.globalHeight = window.innerHeight

    this.booms = []
    this.running = false
  }

  handleMouseDown(e: MouseEvent): void {
    const boom = new Boom({
      origin: { x: e.clientX, y: e.clientY },
      context: this.computerContext,
      area: {
        width: this.globalWidth,
        height: this.globalHeight,
      },
    })
    boom.init()
    this.booms.push(boom)
    if (!this.running) {
      this.run()
    }
  }

  handlePageHide(): void {
    this.booms = []
    this.running = false
  }

  init(): void {
    const style = this.renderCanvas.style
    style.position = 'fixed'
    style.top = style.left = '0'
    style.zIndex = '999999999999999999999999999999999999999999'
    style.pointerEvents = 'none'

    this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
    this.renderCanvas.height = this.computerCanvas.height = this.globalHeight
    style.width = `${this.globalWidth}px`
    style.height = `${this.globalHeight}px`

    document.body.append(this.renderCanvas)

    window.addEventListener('mousedown', this.handleMouseDown.bind(this))
    window.addEventListener('pagehide', this.handlePageHide.bind(this))
  }

  run(): void {
    this.running = true
    if (this.booms.length === 0) {
      this.running = false
      return
    }

    requestAnimationFrame(this.run.bind(this))

    this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
    this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

    this.booms.forEach((boom, index) => {
      if (boom.stop) {
        this.booms.splice(index, 1)
        return
      }
      boom.move()
      boom.draw()
    })

    this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
  }
}

const cursorSpecialEffects = new CursorSpecialEffects()
cursorSpecialEffects.init()

export { Circle, Boom, CursorSpecialEffects }
