import { useState, useRef, useEffect } from 'react'
import { Feather, Loader2, Wand2, Copy, Check, RefreshCw, PenTool } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIPoemGenerator() {
    const [topic, setTopic] = useState('')
    const [style, setStyle] = useState('Haiku')
    const [tone, setTone] = useState('emotive')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your poem')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const poem = await generateCreativeContent('poem', topic, style, tone)
            setResult(poem)
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
        setStyle('Haiku')
        setTone('emotive')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Poem Generator"
            description="Express yourself through beautiful and evocative AI-written poetry"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Feather}
            result={result ? 'Poem Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">What should the poem be about? *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The sound of rain, falling in love, the vastness of space..."
                    className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Poetry Style</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        <option value="Haiku">Haiku</option>
                        <option value="Sonnet">Sonnet</option>
                        <option value="Free Verse">Free Verse</option>
                        <option value="Limerick">Limerick</option>
                        <option value="Villanelle">Villanelle</option>
                        <option value="Rhyming Couplets">Rhyming Couplets</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="emotive">Emotive / Deep</option>
                        <option value="hopeful">Hopeful / Bright</option>
                        <option value="melancholy">Melancholy / Sad</option>
                        <option value="playful">Playful / Witty</option>
                        <option value="mystical">Mystical / Abstract</option>
                    </select>
                </div>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
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
                        Composing Verses...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Poem
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Poem
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
                            <PenTool size={12} /> AI Composition
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
                            {copied ? 'Copied!' : 'Copy Poem'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '18px',
                        lineHeight: '1.8',
                        fontFamily: 'serif',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'center'
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

export default AIPoemGenerator
