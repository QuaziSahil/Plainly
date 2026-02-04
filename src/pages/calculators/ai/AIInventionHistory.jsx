import { useState, useRef } from 'react'
import { Lightbulb, Loader2, Wand2, Copy, Check, RefreshCw, Wrench } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { exploreInvention } from '../../../services/groqAI'

function AIInventionHistory() {
    const [invention, setInvention] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!invention.trim()) { setError('Please enter an invention'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const history = await exploreInvention(invention)
            setResult(history)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to explore. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setInvention(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Invention History" description="Discover the fascinating stories behind great inventions" category="AI Tools" categoryPath="/calculators?category=AI" icon={Lightbulb} result={result ? 'History Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Invention or Technology *</label>
                <input type="text" value={invention} onChange={(e) => setInvention(e.target.value)} placeholder="e.g., Telephone, Internet, Airplane, Printing Press, Steam Engine..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !invention.trim()} style={{ width: '100%', padding: '16px', background: loading || !invention.trim() ? '#333' : 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !invention.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Researching...</>) : result ? (<><RefreshCw size={20} />Explore Another Invention</>) : (<><Wand2 size={20} />Explore Invention</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><Wrench size={12} /> Invention History</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>💡 Learn the story behind any invention or technology</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Try everyday items like "zipper" or "microwave" for surprising stories!</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIInventionHistory
