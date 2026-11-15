import { useState } from 'react'
import './App.css'

const componentModules = import.meta.glob('./components/**/*.jsx', {
  eager: true,
  import: 'default',
})
const componentSources = import.meta.glob('./components/**/*.jsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const components = Object.entries(componentModules).map(([path, Component]) => {
  const fileName = path.split('/').pop()
  const baseName = fileName.replace(/\.jsx$/, '')
  const name = baseName.replace(/([a-z\d])([A-Z])/g, '$1 $2')
  const thumbnail = /todo|task|checklist/i.test(baseName)
    ? 'todo'
    : /search|filter/i.test(baseName) ? 'search' : 'generic'

  return {
    id: path,
    name,
    description: `${name} React component. Open the playground to try it out.`,
    category: 'React · Component',
    status: 'Ready',
    fileName,
    thumbnail,
    Component,
    code: componentSources[path],
  }
})

function ComponentThumbnail({ type }) {
  if (type === 'todo') {
    return <span className="card-illustration todo-illustration" aria-hidden="true">
      <span className="mini-task-input"><span>＋</span> Add a task</span>
      <span className="mini-task"><i className="checked">✓</i><span className="completed-task">Review React notes</span></span>
      <span className="mini-task"><i />Build a new component</span>
    </span>
  }

  if (type === 'search') {
    return <span className="card-illustration search-illustration" aria-hidden="true">
      <span className="mini-search"><i />Search users<span className="mini-shortcut">⌕</span></span>
      <span className="mini-result"><i />Revanth</span>
      <span className="mini-result faded"><i />Rahul</span>
      <span className="mini-orb">⏱</span>
    </span>
  }

  return <span className="card-illustration generic-illustration" aria-hidden="true">
    <span className="generic-window"><i /><i /><i /></span>
    <span className="generic-symbol">{'{ }'}</span>
    <span className="generic-lines"><i /><i /><i /></span>
  </span>
}

const syntaxPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|(?:'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`)|\b(?:import|from|export|default|function|const|return|if|else|true|false|null|new|this)\b|\b(?:useEffect|useState|setTimeout|clearTimeout)\b|\b\d+\b|\b[A-Z][A-Za-z0-9_]*\b)/g

function CodeBlock({ code }) {
  const lines = code.split('\n')

  return (
    <pre className="code-content" aria-label="Component source code">
      <code>{lines.map((line, lineIndex) => {
        const parts = []
        let lastIndex = 0
        for (const match of line.matchAll(syntaxPattern)) {
          if (match.index > lastIndex) parts.push({ text: line.slice(lastIndex, match.index) })
          const token = match[0]
          const type = token.startsWith('//') || token.startsWith('/*') ? 'comment'
            : /^['"`]/.test(token) ? 'string'
              : /^(useEffect|useState|setTimeout|clearTimeout)$/.test(token) ? 'function'
                : /^\d/.test(token) ? 'number'
                  : /^[A-Z]/.test(token) ? 'type'
                    : 'keyword'
          parts.push({ text: token, type })
          lastIndex = match.index + token.length
        }
        if (lastIndex < line.length) parts.push({ text: line.slice(lastIndex) })
        return <span className="code-line" key={lineIndex}><span className="line-number">{lineIndex + 1}</span><span>{parts.map((part, index) => <span className={part.type ? `token-${part.type}` : undefined} key={index}>{part.text}</span>)}</span></span>
      })}</code>
    </pre>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem('reactlab-theme') === 'dark')
  const selectedComponent = components.find(({ id }) => id === selectedId)
  const toggleTheme = () => setIsDark((dark) => {
    window.localStorage.setItem('reactlab-theme', dark ? 'light' : 'dark')
    return !dark
  })
  const themeButton = <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
    <span aria-hidden="true">{isDark ? '☀' : '◐'}</span>{isDark ? 'Light' : 'Dark'}
  </button>

  if (selectedComponent) {
    const Preview = selectedComponent.Component

    return (
      <main className={`workspace${isDark ? ' theme-dark' : ''}`}>
        <header className="topbar">
          <a className="brand" href="#home" onClick={() => setSelectedId(null)}>
            <span className="brand-mark">&lt;/&gt;</span>
            <span>React<span className="brand-light">Lab</span></span>
          </a>
          <button className="back-button" onClick={() => setSelectedId(null)}>
            <span aria-hidden="true">←</span> All components
          </button>
          {themeButton}
          <span className="topbar-note"><span className="live-dot" /> Interactive preview</span>
        </header>

        <section className="detail-heading">
          <div>
            <p className="eyebrow">COMPONENT PLAYGROUND</p>
            <h1>{selectedComponent.name}</h1>
            <p className="detail-description">{selectedComponent.description}</p>
          </div>
          <span className="category-pill">{selectedComponent.category}</span>
        </section>

        <section className="split-view" aria-label={`${selectedComponent.name} preview and source code`}>
          <div className="panel preview-panel">
            <div className="panel-heading">
              <div><span className="panel-icon preview-icon">◉</span><span>Live preview</span></div>
              <span className="panel-meta">Try it out</span>
            </div>
            <div className="preview-canvas"><Preview /></div>
          </div>
          <div className="panel code-panel">
            <div className="panel-heading">
              <div><span className="panel-icon code-icon">{'{}'}</span><span>Source code</span></div>
              <span className="file-label">{selectedComponent.fileName}</span>
            </div>
            <CodeBlock code={selectedComponent.code} />
          </div>
        </section>
        <footer className="detail-footer"><span>Built with care by <strong className="author-name">Revanth</strong></span><span>More components coming soon</span></footer>
      </main>
    )
  }

  return (
    <main className={`workspace${isDark ? ' theme-dark' : ''}`}>
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setSelectedId(null)}>
          <span className="brand-mark">&lt;/&gt;</span>
          <span>React<span className="brand-light">Lab</span></span>
        </a>
        {themeButton}
        <span className="topbar-note">A collection of frontend patterns</span>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />THE COMPONENT NOTEBOOK</p>
          <h1>Small ideas.<br /><span>Built in React.</span></h1>
          <p className="hero-description">A growing collection of useful UI patterns, made interactive. Pick a component to explore how it works.</p>
          <div className="hero-stats"><span><strong>{String(components.length).padStart(2, '0')}</strong> component{components.length === 1 ? '' : 's'}</span><i /> <span>Hands-on examples</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-card art-back"><span className="art-dots">● ● ●</span><span className="art-lines"><i /><i /><i /></span></div>
          <div className="art-card art-front"><span className="art-bracket">{'{ }'}</span><span className="art-cursor" /></div>
          <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading"><div><p className="eyebrow">BROWSE THE LIBRARY</p><h2>Components <span>({String(components.length).padStart(2, '0')})</span></h2></div><span className="catalog-caption">Select a card to open its playground <span aria-hidden="true">↗</span></span></div>
        <div className="component-grid">
          {components.map((component, index) => (
            <button className="component-card" key={component.id} onClick={() => setSelectedId(component.id)}>
              <span className="card-topline"><span className="card-number">0{index + 1}</span><span className="ready-status"><i />{component.status}</span></span>
              <ComponentThumbnail type={component.thumbnail} />
              <span className="card-title">{component.name}<span className="card-arrow">↗</span></span>
              <span className="card-description">{component.description}</span>
              <span className="card-bottom"><span className="tag-pill">{component.category}</span><span className="open-link">Explore component <span>→</span></span></span>
            </button>
          ))}
          <div className="coming-card"><span className="coming-plus">+</span><span className="coming-title">Your next idea</span><span className="coming-description">Add another component to the library when you’re ready.</span><span className="coming-footnote">THE COLLECTION IS GROWING</span></div>
        </div>
      </section>

      <footer className="home-footer"><span>ReactLab <span className="footer-dot">·</span> Built with care by <strong className="author-name">Revanth</strong></span><span>Made for curious developers <span className="footer-spark">✳</span></span></footer>
    </main>
  )
}

export default App
