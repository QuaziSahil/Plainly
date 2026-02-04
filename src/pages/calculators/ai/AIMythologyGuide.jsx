import { useState, useRef } from 'react'
import { Sparkles, Loader2, Wand2, Copy, Check, RefreshCw, BookOpenCheck } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { exploreMythology } from '../../../services/groqAI'

function AIMythologyGuide() {
    const [topic, setTopic] = useState('')
    const [culture, setCulture] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) { setError('Please enter a mythology topic'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const myth = await exploreMythology(topic, culture)
            setResult(myth)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to explore. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setTopic(''); setCulture(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Mythology Guide" description="Explore myths, legends, and folklore from around the world" category="AI Tools" categoryPath="/calculators?category=AI" icon={Sparkles} result={result ? 'Myth Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Mythology Topic *</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Zeus, Thor, Dragons, Creation myths, Underworld..." className="input-field" />
            </div>
            <div className="input-group">
                <label className="input-label">Culture/Region (Optional)</label>
                <input type="text" value={culture} onChange={(e) => setCulture(e.target.value)} placeholder="e.g., Greek, Norse, Egyptian, Hindu, Celtic..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !topic.trim()} style={{ width: '100%', padding: '16px', background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Exploring Myths...</>) : result ? (<><RefreshCw size={20} />Explore Another Myth</>) : (<><Wand2 size={20} />Explore Mythology</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpenCheck size={12} /> Mythology Guide</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>🌟 Explore myths and legends from any culture</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Try comparing similar myths across cultures for fascinating connections.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIMythologyGuide
