import { useState } from 'react'
import { Linkedin, Loader2, Wand2, Copy, Check, RefreshCw, Share2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateSocialContent } from '../../../services/groqAI'

function AILinkedInPostGenerator() {
    const [topic, setTopic] = useState('')
    const [keywords, setKeywords] = useState('')
    const [tone, setTone] = useState('professional')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please describe what your LinkedIn post is about')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const posts = await generateSocialContent('LinkedIn', topic, keywords, tone)
            setResult(posts)
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
        setTone('professional')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI LinkedIn Post Generator"
            description="Create professional, engaging content for your LinkedIn network"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Linkedin}
            result={result ? 'Posts Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">What is the post about? *</label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., sharing a new job update, industry insights, a professional achievement..."
                    rows={3}
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
                    <label className="input-label">Keywords / Hashtags</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., leadership, tech, career-growth"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="professional">Professional</option>
                        <option value="thought-leader">Thought Leadership</option>
                        <option value="enthusiastic">Enthusiastic / News</option>
                        <option value="storytelling">Story-Driven</option>
                        <option value="minimalist">Minimalist</option>
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
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)',
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
                        Crafting Post...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get More Options
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate LinkedIn Posts
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
                            <Share2 size={12} /> Post Options
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
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.8',
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

export default AILinkedInPostGenerator
