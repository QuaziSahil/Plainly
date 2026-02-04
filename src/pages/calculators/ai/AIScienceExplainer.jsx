import { useState, useRef } from 'react'
import { Atom, Loader2, Wand2, Copy, Check, RefreshCw, FlaskConical } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { explainScience } from '../../../services/groqAI'

function AIScienceExplainer() {
    const [concept, setConcept] = useState('')
    const [level, setLevel] = useState('intermediate')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!concept.trim()) { setError('Please enter a scientific concept'); return }
        setLoading(true); setError(''); setResult('')
        try {
            const explanation = await explainScience(concept, level)
            setResult(explanation)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) { setError('Failed to generate. Please try again.'); console.error(err) } finally { setLoading(false) }
    }

    const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    const handleReset = () => { setConcept(''); setLevel('intermediate'); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Science Explainer" description="Understand complex scientific concepts in simple terms" category="AI Tools" categoryPath="/calculators?category=AI" icon={Atom} result={result ? 'Explanation Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Scientific Concept *</label>
                <input type="text" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="e.g., Quantum Entanglement, Photosynthesis, Black Holes, DNA Replication..." className="input-field" />
            </div>
            <div className="input-group">
                <label className="input-label">Explanation Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="beginner">Beginner (ELI15)</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !concept.trim()} style={{ width: '100%', padding: '16px', background: loading || !concept.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !concept.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Explaining...</>) : result ? (<><RefreshCw size={20} />Explain Another Concept</>) : (<><Wand2 size={20} />Explain This Concept</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><FlaskConical size={12} /> Science Explanation</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>🔬 Enter any scientific concept to get a clear explanation</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Choose "Beginner" for simple explanations with everyday analogies.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AIScienceExplainer
