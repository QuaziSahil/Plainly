import { useState, useRef } from 'react'
import { BrainCircuit, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { simplifyExplanation } from '../../../services/groqAI'

function AIExplanationSimplifier() {
    const [text, setText] = useState('')
    const [targetAudience, setTargetAudience] = useState('a 10-year old')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError('Please enter a concept or text to simplify')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const simplified = await simplifyExplanation(text, targetAudience)
            setResult(simplified)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to simplify. Please try again.')
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
        setText('')
        setTargetAudience('a 10-year old')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Explanation Simplifier"
            description="Break down complex concepts into simple, easy-to-understand language"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={BrainCircuit}
            result={result ? "Explanation Ready" : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Complex Concept or Text *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a complex paragraph or enter a concept like 'String Theory' or 'Blockchain'..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Explain it like I am...</label>
                <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                    <option value="a 5-year old">a 5-year old (Simple & Playful)</option>
                    <option value="a 10-year old">a 10-year old (Clear & Relatable)</option>
                    <option value="a high schooler">a high schooler (Conceptual & Solid)</option>
                    <option value="a non-expert adult">a non-expert adult (Professional but Plain)</option>
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

            <button
                onClick={handleGenerate}
                disabled={loading || !text.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !text.trim() ? '#333' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Simplifying...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        New Version
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Simplify it!
                    </>
                )}
            </button>

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
                        <span style={{ fontSize: '12px', opacity: 0.6 }}>
                            ✨ Simplified Result
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#10b981' : '#333',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            )}

            {/* Refresh Tip */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
                border: '1px solid #3b82f640',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
            }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
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

export default AIExplanationSimplifier
