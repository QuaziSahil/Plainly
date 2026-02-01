import { useState, useRef } from 'react'
import { Code2, Download, Copy, Check, FileCode, Eye, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AICodePreview() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [filename, setFilename] = useState('code')
    const [copied, setCopied] = useState(false)
    const [downloaded, setDownloaded] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const previewRef = useRef(null)

    const languages = [
        { value: 'javascript', label: 'JavaScript', ext: 'js' },
        { value: 'typescript', label: 'TypeScript', ext: 'ts' },
        { value: 'python', label: 'Python', ext: 'py' },
        { value: 'java', label: 'Java', ext: 'java' },
        { value: 'csharp', label: 'C#', ext: 'cs' },
        { value: 'cpp', label: 'C++', ext: 'cpp' },
        { value: 'go', label: 'Go', ext: 'go' },
        { value: 'rust', label: 'Rust', ext: 'rs' },
        { value: 'php', label: 'PHP', ext: 'php' },
        { value: 'ruby', label: 'Ruby', ext: 'rb' },
        { value: 'swift', label: 'Swift', ext: 'swift' },
        { value: 'kotlin', label: 'Kotlin', ext: 'kt' },
        { value: 'html', label: 'HTML', ext: 'html' },
        { value: 'css', label: 'CSS', ext: 'css' },
        { value: 'scss', label: 'SCSS', ext: 'scss' },
        { value: 'sql', label: 'SQL', ext: 'sql' },
        { value: 'json', label: 'JSON', ext: 'json' },
        { value: 'yaml', label: 'YAML', ext: 'yaml' },
        { value: 'markdown', label: 'Markdown', ext: 'md' },
        { value: 'bash', label: 'Bash/Shell', ext: 'sh' },
        { value: 'jsx', label: 'React JSX', ext: 'jsx' },
        { value: 'tsx', label: 'React TSX', ext: 'tsx' },
        { value: 'vue', label: 'Vue', ext: 'vue' }
    ]

    const getExtension = () => {
        const lang = languages.find(l => l.value === language)
        return lang?.ext || 'txt'
    }

    const lines = code.split('\n')

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const ext = getExtension()
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename || 'code'}.${ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 2000)
    }

    const handlePreview = () => {
        if (code.trim()) {
            setShowPreview(true)
            setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        }
    }

    const handleReset = () => {
        setCode('')
        setLanguage('javascript')
        setFilename('code')
        setShowPreview(false)
    }

    return (
        <CalculatorLayout
            title="Code Preview & Download"
            description="Preview, copy, and download any code with line numbers"
            category="AI Tools"
            categoryPath="/ai"
            icon={Code2}
            result={showPreview ? `${lines.length} Lines` : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Paste Your Code *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste any code here to preview with line numbers and download..."
                    rows={10}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#10b981',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        minHeight: '220px'
                    }}
                />
            </div>

            {/* Options Row */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Filename (optional)</label>
                    <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="code"
                        className="input-field"
                    />
                </div>
            </div>

            {/* Preview Button */}
            <button
                onClick={handlePreview}
                disabled={!code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: !code.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: !code.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    minHeight: '52px'
                }}
            >
                {showPreview ? (
                    <>
                        <RefreshCw size={20} />
                        Refresh Preview
                    </>
                ) : (
                    <>
                        <Eye size={20} />
                        Preview Code
                    </>
                )}
            </button>

            {/* Code Preview */}
            {showPreview && code.trim() ? (
                <div ref={previewRef} style={{
                    background: '#0d1117',
                    borderRadius: '12px',
                    border: '1px solid #30363d',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
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
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FileCode size={14} style={{ color: '#8b5cf6' }} />
                            <span style={{
                                fontSize: '11px',
                                padding: '4px 10px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                borderRadius: '6px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {language}
                            </span>
                            <span style={{ fontSize: '12px', color: '#8b949e' }}>
                                {filename}.{getExtension()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleCopy}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    background: copied ? '#238636' : '#21262d',
                                    border: '1px solid #30363d',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    background: downloaded ? '#238636' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                {downloaded ? <Check size={14} /> : <Download size={14} />}
                                {downloaded ? 'Downloaded!' : 'Download'}
                            </button>
                        </div>
                    </div>

                    {/* Code Content */}
                    <div style={{
                        display: 'flex',
                        overflow: 'auto',
                        maxHeight: '500px'
                    }}>
                        {/* Line Numbers */}
                        <div style={{
                            padding: '16px 12px',
                            background: '#0d1117',
                            borderRight: '1px solid #30363d',
                            userSelect: 'none',
                            textAlign: 'right',
                            minWidth: '50px',
                            position: 'sticky',
                            left: 0
                        }}>
                            {lines.map((_, i) => (
                                <div key={i} style={{
                                    fontSize: '12px',
                                    lineHeight: '1.6',
                                    color: '#484f58',
                                    fontFamily: 'monospace'
                                }}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Code */}
                        <pre style={{
                            margin: 0,
                            padding: '16px',
                            flex: 1,
                            overflow: 'visible',
                            background: 'transparent'
                        }}>
                            <code style={{
                                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                                fontSize: '13px',
                                lineHeight: '1.6',
                                color: '#e6edf3',
                                whiteSpace: 'pre'
                            }}>
                                {code}
                            </code>
                        </pre>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '10px 16px',
                        borderTop: '1px solid #30363d',
                        background: '#161b22',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#8b949e'
                    }}>
                        <span>{lines.length} lines</span>
                        <span>{code.length} characters</span>
                    </div>
                </div>
            ) : !showPreview && (
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
                    <p style={{ fontSize: '16px', margin: '0 0 8px', color: '#c9d1d9' }}>Your code preview will appear here</p>
                    <span style={{ fontSize: '13px', opacity: 0.6 }}>Paste code and click Preview</span>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default AICodePreview
