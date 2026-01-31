import { useState } from 'react'
import { ShoppingBag, Loader2, Wand2, Copy, Check, RefreshCw, Tag } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateProductDescription } from '../../../services/groqAI'

function AIProductDescriptionGenerator() {
    const [productName, setProductName] = useState('')
    const [features, setFeatures] = useState('')
    const [audience, setAudience] = useState('')
    const [tone, setTone] = useState('persuasive')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!productName.trim()) {
            setError('Please enter the Product Name')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const description = await generateProductDescription(productName, features, audience, tone)
            setResult(description)
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
        setProductName('')
        setFeatures('')
        setAudience('')
        setTone('persuasive')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Product Description Generator"
            description="Write compelling product copy that drives sales"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={ShoppingBag}
            result={result ? 'Description Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Product Name *</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Ultra-Hydrating Night Cream"
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Key Features / Benefits</label>
                <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="e.g., Organic ingredients, Lavender scent, Non-greasy formula..."
                    rows={3}
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

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Target Audience</label>
                    <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g., Eco-conscious women 25-40"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="persuasive">Persuasive</option>
                        <option value="luxury">Luxury / Elegant</option>
                        <option value="playful">Playful / Fun</option>
                        <option value="minimalist">Minimalist / Clean</option>
                        <option value="technical">Technical / Precise</option>
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
                disabled={loading || !productName.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !productName.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !productName.trim() ? 'not-allowed' : 'pointer',
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
                        Writing Copy...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Rewrite Description
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Description
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
                            <Tag size={12} /> Product Description
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
                            {copied ? 'Copied!' : 'Copy Description'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
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

export default AIProductDescriptionGenerator
