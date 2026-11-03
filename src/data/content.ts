export type Lab = {
  id: string
  name: string
  subtitle: string
  platform: string
  focus: string
  chain: string[]
  tools: string[]
  lesson: string
  defense: string
  note: string
}

export type ToolCategory = '侦察' | 'Web' | '权限'

export type Tool = {
  name: string
  category: ToolCategory
  trigram: string
  description: string
  command?: string
  href?: string
}

export const labs: Lab[] = [
  {
    id: 'w1r3s',
    name: 'W1R3S 1.0.1',
    subtitle: '从匿名服务到完整攻击链',
    platform: 'VulnHub · 授权靶场',
    focus: 'LFI / Hash / Sudo',
    chain: ['FTP 匿名登录', 'Web 目录枚举', 'Cuppa CMS LFI', 'Hash 识别与破解', 'SSH 立足', 'Sudo 提权'],
    tools: ['Nmap', 'Gobuster', 'curl', 'John'],
    lesson: '信息收集决定攻击成败。FTP 与 robots.txt 都可能成为入口，服务版本识别往往比“扫到端口”更重要。',
    defense: '关闭匿名 FTP，修复文件包含，使用强密码，并将 sudo 权限收敛到明确命令。',
    note: '完整记录侦察、利用与防御建议，再与 LupinOne 横向对比攻击链差异。',
  },
  {
    id: 'lupinone',
    name: 'LupinOne',
    subtitle: '把遗漏写进下一次流程',
    platform: 'VulnHub · 授权靶场',
    focus: 'Fuzzing / Python / PrivEsc',
    chain: ['Web 模糊测试', 'Base58 私钥解码', 'SSH 登录', 'Python 库劫持', '二次权限检查', 'pip 提权'],
    tools: ['ffuf', 'John', 'SSH', 'GTFOBins'],
    lesson: '第一次复盘时，我遗漏了切换用户后的第二次 sudo -l。把遗漏固化为检查项，比只记录成功路径更有价值。',
    defense: '限制 Python 库写权限，审计 sudoers 配置，避免将包管理器以高权限开放给普通用户。',
    note: '这份笔记保留了未完成根因分析：每次身份变化，都重新枚举权限。',
  },
  {
    id: 'dc2',
    name: 'DC-2',
    subtitle: '沿身份与权限变化推进',
    platform: 'VulnHub · 授权靶场',
    focus: 'WordPress / rbash / Git',
    chain: ['端口与 Web 枚举', 'WordPress 用户枚举', '定向字典生成', 'SSH 受限 shell', '编辑器逃逸', 'sudo git 提权'],
    tools: ['Nmap', 'WPScan', 'cewl', 'Git'],
    lesson: '攻击链不是工具清单，而是上下文的连续变化：用户、shell 限制与 sudo 权限都需要重新判断。',
    defense: '减少用户信息公开，使用强认证，限制危险分页器与 sudo 命令组合。',
    note: '用一张链路图串起信息收集、Web 枚举、密码爆破、rbash 与 Git 提权。',
  },
  {
    id: 'ica1',
    name: 'ICA-1',
    subtitle: '从异常二进制验证假设',
    platform: '授权实验环境',
    focus: 'SUID / strings / PATH',
    chain: ['低权限 SSH 立足', 'SUID 文件枚举', '定位异常二进制', 'strings 验证调用', 'PATH 环境变量劫持'],
    tools: ['find', 'strings', 'grep', 'Linux'],
    lesson: '先区分系统常见 SUID 与异常第三方程序，再用 strings 验证命令调用，而不是盲目尝试所有文件。',
    defense: '清理非必要 SUID 位，特权程序使用绝对路径，并限制不可信目录进入 PATH。',
    note: '笔记同时记录了失败原因与修正过程：现象、解释、验证，缺一不可。',
  },
]

export const tools: Tool[] = [
  {
    name: 'Nmap',
    category: '侦察',
    trigram: '乾',
    description: '全端口扫描、服务版本识别与结果留存，先建立可靠暴露面。',
    command: 'nmap -p- -sV -sC <target> -oA scan',
  },
  {
    name: 'Gobuster',
    category: '侦察',
    trigram: '兑',
    description: '目录与资源枚举，用响应差异寻找隐藏应用和入口。',
    command: 'gobuster dir -u <url> -w <wordlist>',
  },
  {
    name: 'Burp Suite',
    category: 'Web',
    trigram: '离',
    description: '拦截、重放与参数验证，让每一次请求变化都可观察。',
  },
  {
    name: 'sqlmap',
    category: 'Web',
    trigram: '震',
    description: '仅在授权靶场中验证注入点；先理解参数、风险与 shell 引号。',
    command: 'sqlmap -u "<url>" -p "<param>" --batch',
  },
  {
    name: 'John',
    category: '权限',
    trigram: '巽',
    description: '识别 Hash 场景并验证密码强度，理解格式后再选择字典。',
    command: 'john --wordlist=<wordlist> <hash>',
  },
  {
    name: 'GTFOBins',
    category: '权限',
    trigram: '坎',
    description: '审计 sudo 与 SUID 场景中的高风险二进制用法。',
    href: 'https://gtfobins.github.io/',
  },
  {
    name: 'Linux',
    category: '权限',
    trigram: '艮',
    description: '围绕用户、权限、SUID 与环境变量建立提权检查清单。',
    command: 'find / -perm -u=s -type f 2>/dev/null',
  },
  {
    name: 'curl',
    category: 'Web',
    trigram: '坤',
    description: '构造请求、观察响应并验证漏洞，保留最小可复现过程。',
    command: 'curl -i "<url>"',
  },
]

export const resources = [
  {
    name: 'GTFOBins',
    description: 'Unix 二进制权限风险查询',
    href: 'https://gtfobins.github.io/',
  },
  {
    name: 'Exploit-DB',
    description: '公开漏洞利用与历史资料索引',
    href: 'https://www.exploit-db.com/',
  },
  {
    name: 'VulnHub',
    description: '本地授权靶场与实验环境',
    href: 'https://www.vulnhub.com/',
  },
  {
    name: 'TryHackMe',
    description: '结构化安全学习路径',
    href: 'https://tryhackme.com/',
  },
  {
    name: 'NVD',
    description: 'CVE 漏洞信息与影响面检索',
    href: 'https://nvd.nist.gov/',
  },
  {
    name: 'Web Security Academy',
    description: 'PortSwigger Web 安全课程与实验',
    href: 'https://portswigger.net/web-security',
  },
]
