import { useState } from 'react'
import { FileEdit, Loader2, Wand2, Copy, Check, RefreshCw, BookOpen } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateBlogPost } from '../../../services/groqAI'

function AIBlogPostGenerator() {
    const [topic, setTopic] = useState('')
    const [outline, setOutline] = useState('')
    const [tone, setTone] = useState('informative')
    const [length, setLength] = useState('medium')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a blog post topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const post = await generateBlogPost(topic, outline, tone, length)
            setResult(post)
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
        setOutline('')
        setTone('informative')
        setLength('medium')
        setResult('')
        setError('')
    }

    const wordCount = result ? result.split(/\s+/).filter(w => w).length : 0

    return (
        <CalculatorLayout
            title="AI Blog Post Generator"
            description="Draft complete, high-quality blog posts instantly with AI"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={FileEdit}
            result={result ? `${wordCount} words` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Blog Post Topic *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Future of Remote Work in 2025"
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Optional Outline or Key Points</label>
                <textarea
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    placeholder="e.g., 1. Current trends, 2. Pros and Cons, 3. Predictions..."
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
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="informative">Informative</option>
                        <option value="conversational">Conversational</option>
                        <option value="professional">Professional</option>
                        <option value="inspirational">Inspirational</option>
                        <option value="authoritative">Authoritative</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Target Length</label>
                    <select value={length} onChange={(e) => setLength(e.target.value)}>
                        <option value="short">Short (400-600 words)</option>
                        <option value="medium">Medium (700-900 words)</option>
                        <option value="long">Long (1000+ words)</option>
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
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        Writing Blog Post...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Rewrite Blog Post
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Blog Post
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
                            <BookOpen size={12} /> Blog Draft • {wordCount} words
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
                            {copied ? 'Copied!' : 'Copy Post'}
                        </button>
                    </div>
                    <div style={{
                        padding: '32px',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'justify'
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

export default AIBlogPostGenerator
