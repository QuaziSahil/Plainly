import { useState } from 'react'
import { Minimize2, Loader2, Wand2, Copy, Check, RefreshCw, FileText } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { adjustSentenceLength } from '../../../services/groqAI'

function AISentenceShortener() {
    const [text, setText] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleShorten = async () => {
        if (!text.trim()) {
            setError('Please enter some text to shorten')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const shortened = await adjustSentenceLength(text, 'shorten')
            setResult(shortened)
        } catch (err) {
            setError('Failed to shorten. Please try again.')
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
            title="AI Sentence Shortener"
            description="Make your writing concise and direct by removing fluff and unnecessary words"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Minimize2}
            result={result ? 'Shortened' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Text to Shorten *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type text that is too long or wordy..."
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
                onClick={handleShorten}
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
                        Optimizing for Brevity...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Shorten More
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Make Concise
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
                            <FileText size={12} /> Concise Version
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
                            {copied ? 'Copied!' : 'Copy Result'}
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

export default AISentenceShortener
