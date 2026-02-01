import { useState, useRef } from 'react'
import { Search, Loader2, Wand2, Copy, Check, RefreshCw, BarChart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateMetaDescription } from '../../../services/groqAI'

function AIMetaDescriptionGenerator() {
    const [pageTitle, setPageTitle] = useState('')
    const [content, setContent] = useState('')
    const [keywords, setKeywords] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!pageTitle.trim() && !content.trim()) {
            setError('Please enter a Page Title or Content Summary')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const description = await generateMetaDescription(pageTitle, content, keywords)
            setResult(description)
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
        setPageTitle('')
        setContent('')
        setKeywords('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Meta Description Generator"
            description="Generate high-CTR, SEO-optimized meta descriptions for your web pages"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Search}
            result={result ? 'Descriptions Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Page Title *</label>
                <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="e.g., Best Productivity Apps for 2025"
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Content Summary / Main Points *</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g., A review of the top 10 productivity apps focusing on minimalism and AI integration..."
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

            <div className="input-group">
                <label className="input-label">Target Keywords (optional)</label>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., productivity, apps, 2025 tools"
                    className="input-field"
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
                onClick={handleGenerate}
                disabled={loading || (!pageTitle.trim() && !content.trim())}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || (!pageTitle.trim() && !content.trim()) ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || (!pageTitle.trim() && !content.trim()) ? 'not-allowed' : 'pointer',
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
                        Optimizing for SEO...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get More Options
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Meta Descriptions
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
                        <BarChart size={12} /> Optimized Meta Tags
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
                        {copied ? 'Copied!' : 'Copy Tags'}
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

export default AIMetaDescriptionGenerator
