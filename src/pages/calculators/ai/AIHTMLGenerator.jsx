import { useState, useRef } from 'react'
import { Code2, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIHTMLGenerator() {
    const [description, setDescription] = useState('')
    const [semantic, setSemantic] = useState(true)
    const [includeCSS, setIncludeCSS] = useState(true)
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe the HTML structure you need')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an HTML expert. Generate clean, accessible HTML structure.

Rules:
- ${semantic ? 'Use semantic HTML5 elements (header, nav, main, section, article, footer)' : 'Use div-based structure'}
- Include proper ARIA labels for accessibility
- Add meaningful class names
- ${includeCSS ? 'Include basic inline CSS or a style section' : 'Generate HTML only'}
- Mobile-friendly structure
- Include placeholder content`

        const prompt = `Generate HTML5 structure for:

${description}

${semantic ? 'Use semantic HTML5 elements.' : 'Use div-based structure.'}
${includeCSS ? 'Include basic styling.' : 'HTML only, no styles.'}`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate HTML. Please try again.')
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
        setSemantic(true)
        setIncludeCSS(true)
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI HTML Generator"
            description="Generate semantic HTML structure from descriptions"
            category="AI Tools"
            categoryPath="/ai"
            icon={Code2}
            result={result ? 'HTML Ready' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What HTML structure do you need? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A landing page with hero section, features grid, testimonials, and footer with newsletter signup..."
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

            {/* Options */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    minHeight: '44px'
                }}>
                    <input
                        type="checkbox"
                        checked={semantic}
                        onChange={(e) => setSemantic(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Semantic HTML5
                </label>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    minHeight: '44px'
                }}>
                    <input
                        type="checkbox"
                        checked={includeCSS}
                        onChange={(e) => setIncludeCSS(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Include Basic Styling
                </label>
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
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
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
                        Generating HTML...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Code2 size={20} />
                        Generate HTML
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
                            <Code2 size={12} /> Generated HTML
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
                    🏗️ Describe your page and get clean HTML structure
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

export default AIHTMLGenerator
