import { useState } from 'react'
import { ArrowDownUp, Binary, Check, Copy, Hash, Link2, RotateCcw } from 'lucide-react'
import { decodeBase64, encodeBase64 } from '../utils/codec'

type CodecMode = 'base64' | 'url' | 'sha256'

const modes = [
  { id: 'base64' as const, label: 'Base64', icon: Binary },
  { id: 'url' as const, label: 'URL 编码', icon: Link2 },
  { id: 'sha256' as const, label: 'SHA-256', icon: Hash },
]

export default function CryptoLab({ onNotify }: { onNotify: (message: string) => void }) {
  const [mode, setMode] = useState<CodecMode>('base64')
  const [input, setInput] = useState('0r41n / 以道御术，以攻促防')
  const [output, setOutput] = useState('')
  const [feedback, setFeedback] = useState('等待输入。所有计算仅发生在当前浏览器。')
  const [copied, setCopied] = useState(false)

  const transform = async (reverse = false) => {
    setCopied(false)
    if (!input && mode !== 'sha256') {
      setOutput('')
      setFeedback('ERR_422：请输入需要处理的内容。')
      return
    }
    try {
      let result = ''
      if (mode === 'base64') result = reverse ? decodeBase64(input) : encodeBase64(input)
      if (mode === 'url') result = reverse ? decodeURIComponent(input) : encodeURIComponent(input)
      if (mode === 'sha256') {
        const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
        result = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
      }
      setOutput(result)
      setFeedback(`200 OK：${mode === 'sha256' ? '摘要生成' : reverse ? '解码' : '编码'}完成，共 ${result.length} 个字符。`)
    } catch {
      setOutput('')
      setFeedback('ERR_400：输入格式无法解析，请检查编码内容。')
    }
  }

  const copy = async () => {
    if (!output) {
      setFeedback('ERR_204：暂无可复制的输出。')
      return
    }
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setFeedback('200 OK：结果已写入剪贴板。')
      onNotify('玄算结果已复制')
    } catch {
      setFeedback('ERR_403：浏览器未授予剪贴板权限，请手动复制。')
    }
  }

  return (
    <div className="codec-console">
      <div className="codec-toolbar" role="tablist" aria-label="选择本地计算类型">
        {modes.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} className={mode === id ? 'active' : ''} onClick={() => {
            setMode(id)
            setOutput('')
            setCopied(false)
            setFeedback('协议已切换，等待计算。')
          }}><Icon size={17} aria-hidden="true" />{label}</button>
        ))}
      </div>
      <div className="codec-workspace">
        <label className="codec-field">
          <span>INPUT:// 明文或编码内容</span>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} maxLength={4096} spellCheck={false} />
          <small>{input.length} / 4096</small>
        </label>
        <div className="codec-actions">
          <button type="button" className="codec-run" onClick={() => void transform(false)}>{mode === 'sha256' ? '生成摘要' : '执行编码'}</button>
          {mode !== 'sha256' && <button type="button" onClick={() => void transform(true)}>执行解码</button>}
          <button type="button" disabled={!output} onClick={() => {
            setInput(output)
            setOutput('')
            setFeedback('输出已送回输入区，可继续处理。')
          }}><ArrowDownUp size={16} aria-hidden="true" />送回输入</button>
          <button type="button" onClick={() => {
            setInput('')
            setOutput('')
            setFeedback('工作区已清空。')
          }}><RotateCcw size={16} aria-hidden="true" />清空</button>
        </div>
        <label className="codec-field codec-output">
          <span>OUTPUT:// 本地计算结果</span>
          <textarea value={output} readOnly rows={6} placeholder="计算结果将在这里出现" spellCheck={false} />
          <button type="button" className="codec-copy" onClick={() => void copy()}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? '已复制' : '复制结果'}</button>
        </label>
      </div>
      <p className="codec-feedback" role="status">{feedback}</p>
    </div>
  )
}
