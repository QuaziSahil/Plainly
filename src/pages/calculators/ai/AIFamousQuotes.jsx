import { useState, useRef } from 'react'
import { Quote, Loader2, Wand2, Copy, Check, RefreshCw, MessageSquareQuote } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { findFamousQuotes } from '../../../services/groqAI'

function AIFamousQuotes() {
    const [topic, setTopic] = useState('')
    const [author, setAuthor] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) { setError('Please enter a topic'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const quotes = await findFamousQuotes(topic, author)
            setResult(quotes)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to find quotes. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setTopic(''); setAuthor(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Famous Quotes Finder" description="Find famous quotes about any topic with context and meaning" category="AI Tools" categoryPath="/calculators?category=AI" icon={Quote} result={result ? 'Quotes Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Topic *</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Love, Success, Wisdom, Perseverance, Life..." className="input-field" />
            </div>
            <div className="input-group">
                <label className="input-label">Specific Author (Optional)</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., Einstein, Shakespeare, Gandhi, Mandela..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !topic.trim()} style={{ width: '100%', padding: '16px', background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Finding Quotes...</>) : result ? (<><RefreshCw size={20} />Find More Quotes</>) : (<><Wand2 size={20} />Find Famous Quotes</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquareQuote size={12} /> Famous Quotes</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>💬 Find inspiring quotes on any topic with explanations</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Leave the author blank to get quotes from various sources on your topic.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIFamousQuotes
