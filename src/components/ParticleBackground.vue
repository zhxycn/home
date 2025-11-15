<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let particles: Particle[] = []
let width = 0
let height = 0
let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

function randomColor(): string {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * (95 - 75) + 75)
  const l = Math.floor(Math.random() * (60 - 45) + 45)
  const a = Math.random() * 0.1 + 0.2
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

function resize(): void {
  const c = canvas.value
  if (!c) return
  width = window.innerWidth
  height = window.innerHeight
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  c.width = Math.floor(width * dpr)
  c.height = Math.floor(height * dpr)
  c.style.width = width + 'px'
  c.style.height = height + 'px'
  ctx = c.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  initParticles()
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function createParticle(): Particle {
  const speedBase = width > 1024 ? 0.15 : 0.12
  return {
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-speedBase, speedBase),
    vy: rand(-speedBase * 0.5, speedBase * 0.5),
    r: rand(0.9, 2.2),
    color: randomColor(),
  }
}

function initParticles(): void {
  const area = width * height
  const density = 0.00008
  const target = Math.max(30, Math.min(120, Math.floor(area * density)))
  particles = Array.from({ length: target }, () => createParticle())
}

function step(): void {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    if (!p) continue
    p.x += p.vx
    p.y += p.vy
    p.vx += rand(-0.004, 0.004)
    p.vy += rand(-0.003, 0.003)
    p.vx = Math.max(-0.25, Math.min(0.25, p.vx))
    p.vy = Math.max(-0.15, Math.min(0.15, p.vy))
    if (p.x < -5) p.x = width + 5
    else if (p.x > width + 5) p.x = -5
    if (p.y < -5) p.y = height + 5
    else if (p.y > height + 5) p.y = -5
  }
}

function draw(): void {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    if (!p) continue
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function animate(): void {
  step()
  draw()
  raf = requestAnimationFrame(animate)
}

onMounted((): void => {
  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(animate)
})

onUnmounted((): void => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" />
</template>
