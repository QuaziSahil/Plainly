import { useState, useRef } from 'react'
import { Play, Terminal, Trash2, Copy, Check, AlertTriangle, Clock, RefreshCw, Code2, Eye, Maximize2, Minimize2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AICodeRunner() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('auto')
    const [output, setOutput] = useState([])
    const [error, setError] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [executionTime, setExecutionTime] = useState(null)
    const [copied, setCopied] = useState(false)
    const [htmlPreview, setHtmlPreview] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const outputRef = useRef(null)
    const iframeRef = useRef(null)

    const languages = [
        { value: 'auto', label: 'Auto Detect' },
        { value: 'html', label: 'HTML (Preview Mode)' },
        { value: 'javascript', label: 'JavaScript (Console)' }
    ]

    // Detect if code is HTML
    const detectLanguage = (code) => {
        const trimmed = code.trim().toLowerCase()
        if (trimmed.startsWith('<!doctype') ||
            trimmed.startsWith('<html') ||
            trimmed.startsWith('<head') ||
            trimmed.startsWith('<body') ||
            (trimmed.includes('<style>') && trimmed.includes('<script>'))) {
            return 'html'
        }
        return 'javascript'
    }

    const getActiveLanguage = () => {
        if (language === 'auto') {
            return detectLanguage(code)
        }
        return language
    }

    const runCode = () => {
        if (!code.trim()) return

        setIsRunning(true)
        setOutput([])
        setError('')
        setExecutionTime(null)
        setHtmlPreview('')

        const activeLanguage = getActiveLanguage()

        const startTime = performance.now()

        if (activeLanguage === 'html') {
            // HTML Preview Mode - render in iframe
            try {
                setHtmlPreview(code)
                const endTime = performance.now()
                setExecutionTime((endTime - startTime).toFixed(2))
                setOutput([{ type: 'info', content: '✅ HTML rendered successfully! See preview below.' }])
            } catch (err) {
                setError(`HTML Error: ${err.message}`)
            } finally {
                setIsRunning(false)
                setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            }
        } else {
            // JavaScript Console Mode
            const logs = []
            const originalLog = console.log
            const originalError = console.error
            const originalWarn = console.warn
            const originalInfo = console.info

            console.log = (...args) => {
                logs.push({ type: 'log', content: args.map(formatOutput).join(' ') })
            }
            console.error = (...args) => {
                logs.push({ type: 'error', content: args.map(formatOutput).join(' ') })
            }
            console.warn = (...args) => {
                logs.push({ type: 'warn', content: args.map(formatOutput).join(' ') })
            }
            console.info = (...args) => {
                logs.push({ type: 'info', content: args.map(formatOutput).join(' ') })
            }

            setTimeout(() => {
                try {
                    const result = new Function(code)()

                    if (result !== undefined) {
                        logs.push({ type: 'return', content: `→ ${formatOutput(result)}` })
                    }

                    const endTime = performance.now()
                    setExecutionTime((endTime - startTime).toFixed(2))
                    setOutput(logs)
                } catch (err) {
                    setError(`${err.name}: ${err.message}`)
                    setOutput(logs)
                } finally {
                    console.log = originalLog
                    console.error = originalError
                    console.warn = originalWarn
                    console.info = originalInfo
                    setIsRunning(false)

                    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                }
            }, 50)
        }
    }

    const formatOutput = (value) => {
        if (value === null) return 'null'
        if (value === undefined) return 'undefined'
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2)
            } catch {
                return String(value)
            }
        }
        return String(value)
    }

    const clearOutput = () => {
        setOutput([])
        setError('')
        setExecutionTime(null)
        setHtmlPreview('')
    }

    const handleCopyOutput = async () => {
        const text = output.map(o => o.content).join('\n')
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setCode('')
        setLanguage('auto')
        setOutput([])
        setError('')
        setExecutionTime(null)
        setHtmlPreview('')
    }

    const getOutputColor = (type) => {
        switch (type) {
            case 'error': return '#ef4444'
            case 'warn': return '#f59e0b'
            case 'info': return '#3b82f6'
            case 'return': return '#10b981'
            default: return '#e6edf3'
        }
    }

    const activeLanguage = getActiveLanguage()

    return (
        <CalculatorLayout
            title="Code Runner"
            description="Run JavaScript or preview HTML/CSS/JS instantly"
            category="AI Tools"
            categoryPath="/ai"
            icon={Terminal}
            result={htmlPreview ? 'Preview Ready' : output.length > 0 ? `${output.length} Outputs` : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="input-label" style={{ margin: 0 }}>Code</label>
                    {code.trim() && (
                        <span style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            background: activeLanguage === 'html' ? '#8b5cf620' : '#10b98120',
                            color: activeLanguage === 'html' ? '#a78bfa' : '#10b981',
                            borderRadius: '6px',
                            fontWeight: '500'
                        }}>
                            {activeLanguage === 'html' ? '🌐 HTML Preview' : '⚡ JavaScript'}
                        </span>
                    )}
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Paste any code here...

• HTML pages with <style> and <script> → Rendered preview
• JavaScript code → Console output

