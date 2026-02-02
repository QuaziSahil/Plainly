import { useState, useRef } from 'react'
import { Bug, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICodeDebugger() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [errorMessage, setErrorMessage] = useState('')
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
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'sql', label: 'SQL' }
    ]

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste your code to debug')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an expert debugger and code reviewer. Analyze the provided code and:
1. Identify any bugs, errors, or issues
2. Explain what's wrong and why
3. Provide the corrected code
4. Add suggestions for improvements

Be thorough but concise. Format your response clearly with sections for:
- Issues Found
- Explanation
- Fixed Code
- Additional Suggestions`

        const prompt = `Debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error message: ${errorMessage}` : 'No specific error message provided.'}

Find and fix any issues.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to analyze code. Please try again.')
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
        setErrorMessage('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Debugger"
            description="Find and fix bugs in your code with AI"
            category="AI Tools"
            categoryPath="/ai"
            icon={Bug}
            result={result ? 'Analysis Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Paste your code *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste the code you want to debug here..."
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

            {/* Error Message */}
            <div className="input-group">
                <label className="input-label">Error message (optional)</label>
                <textarea
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="Paste any error message you're seeing..."
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#ef4444',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                    }}
                />
            </div>

            {/* Language */}
            <div className="input-group">
                <label className="input-label">Programming Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
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

            {/* Debug Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() ? '#333' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                        Re-analyze
                    </>
                ) : (
                    <>
                        <Bug size={20} />
                        Debug Code
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
                            <Bug size={12} /> Debug Analysis
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
                        lineHeight: '1.6'
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
                    🐛 Paste your broken code and let AI find the bugs
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

export default AICodeDebugger
