import { useCallback, useEffect, useState } from 'react'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'

const elements = [
  { name: '金', code: 'METAL / ENUM', trigram: '乾', attack: '收敛暴露面', defense: '权限最小化', method: '服务识别、SUID 审计、攻击面裁剪', signal: 'Nmap · find · sudo -l' },
  { name: '木', code: 'WOOD / GROWTH', trigram: '巽', attack: '沿信任链生长', defense: '切断异常扩展', method: '目录枚举、身份切换、信任关系复核', signal: 'ffuf · Gobuster · SSH' },
  { name: '水', code: 'WATER / FLOW', trigram: '坎', attack: '洞察数据流向', defense: '监测异常流量', method: '请求重放、参数分析、日志与流量追踪', signal: 'Burp · curl · Wireshark' },
  { name: '火', code: 'FIRE / VERIFY', trigram: '离', attack: '验证漏洞假设', defense: '隔离高危入口', method: '最小复现、补丁验证、风险边界确认', signal: 'PoC · diff · sandbox' },
  { name: '土', code: 'EARTH / RECOVER', trigram: '坤', attack: '稳固立足复盘', defense: '加固与恢复', method: '证据留存、配置基线、复盘与修复回归', signal: 'logs · baseline · backup' },
]

export default function FiveElements() {
  const [selected, setSelected] = useState(2)
  const [running, setRunning] = useState(false)
  const [round, setRound] = useState(0)
  const [logs, setLogs] = useState<string[]>(['[READY] 五行阵眼待命，选择任一元素开始推演。'])
  const current = elements[selected]

  const appendLog = useCallback((index: number, cycle: number) => {
    const item = elements[index]
    setLogs((existing) => [`[${String(cycle).padStart(2, '0')}] ${item.trigram}${item.name}主令 · ${item.attack} → ${item.defense}`, ...existing].slice(0, 5))
  }, [])

  const step = useCallback(() => {
    const next = (selected + 1) % elements.length
    const nextRound = round + 1
    setSelected(next)
    setRound(nextRound)
    appendLog(next, nextRound)
  }, [selected, round, appendLog])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(step, 1600)
    return () => window.clearInterval(timer)
  }, [running, step])

  return (
    <div className="elements-console">
      <div className="element-selector" role="group" aria-label="选择五行阵眼">
        {elements.map((element, index) => (
          <button
            type="button"
            key={element.name}
            className={selected === index ? 'active' : ''}
            aria-pressed={selected === index}
            onClick={() => {
              setRunning(false)
              setSelected(index)
              appendLog(index, round)
            }}
          >
            <span className="element-glyph" aria-hidden="true">{element.name}</span>
            <span><strong>{element.trigram} · {element.attack}</strong><small>{element.code}</small></span>
            <span className="element-index">0{index + 1}</span>
          </button>
        ))}
      </div>

      <div className={`element-oracle element-${current.name}`}>
        <div className="oracle-grid" aria-hidden="true" />
        <div className="oracle-heading">
          <span>ACTIVE_SIGIL / {current.code}</span>
          <span>ROUND {String(round).padStart(3, '0')}</span>
        </div>
        <div className="oracle-core" key={current.name}>
          <span className="oracle-rings" aria-hidden="true" />
          <strong>{current.name}</strong>
          <span>{current.trigram}</span>
        </div>
        <h3>{current.attack}，{current.defense}</h3>
        <p>{current.method}</p>
        <code>{current.signal}</code>
        <div className="element-relations">
          <span>相生 → {elements[(selected + 1) % 5].name}</span>
          <span>相克 → {elements[(selected + 2) % 5].name}</span>
          <span>阵序 → {selected + 1}/5</span>
        </div>
        <div className="element-controls">
          <button type="button" className="element-primary" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {running ? '暂停推演' : '自动推演'}
          </button>
          <button type="button" onClick={step}><StepForward size={16} aria-hidden="true" />推演一步</button>
          <button type="button" aria-label="重置五行推演" onClick={() => {
            setRunning(false)
            setSelected(2)
            setRound(0)
            setLogs(['[RESET] 阵法复位，五行重归平衡。'])
          }}><RotateCcw size={16} aria-hidden="true" /></button>
        </div>
      </div>

      <div className="element-log" role="log" aria-live="polite" aria-label="五行推演记录">
        <div><span>STREAM://FIVE_PHASES</span><span className={running ? 'online' : ''}>{running ? 'RUNNING' : 'STANDBY'}</span></div>
        {logs.map((log, index) => <p key={`${log}-${index}`} className={index === 0 ? 'latest' : ''}>{log}</p>)}
      </div>
    </div>
  )
}
