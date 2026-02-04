import { useState, useRef } from 'react'
import { Globe, Loader2, Wand2, Copy, Check, RefreshCw, MapPin } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCountryGuide } from '../../../services/groqAI'

function AICountryGuide() {
    const [country, setCountry] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!country.trim()) {
            setError('Please enter a country name')
            return
        }
        setLoading(true)
        setError('')
        setResult('')
        try {
            const guide = await generateCountryGuide(country)
            setResult(guide)
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

    const handleReset = () => { setCountry(''); setResult(''); setError('') }

    return (
        <CalculatorLayout title="AI Country Guide" description="Get comprehensive information about any country" category="AI Tools" categoryPath="/calculators?category=AI" icon={Globe} result={result ? 'Guide Ready' : 'Ready'} resultLabel="Generated" fullContent={result} toolType="ai" onReset={handleReset}>
            <div className="input-group">
                <label className="input-label">Which country do you want to learn about? *</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., Japan, Brazil, Germany, India..." className="input-field" />
            </div>

            {error && (<div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>)}

            <button onClick={handleGenerate} disabled={loading || !country.trim()} style={{ width: '100%', padding: '16px', background: loading || !country.trim() ? '#333' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading || !country.trim() ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Researching...</>) : result ? (<><RefreshCw size={20} />Explore Another Country</>) : (<><Wand2 size={20} />Generate Country Guide</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> Country Guide</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>🌍 Enter any country to learn about its culture, history, and more</div>)}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '16px' }}>💡</span><span><strong>Tip:</strong> Works with any country name - try both official and common names.</span></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AICountryGuide
