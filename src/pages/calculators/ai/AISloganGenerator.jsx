import { useState } from 'react'
import { Sparkles, Loader2, Wand2, Copy, Check, RefreshCw, Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateSlogans } from '../../../services/groqAI'

function AISloganGenerator() {
    const [businessName, setBusinessName] = useState('')
    const [description, setDescription] = useState('')
    const [tone, setTone] = useState('catchy')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!businessName.trim() && !description.trim()) {
            setError('Please enter a Business Name or Description')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const slogans = await generateSlogans(businessName, description, tone)
            setResult(slogans)
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
        setBusinessName('')
        setDescription('')
        setTone('catchy')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Slogan Generator"
            description="Find the perfect tagline or slogan for your brand"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Sparkles}
            result={result ? 'Slogans Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Business / Brand Name</label>
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Plainly"
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">What do you do? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., minimalist productivity app, eco-friendly coffee shop..."
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Desired Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="catchy">Catchy & Fun</option>
                    <option value="professional">Professional & Trustworthy</option>
                    <option value="modern">Modern & Techy</option>
                    <option value="luxury">Luxury & Premium</option>
                    <option value="playful">Playful & Witty</option>
                    <option value="short">Short & Punchy</option>
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
                disabled={loading || (!businessName.trim() && !description.trim())}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || (!businessName.trim() && !description.trim()) ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || (!businessName.trim() && !description.trim()) ? 'not-allowed' : 'pointer',
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
                        Brainstorming...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Slogans
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
                            <Zap size={12} /> Slogan Ideas
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
                            {copied ? 'Copied!' : 'Copy List'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '16px',
                        lineHeight: '2.0'
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

export default AISloganGenerator
