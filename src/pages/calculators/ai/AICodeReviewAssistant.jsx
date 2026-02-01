import { useState, useRef } from 'react'
import { Search, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICodeReviewAssistant() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [focus, setFocus] = useState('all')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'php', label: 'PHP' }
    ]

    const focusAreas = [
        { value: 'all', label: 'Complete Review' },
        { value: 'security', label: 'Security Focus' },
        { value: 'performance', label: 'Performance Focus' },
        { value: 'readability', label: 'Readability Focus' },
        { value: 'bestpractices', label: 'Best Practices' }
    ]

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste code to review')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const focusGuide = {
            all: 'Review everything: security, performance, readability, maintainability, and best practices.',
            security: 'Focus on security vulnerabilities: injection attacks, XSS, authentication issues, data exposure.',
            performance: 'Focus on performance: time/space complexity, memory leaks, unnecessary operations.',
            readability: 'Focus on readability: naming, formatting, code organization, clarity.',
            bestpractices: 'Focus on best practices: design patterns, SOLID principles, DRY, proper error handling.'
        }

        const systemPrompt = `You are a senior code reviewer. Provide constructive, actionable feedback.

${focusGuide[focus]}

For each issue:
1. Identify the problem
2. Explain why it's an issue
3. Provide the fix with code example

Rate the code quality (1-10) and prioritize issues by severity.`

        const prompt = `Review this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a thorough code review with specific suggestions for improvement.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to review code. Please try again.')
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
        setLanguage('javascript')
        setFocus('all')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Review Assistant"
            description="Get expert code review feedback instantly"
            category="AI Tools"
            categoryPath="/ai"
            icon={Search}
            result={result ? 'Review Ready' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Code to review *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste the code you want reviewed..."
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
                    <label className="input-label">Review Focus</label>
                    <select value={focus} onChange={(e) => setFocus(e.target.value)}>
                        {focusAreas.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
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

            {/* Review Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() ? '#333' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
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
                        Reviewing Code...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Re-review
                    </>
                ) : (
                    <>
                        <Search size={20} />
                        Review Code
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
                            <Search size={12} /> Code Review
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
                    🔍 Get expert code review feedback in seconds
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

export default AICodeReviewAssistant
