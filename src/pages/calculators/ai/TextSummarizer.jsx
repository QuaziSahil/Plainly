import { useState } from 'react'
import { FileSearch, Loader2, Wand2, Copy, Check } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { summarizeText } from '../../../services/groqAI'

function TextSummarizer() {
    const [inputText, setInputText] = useState('')
    const [style, setStyle] = useState('concise')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            setError('Please enter text to summarize')
            return
        }

        if (inputText.trim().split(/\s+/).length < 20) {
            setError('Please enter at least 20 words to summarize')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const summary = await summarizeText(inputText, style)
            setResult(summary)
        } catch (err) {
            setError('Failed to summarize. Please try again.')
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
        setInputText('')
        setStyle('concise')
        setResult('')
        setError('')
    }

    const inputWordCount = inputText ? inputText.split(/\s+/).filter(w => w).length : 0
    const resultWordCount = result ? result.split(/\s+/).filter(w => w).length : 0
    const reduction = inputWordCount > 0 && resultWordCount > 0
        ? Math.round((1 - resultWordCount / inputWordCount) * 100)
        : 0

    return (
        <CalculatorLayout
            title="AI Text Summarizer"
            description="Summarize long text into key points"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={FileSearch}
            result={result ? `${reduction}% shorter` : 'Ready'}
            resultLabel="Reduction"
            onReset={handleReset}
        >
            {/* AI Badge */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #3b82f620 0%, #1d4ed8 20%)',
                borderRadius: '10px',
                marginBottom: '16px',
                border: '1px solid #3b82f640'
            }}>
                <Wand2 size={18} color="#3b82f6" />
                <span style={{ fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}>
                    Powered by Groq AI • Llama 3.3 70B
                </span>
            </div>

            {/* Text Input */}
            <div className="input-group">
                <label className="input-label">
                    Text to Summarize *
                    <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: '8px' }}>
                        ({inputWordCount} words)
                    </span>
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your article, essay, or long text here..."
                    rows={8}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        lineHeight: '1.6'
                    }}
                />
            </div>

            {/* Style Option */}
            <div className="input-group">
                <label className="input-label">Summary Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="concise">Concise (2-3 sentences)</option>
                    <option value="detailed">Detailed (full coverage)</option>
                    <option value="bullets">Bullet Points</option>
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

            {/* Summarize Button */}
            <button
                onClick={handleSummarize}
                disabled={loading || inputWordCount < 20}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || inputWordCount < 20 ? '#333' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || inputWordCount < 20 ? 'not-allowed' : 'pointer',
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
                        Summarizing...
                    </>
                ) : (
                    <>
                        <FileSearch size={20} />
                        Summarize Text
                    </>
                )}
            </button>

            {/* Result */}
            {result && (
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #3b82f640',
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
                        <div style={{ fontSize: '12px' }}>
                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                                📝 Summary
                            </span>
                            <span style={{ opacity: 0.5, marginLeft: '12px' }}>
                                {inputWordCount} → {resultWordCount} words ({reduction}% reduction)
                            </span>
                        </div>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#3b82f6' : '#333',
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
                        {result}
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
                    📄 Paste long text and get a concise summary
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

export default TextSummarizer
