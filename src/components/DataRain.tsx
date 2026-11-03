import { useEffect, useRef } from 'react'

type DataRainProps = {
  active: boolean
  mode: 'yin' | 'yang'
}

const glyphs = ['0', '1', '404', '500', '0x2F', '乾', '兑', '离', '震', '巽', '坎', '艮', '坤', '金', '木', '水', '火', '土']

export default function DataRain({ active, mode }: DataRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let columns = 0
    let positions: number[] = []
    let speeds: number[] = []
    let frame = 0
    let lastTime = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(width / 42)
      positions = Array.from({ length: columns }, (_, index) => (index * 137) % Math.max(height, 1))
      speeds = Array.from({ length: columns }, (_, index) => 12 + (index % 7) * 3)
    }

    const draw = (time: number) => {
      frame = window.requestAnimationFrame(draw)
      if (time - lastTime < 1000 / 24 || document.hidden) return
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.08)
      lastTime = time
      context.clearRect(0, 0, width, height)
      context.font = '11px "Cascadia Code", "SimSun", monospace'
      context.textAlign = 'center'
      const accent = mode === 'yang' ? '217, 111, 79' : '126, 176, 157'

      for (let column = 0; column < columns; column += 1) {
        const x = column * 42 + 18
        const head = positions[column]
        for (let trail = 0; trail < 9; trail += 1) {
          const y = head - trail * 25
          if (y < -30 || y > height + 30) continue
          const glyphIndex = (column * 7 + trail * 3 + Math.floor(time / 900)) % glyphs.length
          const alpha = (1 - trail / 9) * (trail === 0 ? 0.24 : 0.11)
          context.fillStyle = `rgba(${trail === 0 ? accent : '202, 213, 199'}, ${alpha})`
          context.fillText(glyphs[glyphIndex], x, y)
        }
        if (!reducedMotion.matches) positions[column] = (head + speeds[column] * delta + height + 240) % (height + 240) - 120
      }
    }

    resize()
    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frame)
    }
  }, [active, mode])

  return <canvas ref={canvasRef} className={`data-rain ${active ? 'is-active' : ''}`} aria-hidden="true" />
}
