import { useState, useRef } from 'react'
import { Paintbrush, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICSSGenerator() {
    const [description, setDescription] = useState('')
    const [method, setMethod] = useState('vanilla')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const methods = [
        { value: 'vanilla', label: 'Vanilla CSS' },
        { value: 'tailwind', label: 'Tailwind CSS' },
        { value: 'scss', label: 'SCSS/Sass' },
        { value: 'cssmodules', label: 'CSS Modules' },
        { value: 'styled', label: 'Styled Components' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what you want to style')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a CSS expert. Generate clean, modern CSS from descriptions.

Method: ${method}

Rules:
- Use modern CSS features (flexbox, grid, custom properties)
- Mobile-first responsive design
- Include hover/focus states where appropriate
- Use semantic class names
- Add helpful comments`

        const prompt = `Generate ${method} CSS for:

${description}

Make it responsive, modern, and production-ready.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate CSS. Please try again.')
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
        setDescription('')
        setMethod('vanilla')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI CSS Generator"
            description="Generate CSS styles from descriptions"
            category="AI Tools"
            categoryPath="/ai"
            icon={Paintbrush}
            result={result ? 'CSS Ready' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What do you want to style? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A responsive navbar with logo on left and links on right, A card component with image, title and button, A pricing table with 3 columns..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '100px'
                    }}
                />
            </div>

            {/* CSS Method */}
            <div className="input-group">
                <label className="input-label">CSS Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    {methods.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating CSS...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Paintbrush size={20} />
                        Generate CSS
                    </>
                )}
            </button>

            {/* Result */}
            {result && (
                <div ref={resultRef} style={{
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
                            <Paintbrush size={12} /> Generated CSS
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                background: copied ? '#10b981' : '#333',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                minHeight: '36px'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            )}

            {!result && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    🎨 Describe what you want and get production-ready CSS
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

export default AICSSGenerator
