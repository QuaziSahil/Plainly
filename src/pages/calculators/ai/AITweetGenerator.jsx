import { useState, useRef } from 'react'
import { Twitter, Loader2, Wand2, Copy, Check, RefreshCw, Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateSocialContent } from '../../../services/groqAI'

function AITweetGenerator() {
    const [topic, setTopic] = useState('')
    const [keywords, setKeywords] = useState('')
    const [tone, setTone] = useState('engaging')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const tweets = await generateSocialContent('Twitter/X', topic, keywords, tone)
            setResult(tweets)
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
        setKeywords('')
        setTone('engaging')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Tweet Generator"
            description="Generate viral and engaging tweets for X (Twitter)"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Twitter}
            result={result ? 'Tweets Ready' : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">What is the tweet about? *</label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., launching a new app, sharing a productivity tip, industry news..."
                    rows={2}
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

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Keywords (optional)</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., tech, saas, growth"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="engaging">Engaging / Viral</option>
                        <option value="witty">Witty / Humorous</option>
                        <option value="informative">Informative / Educational</option>
                        <option value="controversial">Thought-Provoking</option>
                        <option value="professional">Professional / News</option>
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

            <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #1d9bf0 0%, #00acee 100%)',
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
                        Drafting Viral Content...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get More Variations
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate AI Tweets
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
                        <Hash size={12} /> Tweet Drafts
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
                        {copied ? 'Copied!' : 'Copy Posts'}
                    </button>
                </div>
                <div style={{
                    padding: '24px',
                    fontSize: '15px',
                    lineHeight: '1.8'
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

export default AITweetGenerator
