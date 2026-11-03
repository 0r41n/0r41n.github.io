import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronRight, TerminalSquare } from 'lucide-react'

type TerminalLine = {
  id: number
  type: 'command' | 'output' | 'muted'
  text: string
}

const initialLines: TerminalLine[] = [
  { id: 1, type: 'muted', text: '0r41n 交互终端 · 本地模拟，不执行系统命令' },
  { id: 2, type: 'output', text: '输入 help 查看可用指令，或点击下方快捷指令。' },
]

const answers: Record<string, string[]> = {
  help: ['可用指令：whoami · skills · labs · ethics · github · clear'],
  whoami: [
    '0r41n · GitHub @0r41n',
    '网络安全学习者，沿红队方向持续实践；重视攻击链理解、防御视角与诚实复盘。',
  ],
  skills: [
    '侦察  Nmap / Gobuster / ffuf / curl',
    'Web   Burp Suite / sqlmap / LFI / SQL Injection',
    '权限  Linux / SUID / sudo / GTFOBins / John',
  ],
  labs: ['公开复盘：W1R3S · LupinOne · DC-2 · ICA-1', '场景：VulnHub 与本地授权实验环境。'],
  ethics: ['仅在明确授权的环境中测试。不扫描、不利用未经授权的目标。'],
  github: ['https://github.com/0r41n'],
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines)
  const [command, setCommand] = useState('')
  const nextId = useRef(3)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  const runCommand = (rawCommand: string) => {
    const normalized = rawCommand.trim().toLowerCase()
    if (!normalized) return

    if (normalized === 'clear') {
      setLines([])
      setCommand('')
      return
    }

    const output = answers[normalized] ?? [`command not found: ${normalized}`, '输入 help 查看可用指令。']
    const additions: TerminalLine[] = [
      { id: nextId.current++, type: 'command', text: normalized },
      ...output.map((text): TerminalLine => ({ id: nextId.current++, type: 'output', text })),
    ]
    setLines((current) => [...current.slice(-18), ...additions])
    setCommand('')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runCommand(command)
  }

  return (
    <div className="terminal-shell">
      <div className="terminal-titlebar">
        <div className="terminal-title">
          <TerminalSquare size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>0r41n@lab: ~/notes</span>
        </div>
        <span className="terminal-status">LOCAL / SAFE</span>
      </div>
      <div className="terminal-log" ref={logRef} role="log" aria-live="polite" aria-label="终端输出">
        {lines.map((line) => (
          <div className={`terminal-line ${line.type}`} key={line.id}>
            {line.type === 'command' && <span className="prompt">guest@0r41n:~$ </span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={submit}>
        <label htmlFor="terminal-command" className="terminal-input-label">
          <ChevronRight size={18} aria-hidden="true" />
          <span className="sr-only">输入终端指令</span>
        </label>
        <input
          ref={inputRef}
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="输入 whoami"
          autoComplete="off"
          spellCheck={false}
          maxLength={40}
        />
        <button type="submit">执行</button>
      </form>
      <div className="terminal-shortcuts" aria-label="快捷指令">
        {['whoami', 'skills', 'labs', 'ethics'].map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              runCommand(item)
              inputRef.current?.focus()
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
