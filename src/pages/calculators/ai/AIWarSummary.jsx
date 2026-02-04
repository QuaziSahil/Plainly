import { useState, useRef } from 'react'
import { Swords, Loader2, Wand2, Copy, Check, RefreshCw, Shield } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { summarizeConflict } from '../../../services/groqAI'

function AIWarSummary() {
    const [conflict, setConflict] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!conflict.trim()) { setError('Please enter a war or conflict'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const summary = await summarizeConflict(conflict)
            setResult(summary)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to summarize. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setConflict(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI War Summary" description="Get balanced educational summaries of historical conflicts" category="AI Tools" categoryPath="/calculators?category=AI" icon={Swords} result={result ? 'Summary Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">War or Conflict *</label>
                <input type="text" value={conflict} onChange={(e) => setConflict(e.target.value)} placeholder="e.g., World War II, American Revolution, Napoleonic Wars, Cold War..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !conflict.trim()} style={{ width: '100%', padding: '16px', background: loading || !conflict.trim() ? '#333' : 'linear-gradient(135deg, #64748b 0%, #475569 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !conflict.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Researching...</>) : result ? (<><RefreshCw size={20} />Summarize Another Conflict</>) : (<><Wand2 size={20} />Get Summary</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={12} /> Historical Summary</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>⚔️ Get educational summaries of historical conflicts</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #78350f10 0%, #f59e0b20 100%)', border: '1px solid #f59e0b40', borderRadius: '10px', fontSize: '13px', color: '#fbbf24', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>⚠️</span><span><strong>Note:</strong> This tool provides educational historical information. War affects real people and should be studied respectfully.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIWarSummary
