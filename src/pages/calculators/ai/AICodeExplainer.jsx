import { useState, useRef } from 'react'
import { BookOpen, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICodeExplainer() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('auto')
    const [detail, setDetail] = useState('detailed')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'auto', label: 'Auto-detect' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'cpp', label: 'C++' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'sql', label: 'SQL' },
        { value: 'html', label: 'HTML/CSS' }
    ]

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste code to explain')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const detailLevel = detail === 'simple'
            ? 'Explain in simple terms as if to a beginner. Use analogies where helpful.'
            : detail === 'detailed'
                ? 'Provide a thorough explanation with line-by-line breakdown.'
                : 'Give a quick high-level overview of what the code does.'

        const systemPrompt = `You are an expert programming teacher. Explain the provided code clearly.
${detailLevel}

Structure your explanation:
1. Overview - What does this code do overall?
2. Step-by-step breakdown - Explain each important part
3. Key concepts - Highlight important programming concepts used
4. Usage - When/why would you use code like this?`

        const prompt = `Explain this ${language === 'auto' ? '' : language + ' '}code:

\`\`\`
${code}
\`\`\`

Provide a clear, educational explanation.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to explain code. Please try again.')
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

    const handleReset = () => {
        setCode('')
        setLanguage('auto')
        setDetail('detailed')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Explainer"
            description="Understand any code with AI-powered explanations"
            category="AI Tools"
            categoryPath="/ai"
            icon={BookOpen}
            result={result ? 'Explained' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Paste code to explain *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste any code here to get a clear explanation..."
                    rows={8}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#a78bfa',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        minHeight: '180px'
                    }}
                />
            </div>

            {/* Options */}
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
                    <label className="input-label">Detail Level</label>
                    <select value={detail} onChange={(e) => setDetail(e.target.value)}>
                        <option value="quick">Quick Overview</option>
                        <option value="simple">Simple (Beginner-friendly)</option>
                        <option value="detailed">Detailed (Line-by-line)</option>
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

            {/* Explain Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() ? '#333' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
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
                        Analyzing Code...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Re-explain
                    </>
                ) : (
                    <>
                        <BookOpen size={20} />
                        Explain Code
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
                            <BookOpen size={12} /> Code Explanation
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
                        lineHeight: '1.7'
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
                    📖 Paste any code and get a clear, educational explanation
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

export default AICodeExplainer
