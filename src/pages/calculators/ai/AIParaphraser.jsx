import { useState, useRef, useEffect } from 'react'
import { RefreshCw, Loader2, Wand2, Copy, Check, FileText } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { improveText } from '../../../services/groqAI'

function AIParaphraser() {
    const [text, setText] = useState('')
    const [tone, setTone] = useState('professional')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleParaphrase = async () => {
        if (!text.trim()) {
            setError('Please enter some text to paraphrase')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const paraphrased = await improveText(text, tone)
            setResult(paraphrased)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to paraphrase. Please try again.')
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
        setTone('professional')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Paraphraser"
            description="Rewrite and improve your text while keeping the same meaning"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={RefreshCw}
            result={result ? 'Rewritten' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Original Text *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type the text you want to rewrite..."
                    rows={6}
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
                <label className="input-label">Desired Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="professional">Professional & Formal</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="creative">Creative & Engaging</option>
                    <option value="concise">Concise & Direct</option>
                    <option value="academic">Academic & Precise</option>
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
                onClick={handleParaphrase}
                disabled={loading || !text.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !text.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        Rewriting...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Paraphrase Again
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Paraphrase Now
                    </>
                )}
            </button>

            {result && (<div ref={resultRef} style={{
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
                            <FileText size={12} /> Paraphrased Text
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
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
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

export default AIParaphraser
