import { useState, useRef } from 'react'
import { Globe2, Loader2, Wand2, Copy, Check, RefreshCw, Users } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { exploreCulture } from '../../../services/groqAI'

function AICulturalExplorer() {
    const [culture, setCulture] = useState('')
    const [aspect, setAspect] = useState('traditions')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!culture.trim()) { setError('Please enter a culture or region'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const exploration = await exploreCulture(culture, aspect)
            setResult(exploration)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to explore. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setCulture(''); setAspect('traditions'); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Cultural Explorer" description="Learn about traditions, customs, and cultures worldwide" category="AI Tools" categoryPath="/calculators?category=AI" icon={Globe2} result={result ? 'Culture Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Culture or Region *</label>
                <input type="text" value={culture} onChange={(e) => setCulture(e.target.value)} placeholder="e.g., Japanese, Indian, African, Middle Eastern, Scandinavian..." className="input-field" />
            </div>
            <div className="input-group">
                <label className="input-label">What aspect to explore?</label>
                <select value={aspect} onChange={(e) => setAspect(e.target.value)}>
                    <option value="traditions">Traditions & Customs</option>
                    <option value="food">Food & Cuisine</option>
                    <option value="festivals">Festivals & Celebrations</option>
                    <option value="art">Art & Music</option>
                    <option value="values">Values & Beliefs</option>
                </select>
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !culture.trim()} style={{ width: '100%', padding: '16px', background: loading || !culture.trim() ? '#333' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !culture.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Exploring...</>) : result ? (<><RefreshCw size={20} />Explore Another Culture</>) : (<><Wand2 size={20} />Explore Culture</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /> Cultural Explorer</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>🌍 Explore traditions and customs from any culture</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Select different aspects to get focused information about specific cultural elements.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AICulturalExplorer
