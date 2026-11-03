import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Github,
  Menu,
  Pause,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react'
import TaiChiCanvas from './components/TaiChiCanvas'
import Terminal from './components/Terminal'
import { labs, resources, tools } from './data/content'

const navItems = [
  { label: '修行录', href: '#labs' },
  { label: '八门谱', href: '#tools' },
  { label: '三将心诀', href: '#principles' },
  { label: '藏经阁', href: '#resources' },
]

const toolFilters = ['全部', '侦察', 'Web', '权限'] as const
type ToolFilter = (typeof toolFilters)[number]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mode, setMode] = useState<'yin' | 'yang'>('yang')
  const [paused, setPaused] = useState(false)
  const [activeLab, setActiveLab] = useState(labs[0].id)
  const [toolFilter, setToolFilter] = useState<ToolFilter>('全部')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const selectedLab = labs.find((lab) => lab.id === activeLab) ?? labs[0]
  const visibleTools = toolFilter === '全部' ? tools : tools.filter((tool) => tool.category === toolFilter)

  return (
    <div className="site-shell" id="top">
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="0r41n首页">
          <span className="brand-seal" aria-hidden="true">玄</span>
          <span className="brand-wordmark">
            <strong>0r41n</strong>
            <small>0R41N / SECURITY</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <a
          className="github-link desktop-github"
          href="https://github.com/0r41n"
          target="_blank"
          rel="noreferrer"
          aria-label="访问 GitHub 账号 0r41n"
        >
          <Github size={18} aria-hidden="true" />
          <span>@0r41n</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <nav
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="移动端导航"
          aria-hidden={!menuOpen}
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a href="https://github.com/0r41n" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
            <Github size={18} aria-hidden="true" /> GitHub
          </a>
        </nav>
      </header>

      <main>
        <section className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-status">
                <span className="status-pulse" aria-hidden="true" />
                <span>LEARNING IN PUBLIC</span>
                <span className="status-divider" aria-hidden="true" />
                <span>AUTHORIZED LABS ONLY</span>
              </div>
              <h1 id="hero-title">
                以道御术，<br />
                <span>以攻促防。</span>
              </h1>
              <p className="hero-intro">
                我是<strong>0r41n</strong>，一名沿红队方向持续实践的网络安全学习者。
                从服务识别到权限审计，从一次报错到完整复盘——把每次实验，变成下一次判断的依据。
              </p>
              <div className="hero-actions">
                <a className="primary-action" href="#labs">
                  进入修行录 <ArrowDown size={18} aria-hidden="true" />
                </a>
                <a className="text-action" href="#terminal">打开交互终端</a>
              </div>
              <dl className="hero-facts">
                <div>
                  <dt>当前方向</dt>
                  <dd>Web 安全 · 内网渗透 · 权限提升</dd>
                </div>
                <div>
                  <dt>实践环境</dt>
                  <dd>Kali Linux · VulnHub · TryHackMe</dd>
                </div>
              </dl>
            </div>

            <figure className="hero-visual" aria-label="可随指针变化的太极网络阵">
              <div className="vertical-inscription" aria-hidden="true">观势 · 知己 · 复归</div>
              <TaiChiCanvas mode={mode} paused={paused} />
              <figcaption className="visual-controls">
                <div className="mode-switch" aria-label="太极网络阵模式">
                  <button type="button" className={mode === 'yin' ? 'active' : ''} aria-pressed={mode === 'yin'} onClick={() => setMode('yin')}>
                    阴 · 守
                  </button>
                  <button type="button" className={mode === 'yang' ? 'active' : ''} aria-pressed={mode === 'yang'} onClick={() => setMode('yang')}>
                    阳 · 攻
                  </button>
                </div>
                <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
                  {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                  {paused ? '继续阵法' : '静止阵法'}
                </button>
              </figcaption>
            </figure>
          </div>
          <div className="hero-footnote">
            <span>TAO OF CYBERSECURITY</span>
            <span>指针掠过阵法，观察网络节点的响应</span>
          </div>
        </section>

        <section className="manifesto section-frame" aria-label="个人理念">
          <p>为学日益，为道日损。</p>
          <div>
            <span>不堆砌工具，不神化漏洞。</span>
            <span>理解原理，验证假设，记录遗漏，思考防御。</span>
          </div>
        </section>

        <section className="labs-section section-frame" id="labs" aria-labelledby="labs-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">FIELD NOTES / 授权靶场复盘</span>
              <h2 id="labs-title">修行录</h2>
            </div>
            <p>不是通关截图，而是攻击链、判断依据与防御启示。选取四段真实学习笔记，公开展示已省略 IP、凭据与 Flag。</p>
          </div>

          <div className="lab-workbench">
            <div className="lab-index" aria-label="选择实验复盘">
              {labs.map((lab) => (
                <button
                  type="button"
                  key={lab.id}
                  className={activeLab === lab.id ? 'active' : ''}
                  aria-pressed={activeLab === lab.id}
                  onClick={() => setActiveLab(lab.id)}
                >
                  <span className="lab-index-name">{lab.name}</span>
                  <span className="lab-index-subtitle">{lab.subtitle}</span>
                  <span className="lab-index-focus">{lab.focus}</span>
                </button>
              ))}
            </div>

            <article className="lab-detail" key={selectedLab.id} aria-live="polite">
              <div className="lab-detail-topline">
                <span>{selectedLab.platform}</span>
                <span>{selectedLab.focus}</span>
              </div>
              <h3>{selectedLab.name}</h3>
              <p className="lab-lesson">{selectedLab.lesson}</p>

              <ol className="attack-chain" aria-label={`${selectedLab.name} 攻击链`}>
                {selectedLab.chain.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>

              <div className="lab-meta">
                <div>
                  <span>涉及术器</span>
                  <div className="tag-list">
                    {selectedLab.tools.map((tool) => <span key={tool}>{tool}</span>)}
                  </div>
                </div>
                <div>
                  <span>复盘旁注</span>
                  <p>{selectedLab.note}</p>
                </div>
              </div>
              <div className="defense-note">
                <ShieldCheck size={21} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <strong>复归于防</strong>
                  <p>{selectedLab.defense}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="terminal-section section-frame" id="terminal" aria-labelledby="terminal-title">
          <div className="terminal-copy">
            <span className="section-kicker">INTERACTIVE SHELL / 本地模拟</span>
            <h2 id="terminal-title">以命令，<br />读其人。</h2>
            <p>一个无需后端的安全终端。试试 <code>whoami</code>、<code>skills</code> 或 <code>labs</code>，用另一种方式浏览这个站点。</p>
            <p className="terminal-ethics">终端只解析预设文本，不访问你的系统，不发起扫描，也不执行任何安全工具。</p>
          </div>
          <Terminal />
        </section>

        <section className="tools-section section-frame" id="tools" aria-labelledby="tools-title">
          <div className="section-heading tools-heading">
            <div>
              <span className="section-kicker">EIGHT GATES / 常用工具与场景</span>
              <h2 id="tools-title">八门谱</h2>
            </div>
            <div className="tool-filters" aria-label="筛选工具分类">
              {toolFilters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={toolFilter === filter ? 'active' : ''}
                  aria-pressed={toolFilter === filter}
                  onClick={() => setToolFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-grid">
            {visibleTools.map((tool) => (
              <article className="tool-item" key={tool.name}>
                <div className="tool-item-heading">
                  <span className="trigram" aria-hidden="true">{tool.trigram}</span>
                  <div>
                    <h3>{tool.name}</h3>
                    <span>{tool.category}</span>
                  </div>
                </div>
                <p>{tool.description}</p>
                {tool.command && <code>{tool.command}</code>}
                {tool.href && (
                  <a href={tool.href} target="_blank" rel="noreferrer">
                    打开知识库 <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="tool-disclaimer">示例命令使用占位目标，仅用于说明笔记中的工具场景。请仅在明确授权的环境中替换并执行。</p>
        </section>

        <section className="principles-section section-frame" id="principles" aria-labelledby="principles-title">
          <div className="principles-intro">
            <span className="section-kicker">THREE PRINCIPLES / 方法论</span>
            <h2 id="principles-title">三将<br />心诀</h2>
            <p>技术会更迭，判断方式可以沉淀。这三条原则，来自一次次扫描、报错、身份切换与复盘。</p>
          </div>
          <div className="principle-list">
            <article>
              <span className="principle-glyph" aria-hidden="true">观</span>
              <div>
                <h3>观其势</h3>
                <p>信息收集决定攻击成败。先理解服务、版本与暴露面，再讨论漏洞与利用。</p>
              </div>
            </article>
            <article>
              <span className="principle-glyph" aria-hidden="true">知</span>
              <div>
                <h3>知其变</h3>
                <p>每次切换用户都重新检查权限。上下文已经改变，旧假设也必须重新验证。</p>
              </div>
            </article>
            <article>
              <span className="principle-glyph" aria-hidden="true">复</span>
              <div>
                <h3>复其道</h3>
                <p>记录遗漏、报错和修正。复盘不是展示成功，而是让下一次判断更加准确。</p>
              </div>
            </article>
          </div>
        </section>

        <section className="resources-section section-frame" id="resources" aria-labelledby="resources-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">REFERENCE / 持续学习</span>
              <h2 id="resources-title">藏经阁</h2>
            </div>
            <p>真正常用的公开知识库与训练平台。从漏洞资料到本地靶场，把“知道”变成“验证过”。</p>
          </div>
          <div className="resource-list">
            {resources.map((resource) => (
              <a key={resource.name} href={resource.href} target="_blank" rel="noreferrer">
                <BookOpen size={20} strokeWidth={1.4} aria-hidden="true" />
                <span>
                  <strong>{resource.name}</strong>
                  <small>{resource.description}</small>
                </span>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="closing-section section-frame" aria-labelledby="closing-title">
          <div className="closing-seal" aria-hidden="true">0r41n</div>
          <div>
            <span>STAY CURIOUS · STAY AUTHORIZED</span>
            <h2 id="closing-title">道阻且长，<br />行则将至。</h2>
          </div>
          <a href="https://github.com/0r41n" target="_blank" rel="noreferrer">
            <Github size={21} aria-hidden="true" />
            在 GitHub 见证后续修行
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <div>
          <strong>0r41n / 0R41N</strong>
          <span>网络安全学习者的公开修行档案</span>
        </div>
        <p>所有安全测试仅用于明确授权的学习与研究环境。</p>
        <a href="#top" aria-label="返回页面顶部">返回顶部 <ArrowUp size={16} aria-hidden="true" /></a>
      </footer>
    </div>
  )
}