Try pasting a complete HTML page!`}
                    rows={12}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0d1117',
                        color: '#10b981',
                        fontSize: '13px',
                        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                        resize: 'vertical',
                        minHeight: '250px',
                        lineHeight: '1.5'
                    }}
                    spellCheck={false}
                />
            </div>

            {/* Language Selector */}
            <div className="input-group">
                <label className="input-label">Language Mode</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={runCode}
                    disabled={isRunning || !code.trim()}
                    style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '16px',
                        background: isRunning || !code.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: isRunning || !code.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        minHeight: '52px'
                    }}
                >
                    {isRunning ? (
                        <>
                            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            Running...
                        </>
                    ) : (
                        <>
                            {activeLanguage === 'html' ? <Eye size={20} /> : <Play size={20} />}
                            {activeLanguage === 'html' ? 'Preview HTML' : 'Run Code'}
                        </>
                    )}
                </button>

                <button
                    onClick={clearOutput}
                    disabled={output.length === 0 && !error && !htmlPreview}
                    style={{
                        padding: '16px 24px',
                        background: output.length === 0 && !error && !htmlPreview ? '#222' : '#333',
                        border: 'none',
                        borderRadius: '12px',
                        color: output.length === 0 && !error && !htmlPreview ? '#666' : 'white',
                        cursor: output.length === 0 && !error && !htmlPreview ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '52px'
                    }}
                >
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>

            {/* HTML Preview - Iframe */}
            {htmlPreview && (
                <div ref={outputRef} style={{
                    background: '#0d1117',
                    borderRadius: '12px',
                    border: '1px solid #30363d',
                    overflow: 'hidden',
                    marginBottom: '16px'
                }}>
                    {/* Preview Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #30363d',
                        background: '#161b22'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Eye size={14} style={{ color: '#a78bfa' }} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#c9d1d9' }}>
                                Live Preview
                            </span>
                            {executionTime && (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: '#8b949e',
                                    padding: '2px 8px',
                                    background: '#21262d',
                                    borderRadius: '10px'
                                }}>
                                    <Clock size={10} />
                                    {executionTime}ms
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '11px',
                                cursor: 'pointer',
                                minHeight: '32px'
                            }}
                        >
                            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                    </div>

                    {/* Iframe Preview */}
                    <div style={{
                        height: isFullscreen ? '80vh' : '400px',
                        background: '#fff',
                        position: 'relative'
                    }}>
                        <iframe
                            ref={iframeRef}
                            srcDoc={htmlPreview}
                            title="HTML Preview"
                            sandbox="allow-scripts allow-modals"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Console Output (for JavaScript) */}
            {(output.length > 0 || error) && !htmlPreview && (
                <div ref={!htmlPreview ? outputRef : null} style={{
                    background: '#0d1117',
                    borderRadius: '12px',
                    border: '1px solid #30363d',
                    overflow: 'hidden'
                }}>
                    {/* Console Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #30363d',
                        background: '#161b22',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Terminal size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#c9d1d9' }}>
                                Console Output
                            </span>
                            {executionTime && (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: '#8b949e',
                                    padding: '2px 8px',
                                    background: '#21262d',
                                    borderRadius: '10px'
                                }}>
                                    <Clock size={10} />
                                    {executionTime}ms
                                </span>
                            )}
                        </div>
                        {output.length > 0 && (
                            <button
                                onClick={handleCopyOutput}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    background: copied ? '#238636' : '#21262d',
                                    border: '1px solid #30363d',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    minHeight: '32px'
                                }}
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        )}
                    </div>

                    {/* Console Content */}
                    <div style={{
                        padding: '16px',
                        minHeight: '150px',
                        maxHeight: '400px',
                        overflow: 'auto',
                        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                        fontSize: '13px',
                        lineHeight: '1.6'
                    }}>
                        {error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                padding: '12px',
                                background: '#ef444420',
                                border: '1px solid #ef444440',
                                borderRadius: '8px',
                                color: '#ef4444',
                                marginBottom: '12px'
                            }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{error}</span>
                            </div>
                        )}

                        {output.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    padding: '6px 0',
                                    borderBottom: index < output.length - 1 ? '1px solid #21262d' : 'none'
                                }}
                            >
                                <span style={{
                                    color: '#484f58',
                                    minWidth: '24px',
                                    textAlign: 'right',
                                    fontSize: '11px'
                                }}>
                                    {index + 1}
                                </span>
                                <span style={{
                                    color: getOutputColor(item.type),
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {item.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!htmlPreview && output.length === 0 && !error && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
                    borderRadius: '12px',
                    border: '1px dashed #30363d',
                    color: '#8b949e',
                    textAlign: 'center'
                }}>
                    <Code2 size={48} strokeWidth={1} style={{ color: '#8b5cf6', opacity: 0.6, marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px', margin: '0 0 8px', color: '#c9d1d9' }}>Paste code and click Run</p>
                    <span style={{ fontSize: '13px', opacity: 0.6 }}>
                        Supports JavaScript (console) and HTML pages (live preview)
                    </span>
                </div>
            )}

            {/* Info Note */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#21262d',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#8b949e',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
            }}>
                <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <strong>Auto-detect:</strong> HTML pages → Live preview with working buttons & interactions | JavaScript → Console output
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AICodeRunner
