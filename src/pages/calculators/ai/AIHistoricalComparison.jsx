import { useState, useRef } from 'react'
import { GitCompare, Loader2, Wand2, Copy, Check, RefreshCw, Scale } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { compareHistorical } from '../../../services/groqAI'

function AIHistoricalComparison() {
    const [item1, setItem1] = useState('')
    const [item2, setItem2] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!item1.trim() || !item2.trim()) { setError('Please enter both items to compare'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const comparison = await compareHistorical(item1, item2)
            setResult(comparison)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to compare. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setItem1(''); setItem2(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Historical Comparison" description="Compare two historical events, figures, or eras" category="AI Tools" categoryPath="/calculators?category=AI" icon={GitCompare} result={result ? 'Comparison Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">First Item *</label>
                <input type="text" value={item1} onChange={(e) => setItem1(e.target.value)} placeholder="e.g., Roman Empire, Napoleon, World War I..." className="input-field" />
            </div>
            <div className="input-group">
                <label className="input-label">Second Item *</label>
                <input type="text" value={item2} onChange={(e) => setItem2(e.target.value)} placeholder="e.g., Byzantine Empire, Alexander the Great, World War II..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !item1.trim() || !item2.trim()} style={{ width: '100%', padding: '16px', background: loading || !item1.trim() || !item2.trim() ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !item1.trim() || !item2.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Comparing...</>) : result ? (<><RefreshCw size={20} />Compare Again</>) : (<><Wand2 size={20} />Compare Now</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><Scale size={12} /> Historical Comparison</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>⚖️ Compare any two historical subjects side-by-side</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Compare similar things for interesting insights - like "Ancient Greece vs Ancient Rome".</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIHistoricalComparison
