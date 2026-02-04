import { useState, useRef } from 'react'
import { Clock, Loader2, Wand2, Copy, Check, RefreshCw, Calendar } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateTimeline } from '../../../services/groqAI'

function AITimelineGenerator() {
    const [topic, setTopic] = useState('')
    const [startYear, setStartYear] = useState('')
    const [endYear, setEndYear] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const timeline = await generateTimeline(topic, startYear, endYear)
            setResult(timeline)
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
        setTopic('')
        setStartYear('')
        setEndYear('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Timeline Generator"
            description="Generate chronological timelines for any topic or event"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Clock}
            result={result ? 'Timeline Ready' : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Topic or Event *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Space Exploration, American Civil Rights Movement, History of AI..."
                    className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Start Year (Optional)</label>
                    <input
                        type="text"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        placeholder="e.g., 1900"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">End Year (Optional)</label>
                    <input
                        type="text"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        placeholder="e.g., 2024"
                        className="input-field"
                    />
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%', padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none', borderRadius: '12px', color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px'
                }}
            >
                {loading ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Creating Timeline...</>)
                    : result ? (<><RefreshCw size={20} />Generate New Timeline</>)
                        : (<><Wand2 size={20} />Generate Timeline</>)}
            </button>

            {result && (<div ref={resultRef} style={{ background: '#1a1a2e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} /> Timeline</span>
                    <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.8' }}><AIOutputFormatter content={result} /></div>
            </div>)}

            {!result && !loading && (<div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5, fontSize: '14px' }}>⏳ Create chronological timelines for any historical topic</div>)}

            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)', border: '1px solid #3b82f640', borderRadius: '10px', fontSize: '13px', color: '#60a5fa', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <span><strong>Tip:</strong> Leave year fields empty for an automatic timeline covering the full history.</span>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </CalculatorLayout>
    )
}

export default AITimelineGenerator
