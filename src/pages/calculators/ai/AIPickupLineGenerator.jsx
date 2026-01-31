import { useState } from 'react'
import { Heart, Loader2, Wand2, Copy, Check, RefreshCw, MessageSquareHeart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateCreativeContent } from '../../../services/groqAI'

function AIPickupLineGenerator() {
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('witty')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        setResult('')

        try {
            const lines = await generateCreativeContent('joke', `pickup lines about ${topic || 'romance'}`, '', tone)
            setResult(lines)
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
        setTone('witty')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Pickup Line Generator"
            description="Break the ice with creative, witty, and charming pickup lines"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Heart}
            result={result ? 'Lines Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Interests / Topic (optional)</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., science, music, Harry Potter, pizza..."
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Style</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="witty">Witty & Smart</option>
                    <option value="cheesy">Classic Cheesy</option>
                    <option value="smooth">Smooth & Charming</option>
                    <option value="nerdy">Nerdy / Geeky</option>
                </select>
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
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#333' : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
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
                        Casting Charm...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Lines
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Pickup Lines
                    </>
                )}
            </button>

            {result && (
                <div style={{
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
                            <MessageSquareHeart size={12} /> The Icebreakers
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
                            {copied ? 'Copied!' : 'Copy Lines'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '18px',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {result}
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

export default AIPickupLineGenerator
