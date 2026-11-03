import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { ChevronRight, TerminalSquare } from 'lucide-react'
import { decodeBase64, encodeBase64 } from '../utils/codec'

type TerminalLine = {
  id: number
  type: 'command' | 'output' | 'muted' | 'error'
  text: string
}

type TerminalProps = {
  rainEnabled: boolean
  onRainChange: (enabled: boolean) => void
  onModeChange: (mode: 'yin' | 'yang') => void
  onThunder: () => void
  onNavigate: (id: string) => void
  onNotify: (message: string) => void
}

const initialLines: TerminalLine[] = [
  { id: 1, type: 'muted', text: '0r41n shell v2.0 · 本地模拟，不执行系统命令' },
  { id: 2, type: 'output', text: '输入 help 查看指令；↑↓ 回调历史，Tab 自动补全。' },
]

const commandNames = ['help', 'whoami', 'skills', 'labs', 'ethics', 'github', 'history', 'date', 'echo', 'encode', 'decode', 'scan', 'trace', 'fortune', 'bagua', 'rain', 'mode', 'open', 'copy', '404', 'clear']
const shortcuts = ['whoami', 'scan', 'fortune', 'bagua', 'encode 0r41n', 'rain', '404']

export default function Terminal({ rainEnabled, onRainChange, onModeChange, onThunder, onNavigate, onNotify }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines)
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const nextId = useRef(3)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  const runCommand = (rawCommand: string) => {
    const normalized = rawCommand.trim()
    if (!normalized) return
    const [nameRaw, ...args] = normalized.split(/\s+/)
    const name = nameRaw.toLowerCase()
    const argument = args.join(' ')
    setHistory((current) => [...current.filter((item) => item !== normalized), normalized].slice(-30))
    setHistoryIndex(-1)

    if (name === 'clear') {
      setLines([])
      setCommand('')
      return
    }

    let output: string[] = []
    let type: TerminalLine['type'] = 'output'
    switch (name) {
      case 'help':
        output = [
          '信息  whoami · skills · labs · ethics · github · fortune',
          '阵法  bagua · rain on|off · mode yin|yang · 404',
          '工具  encode <文本> · decode <Base64> · scan · trace',
          '导航  open labs|elements|tools|codec · copy github',
          '系统  history · date · echo <文本> · clear',
        ]
        break
      case 'whoami': output = ['0r41n · GitHub @0r41n', '网络安全学习者：攻击链理解 / 防御视角 / 诚实复盘。']; break
      case 'skills': output = ['侦察  Nmap / Gobuster / ffuf / curl', 'Web   Burp Suite / sqlmap / LFI / SQL Injection', '权限  Linux / SUID / sudo / GTFOBins / John']; break
      case 'labs': output = ['W1R3S · LupinOne · DC-2 · ICA-1', '全部来自授权学习环境；敏感信息未公开。']; break
      case 'ethics': output = ['仅在明确授权的环境中测试。不扫描、不利用未经授权的目标。']; break
      case 'github': output = ['https://github.com/0r41n', '可执行 copy github 复制，或 open github 打开。']; break
      case 'history': output = history.length ? history.map((item, index) => `${String(index + 1).padStart(2, '0')}  ${item}`) : ['当前会话暂无历史命令。']; break
      case 'date': output = [new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())]; break
      case 'echo': output = [argument || 'ERR_422：echo 需要一段文本。']; break
      case 'encode':
        try { output = argument ? [encodeBase64(argument)] : ['ERR_422：用法 encode <文本>'] } catch { output = ['ERR_400：编码失败。']; type = 'error' }
        break
      case 'decode':
        try { output = argument ? [decodeBase64(argument)] : ['ERR_422：用法 decode <Base64>'] } catch { output = ['ERR_400：不是有效的 Base64 内容。']; type = 'error' }
        break
      case 'scan':
        output = ['[SIMULATION] 不发起网络请求，仅演练侦察流程。', '[OK] 暴露面建模 → 服务识别 → 版本核验', '[OK] 结果留存 → 假设验证 → 防御复盘', '建议下一步：open labs']
        break
      case 'trace':
        output = ['ROUTE  01  observe.local    [观] 识别上下文', 'ROUTE  02  verify.local    [知] 验证新假设', 'ROUTE  03  review.local    [复] 沉淀防御策略']
        break
      case 'fortune': {
        const signs = ['金：宜收敛权限，忌过度暴露。', '木：宜沿链生长，忌信任失控。', '水：宜观察流量，忌盲目行动。', '火：宜验证假设，忌未授权测试。', '土：宜复盘加固，忌只留下截图。']
        output = [signs[new Date().getDate() % signs.length], '今日心法：先留证据，再下判断。']
        break
      }
      case 'bagua': output = ['乾天·金  兑泽·金  离火·火  震雷·木', '巽风·木  坎水·水  艮山·土  坤地·土', '五行阵已接入：open elements']
        break
      case 'rain': {
        const enabled = argument ? argument.toLowerCase() !== 'off' : !rainEnabled
        onRainChange(enabled)
        output = [`数据流已${enabled ? '开启' : '关闭'}。`, '包含错误码、五行与八卦字符；不采集任何数据。']
        break
      }
      case 'mode':
        if (argument === 'yin' || argument === 'yang') { onModeChange(argument); output = [`太极阵已切换为 ${argument === 'yin' ? '阴 · 守' : '阳 · 攻'}。`] }
        else output = ['ERR_422：用法 mode yin 或 mode yang。']
        break
      case 'open':
        if (['labs', 'elements', 'tools', 'codec'].includes(argument)) { onNavigate(argument); output = [`200 OK：正在前往 #${argument}`] }
        else if (argument === 'github') { window.open('https://github.com/0r41n', '_blank', 'noopener,noreferrer'); output = ['200 OK：已请求打开 GitHub。'] }
        else output = ['ERR_404：可打开 labs / elements / tools / codec / github。']
        break
      case 'copy':
        if (argument === 'github') {
          void navigator.clipboard.writeText('https://github.com/0r41n').then(() => onNotify('GitHub 地址已复制')).catch(() => onNotify('复制失败，请手动复制 GitHub 地址'))
          output = ['https://github.com/0r41n']
        } else output = ['ERR_422：当前支持 copy github。']
        break
      case '404':
      case 'thunder': onThunder(); output = ['WARNING：天雷协议已触发，正在关闭当前路径。']; break
      default: output = [`ERR_127：command not found: ${name}`, '输入 help 查看可用指令。']; type = 'error'
    }

    const additions: TerminalLine[] = [
      { id: nextId.current++, type: 'command', text: normalized },
      ...output.map((text): TerminalLine => ({ id: nextId.current++, type, text })),
    ]
    setLines((current) => [...current.slice(-28), ...additions])
    setCommand('')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runCommand(command)
  }

  const handleKeyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setCommand(history[index])
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex === -1) return
      const index = historyIndex + 1
      if (index >= history.length) { setHistoryIndex(-1); setCommand('') }
      else { setHistoryIndex(index); setCommand(history[index]) }
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      const match = commandNames.find((item) => item.startsWith(command.trim().toLowerCase()))
      if (match) setCommand(`${match} `)
    }
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
    }
  }

  return (
    <div className="terminal-shell terminal-enhanced">
      <div className="terminal-titlebar">
        <div className="terminal-title"><TerminalSquare size={17} strokeWidth={1.6} aria-hidden="true" /><span>0r41n@lab: ~/notes — zsh</span></div>
        <span className="terminal-status">LOCAL / SAFE / V2</span>
      </div>
      <div className="terminal-log" ref={logRef} role="log" aria-live="polite" aria-label="终端输出" onClick={() => inputRef.current?.focus()}>
        {lines.map((line) => (
          <div className={`terminal-line ${line.type}`} key={line.id}>
            {line.type === 'command' && <span className="prompt">guest@0r41n:~$ </span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={submit}>
        <label htmlFor="terminal-command" className="terminal-input-label"><ChevronRight size={18} aria-hidden="true" /><span className="sr-only">输入终端指令</span></label>
        <input ref={inputRef} id="terminal-command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={handleKeyboard} placeholder="输入 help，Tab 补全" autoComplete="off" spellCheck={false} maxLength={160} />
        <button type="submit">执行</button>
      </form>
      <div className="terminal-shortcuts" aria-label="快捷指令">
        {shortcuts.map((item) => <button type="button" key={item} onClick={() => { runCommand(item); inputRef.current?.focus() }}>{item}</button>)}
      </div>
      <div className="terminal-hint"><span>↑↓ HISTORY</span><span>TAB COMPLETE</span><span>CTRL+L CLEAR</span></div>
    </div>
  )
}
