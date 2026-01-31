import { useState } from 'react'
import { Maximize2, Loader2, Wand2, Copy, Check, RefreshCw, FileText } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { adjustSentenceLength } from '../../../services/groqAI'

function AISentenceExpander() {
    const [text, setText] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleExpand = async () => {
        if (!text.trim()) {
            setError('Please enter some text to expand')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const expanded = await adjustSentenceLength(text, 'expand')
            setResult(expanded)
        } catch (err) {
            setError('Failed to expand. Please try again.')
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
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Sentence Expander"
            description="Elaborate on your sentences and add more detail and depth to your writing"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Maximize2}
            result={result ? 'Expanded' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Sentence or Paragraph to Expand *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Short sentence you want to expand..."
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
                onClick={handleExpand}
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
                        Expanding Text...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Expand More
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Elaborate & Expand
                    </>
                )}
            </button>

            {result && (
                <div style={{
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
                            <FileText size={12} /> Expanded Version
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
                            {copied ? 'Copied!' : 'Copy Expanded'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {result}
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

export default AISentenceExpander
