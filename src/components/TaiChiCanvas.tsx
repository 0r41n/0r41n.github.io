import { useEffect, useRef } from 'react'

type TaiChiCanvasProps = {
  mode: 'yin' | 'yang'
  paused: boolean
}

type NodePoint = {
  angle: number
  radius: number
  speed: number
  size: number
  phase: number
  x: number
  y: number
}

const trigrams = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

export default function TaiChiCanvas({ mode, paused }: TaiChiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frame = 0
    let lastTime = 0
    let elapsed = 0
    let nodes: NodePoint[] = []

    const makeNodes = () => {
      const count = width < 520 ? 34 : 58
      nodes = Array.from({ length: count }, (_, index) => {
        const seed = Math.sin(index * 91.733) * 43758.5453
        const fraction = seed - Math.floor(seed)
        return {
          angle: (index / count) * Math.PI * 2 + fraction,
          radius: 0.18 + ((index * 37) % 100) / 155,
          speed: (0.025 + (index % 7) * 0.006) * (index % 2 === 0 ? 1 : -1),
          size: 1 + (index % 4) * 0.45,
          phase: fraction * Math.PI * 2,
          x: 0,
          y: 0,
        }
      })
    }

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      makeNodes()
    }

    const draw = (time: number) => {
      if (time - lastTime < 1000 / 60) {
        frame = window.requestAnimationFrame(draw)
        return
      }
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05)
      lastTime = time
      if (!paused && !reducedMotion.matches && !document.hidden) elapsed += delta

      context.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      const unit = Math.min(width, height)
      const direction = mode === 'yang' ? 1 : -1
      const accent = mode === 'yang' ? '217, 111, 79' : '126, 176, 157'
      const paper = '224, 226, 213'

      const halo = context.createRadialGradient(cx, cy, unit * 0.02, cx, cy, unit * 0.48)
      halo.addColorStop(0, `rgba(${accent}, 0.12)`)
      halo.addColorStop(0.5, `rgba(${accent}, 0.035)`)
      halo.addColorStop(1, `rgba(${accent}, 0)`)
      context.fillStyle = halo
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(cx, cy)
      context.rotate(elapsed * 0.018 * direction)
      for (let ring = 1; ring <= 4; ring += 1) {
        context.beginPath()
        context.setLineDash(ring % 2 === 0 ? [2, 9] : [1, 14])
        context.strokeStyle = `rgba(${paper}, ${0.075 + ring * 0.018})`
        context.lineWidth = 0.8
        context.arc(0, 0, unit * (0.16 + ring * 0.075), 0, Math.PI * 2)
        context.stroke()
      }
      context.setLineDash([])

      for (let index = 0; index < 8; index += 1) {
        const angle = (index / 8) * Math.PI * 2 - Math.PI / 2
        const inner = unit * 0.365
        const outer = unit * 0.405
        context.beginPath()
        context.strokeStyle = `rgba(${accent}, ${index % 2 === 0 ? 0.55 : 0.28})`
        context.lineWidth = 1
        context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
        context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
        context.stroke()

        context.save()
        context.translate(Math.cos(angle) * unit * 0.435, Math.sin(angle) * unit * 0.435)
        context.rotate(-elapsed * 0.018 * direction)
        context.fillStyle = `rgba(${paper}, 0.65)`
        context.font = `${Math.max(13, unit * 0.032)}px "Songti SC", "SimSun", serif`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(trigrams[index], 0, 0)
        context.restore()
      }
      context.restore()

      nodes.forEach((node, index) => {
        const angle = node.angle + elapsed * node.speed * direction
        const radius = unit * node.radius * 0.43
        const wave = Math.sin(elapsed * 0.45 + node.phase) * unit * 0.012
        let x = cx + Math.cos(angle) * (radius + wave)
        let y = cy + Math.sin(angle) * (radius + wave) * 0.84
        const pointer = pointerRef.current
        if (pointer.active && !reducedMotion.matches) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance < 110 && distance > 0) {
            const force = (110 - distance) / 110
            x += (dx / distance) * force * (mode === 'yang' ? 24 : -14)
            y += (dy / distance) * force * (mode === 'yang' ? 24 : -14)
          }
        }
        node.x = x
        node.y = y

        if (index % 3 === 0) {
          for (let next = index + 1; next < Math.min(index + 9, nodes.length); next += 1) {
            const other = nodes[next]
            const distance = Math.hypot(node.x - other.x, node.y - other.y)
            if (distance < unit * 0.105 && other.x !== 0) {
              context.beginPath()
              context.strokeStyle = `rgba(${accent}, ${0.11 * (1 - distance / (unit * 0.105))})`
              context.lineWidth = 0.65
              context.moveTo(node.x, node.y)
              context.lineTo(other.x, other.y)
              context.stroke()
            }
          }
        }

        context.beginPath()
        context.fillStyle = `rgba(${index % 5 === 0 ? accent : paper}, ${0.35 + (index % 4) * 0.13})`
        context.arc(x, y, node.size, 0, Math.PI * 2)
        context.fill()
      })

      const scanAngle = elapsed * 0.24 * direction
      context.beginPath()
      context.strokeStyle = `rgba(${accent}, 0.22)`
      context.lineWidth = 1
      context.moveTo(cx, cy)
      context.lineTo(cx + Math.cos(scanAngle) * unit * 0.35, cy + Math.sin(scanAngle) * unit * 0.35)
      context.stroke()

      frame = window.requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    resize()
    frame = window.requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [mode, paused])

  return (
    <div
      className={`tai-chi-stage ${paused ? 'is-paused' : ''}`}
      ref={stageRef}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        pointerRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          active: true,
        }
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
    >
      <div className="stage-poster" aria-hidden="true" />
      <canvas ref={canvasRef} className="tai-chi-canvas" aria-hidden="true" />
      <div className={`taiji-core ${mode}`} aria-hidden="true">
        <svg viewBox="0 0 200 200" role="presentation">
          <circle cx="100" cy="100" r="91" className="taiji-outline" />
          <path d="M100 9a91 91 0 0 1 0 182 45.5 45.5 0 0 1 0-91 45.5 45.5 0 0 0 0-91Z" className="taiji-half" />
          <circle cx="100" cy="54.5" r="11" className="taiji-dot-light" />
          <circle cx="100" cy="145.5" r="11" className="taiji-dot-dark" />
        </svg>
      </div>
      <div className="stage-readout" aria-hidden="true">
        <span>{mode === 'yang' ? 'YANG / OFFENSE' : 'YIN / DEFENSE'}</span>
        <span>NETWORK FIELD · 64 HEXAGRAMS</span>
      </div>
    </div>
  )
}
