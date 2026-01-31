import { useState, useRef, useEffect } from 'react'
import { Palette, Loader2, Wand2, Copy, Check, RefreshCw, Layout } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateColorPalette } from '../../../services/groqAI'

function AIColorPaletteGenerator() {
    const [theme, setTheme] = useState('')
    const [count, setCount] = useState(5)
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!theme.trim()) {
            setError('Please describe a theme or vibe')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const palette = await generateColorPalette(theme, count)
            setResult(palette)
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
        setTheme('')
        setCount(5)
        setResult('')
        setError('')
    }

    // Attempt to extract hex codes from the result to show a preview
    const hexCodes = result.match(/#[0-9A-Fa-f]{6}/g) || []

    return (
        <CalculatorLayout
            title="AI Color Palette Generator"
            description="Generate harmonious color schemes for your brand, app, or interior design"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Palette}
            result={result ? 'Palette Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Describe a theme or vibe *</label>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., Cyberpunk neon, Mediterranean summer, organic earthy tones..."
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Number of Colors</label>
                <select value={count} onChange={(e) => setCount(parseInt(e.target.value))}>
                    <option value={3}>3 Colors</option>
                    <option value={5}>5 Colors</option>
                    <option value={8}>8 Colors</option>
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
                disabled={loading || !theme.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !theme.trim() ? '#333' : 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !theme.trim() ? 'not-allowed' : 'pointer',
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
                        Mixing Colors...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Variation
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Palette
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
                            <Layout size={12} /> Color Swatches
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
                            {copied ? 'Copied!' : 'Copy Hex Codes'}
                        </button>
                    </div>

                    {hexCodes.length > 0 && (
                        <div style={{
                            display: 'flex',
                            height: '100px',
                            width: '100%'
                        }}>
                            {hexCodes.map((hex, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        background: hex,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        color: parseInt(hex.replace('#', ''), 16) > 0xffffff / 2 ? 'black' : 'white',
                                        fontWeight: 'bold',
                                        textShadow: '0 0 4px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {hex}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.8',
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

export default AIColorPaletteGenerator
