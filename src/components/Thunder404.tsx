import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, X, Zap } from 'lucide-react'

export default function Thunder404({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [strike, setStrike] = useState(0)
  const [sound, setSound] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const summonThunder = () => {
    setStrike((value) => value + 1)
    if (!sound) return
    try {
      const AudioContextClass = window.AudioContext
      const audio = new AudioContextClass()
      const duration = 1.2
      const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate)
      const channel = buffer.getChannelData(0)
      for (let index = 0; index < channel.length; index += 1) {
        channel[index] = (Math.random() * 2 - 1) * Math.exp(-index / (audio.sampleRate * 0.3))
      }
      const source = audio.createBufferSource()
      source.buffer = buffer
      const filter = audio.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 720
      const gain = audio.createGain()
      gain.gain.setValueAtTime(0.18, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
      source.connect(filter).connect(gain).connect(audio.destination)
      source.start()
      source.onended = () => void audio.close()
    } catch {
      setSound(false)
    }
  }

  return (
    <div className="thunder-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="thunder-dialog" role="dialog" aria-modal="true" aria-labelledby="thunder-title" aria-describedby="thunder-description">
        <div className="thunder-topline">
          <span>PROTOCOL://CELESTIAL_EXCEPTION</span>
          <div>
            <button type="button" aria-pressed={sound} onClick={() => setSound((value) => !value)}>{sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}{sound ? '雷音开' : '雷音关'}</button>
            <button ref={closeRef} type="button" aria-label="关闭 404 天雷" onClick={onClose}><X size={20} aria-hidden="true" /></button>
          </div>
        </div>
        <div className="thunder-scene" key={strike} aria-hidden="true">
          <div className="thunder-flash" />
          <svg className="lightning lightning-left" viewBox="0 0 160 360"><path d="M105 0 22 176h61l-39 184 114-217H91Z" /></svg>
          <svg className="lightning lightning-right" viewBox="0 0 160 360"><path d="M105 0 22 176h61l-39 184 114-217H91Z" /></svg>
          <div className="thunder-talisman">敕</div>
        </div>
        <div className="thunder-copy">
          <p>FATAL_EXCEPTION / ROUTE_NOT_FOUND</p>
          <h2 id="thunder-title" data-text="404">404</h2>
          <h3>此路不通，天雷斩妄。</h3>
          <p id="thunder-description">你请求的页面已遁出三界。重整坐标，或再召一道天雷照亮归途。</p>
          <div className="thunder-error-stack">
            <span>ERR_404 · 阴阳坐标失配</span>
            <span>TRACE 0x000 · 路径未入藏经阁</span>
            <span>RECOVERY · 返回正道即可复位</span>
          </div>
          <div className="thunder-actions">
            <button type="button" className="thunder-primary" onClick={summonThunder}><Zap size={18} aria-hidden="true" />重召天雷</button>
            <button type="button" onClick={onClose}>渡劫归位</button>
          </div>
        </div>
      </section>
    </div>
  )
}
