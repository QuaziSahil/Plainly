import { useState, useRef, useEffect } from 'react'
import { Quote, Loader2, Wand2, Copy, Check, RefreshCw, Feather } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIQuoteGenerator() {
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('inspirational')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('What should the quotes be about?')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const quotes = await generateCreativeContent('quote', topic, '', tone)
            setResult(quotes)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate. Please try again.')
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
        setTopic('')
        setTone('inspirational')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Quote Generator"
            description="Find the perfect words with original inspirational and thought-provoking quotes"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Quote}
            result={result ? 'Quotes Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">What topic do you need quotes for? *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., resilience, nature, success, love..."
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Style / Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="inspirational">Inspirational</option>
                    <option value="philosophical">Philosophical</option>
                    <option value="minimalist">Short & Punchy</option>
                    <option value="poetic">Poetic</option>
                    <option value="humorous">Witty / Funny</option>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
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
                        Gathering Wisdom...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get More Quotes
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Quotes
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
                            <Feather size={12} /> Words of Wisdom
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
                            {copied ? 'Copied!' : 'Copy Quotes'}
                        </button>
                    </div>
                    <div style={{
                        padding: '32px',
                        fontSize: '20px',
                        lineHeight: '1.8',
                        fontFamily: 'serif',
                        fontStyle: 'italic',
                        textAlign: 'center',
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

export default AIQuoteGenerator
