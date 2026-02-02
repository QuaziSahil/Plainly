import { useState, useRef } from 'react'
import { GitCommit, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIGitCommitGenerator() {
    const [changes, setChanges] = useState('')
    const [style, setStyle] = useState('conventional')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const styles = [
        { value: 'conventional', label: 'Conventional Commits (feat, fix, etc.)' },
        { value: 'gitmoji', label: 'Gitmoji (with emojis)' },
        { value: 'simple', label: 'Simple (imperative mood)' },
        { value: 'detailed', label: 'Detailed (with body)' }
    ]

    const handleGenerate = async () => {
        if (!changes.trim()) {
            setError('Please describe your changes')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const styleGuide = {
            conventional: 'Use Conventional Commits format: type(scope): description. Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert.',
            gitmoji: 'Use Gitmoji format with relevant emoji at the start. Examples: ✨ feat, 🐛 fix, 📝 docs, 💄 style, ♻️ refactor.',
            simple: 'Use simple imperative mood. Start with a verb like Add, Fix, Update, Remove, Refactor.',
            detailed: 'Provide a short subject line (50 chars max), blank line, then detailed body explaining what and why.'
        }

        const systemPrompt = `You are a Git expert. Generate clear, meaningful commit messages.

Style: ${styleGuide[style]}

Rules:
- Be concise but descriptive
- Use present tense, imperative mood
- First line should be max 50-72 characters
- Provide 3 alternative commit messages`

        const prompt = `Generate git commit messages for these changes:

${changes}

Style: ${style}

Provide 3 alternative commit messages, from most concise to most detailed.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 512 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate commit message. Please try again.')
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
        setChanges('')
        setStyle('conventional')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Git Commit Generator"
            description="Generate meaningful commit messages from your changes"
            category="AI Tools"
            categoryPath="/ai"
            icon={GitCommit}
            result={result ? 'Messages Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Changes Input */}
            <div className="input-group">
                <label className="input-label">Describe your changes *</label>
                <textarea
                    value={changes}
                    onChange={(e) => setChanges(e.target.value)}
                    placeholder="e.g., Added user authentication with JWT tokens, Fixed bug where users couldn't logout, Updated navbar styling for mobile..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '100px'
                    }}
                />
            </div>

            {/* Commit Style */}
            <div className="input-group">
                <label className="input-label">Commit Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    {styles.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !changes.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !changes.trim() ? '#333' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !changes.trim() ? 'not-allowed' : 'pointer',
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
                        Generating...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <GitCommit size={20} />
                        Generate Commits
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
                            <GitCommit size={12} /> Commit Messages
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
                    📝 Describe your changes and get perfect commit messages
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

export default AIGitCommitGenerator
