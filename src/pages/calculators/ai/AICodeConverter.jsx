import { useState, useRef } from 'react'
import { ArrowRightLeft, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICodeConverter() {
    const [code, setCode] = useState('')
    const [fromLang, setFromLang] = useState('javascript')
    const [toLang, setToLang] = useState('python')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'cpp', label: 'C++' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'swift', label: 'Swift' },
        { value: 'kotlin', label: 'Kotlin' }
    ]

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste code to convert')
            return
        }
        if (fromLang === toLang) {
            setError('Source and target languages must be different')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an expert polyglot programmer. Convert code between programming languages accurately.

Rules:
- Maintain the same functionality
- Use idiomatic patterns for the target language
- Include proper error handling
- Add comments explaining any significant differences
- Use appropriate naming conventions for the target language`

        const prompt = `Convert this ${fromLang} code to ${toLang}:

\`\`\`${fromLang}
${code}
\`\`\`

Provide the converted ${toLang} code with any necessary explanations of key differences.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to convert code. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSwap = () => {
        const temp = fromLang
        setFromLang(toLang)
        setToLang(temp)
    }

    const handleReset = () => {
        setCode('')
        setFromLang('javascript')
        setToLang('python')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Converter"
            description="Convert code between programming languages instantly"
            category="AI Tools"
            categoryPath="/ai"
            icon={ArrowRightLeft}
            result={result ? 'Converted' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Source Code *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here to convert..."
                    rows={8}
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
                        minHeight: '180px'
                    }}
                />
            </div>

            {/* Language Selectors */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">From</label>
                    <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                        {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleSwap}
                    style={{
                        padding: '12px',
                        background: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#a78bfa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '48px',
                        minHeight: '48px'
                    }}
                    title="Swap languages"
                >
                    <ArrowRightLeft size={20} />
                </button>

                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">To</label>
                    <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
                        {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    marginBottom: '16px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {/* Convert Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !code.trim() || fromLang === toLang}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() || fromLang === toLang ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !code.trim() || fromLang === toLang ? 'not-allowed' : 'pointer',
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
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Converting...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Convert Again
                    </>
                ) : (
                    <>
                        <ArrowRightLeft size={20} />
                        Convert Code
                    </>
                )}
            </button>

            {/* Result */}
            {result && (
                <div ref={resultRef} style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #333',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #333',
                        background: '#0a0a0a'
                    }}>
                        <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ArrowRightLeft size={12} /> {fromLang} → {toLang}
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                background: copied ? '#10b981' : '#333',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                minHeight: '36px'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            )}

            {!result && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    🔄 Convert code between 12+ programming languages
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AICodeConverter
