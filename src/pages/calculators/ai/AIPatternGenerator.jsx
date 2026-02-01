import { useState, useRef } from 'react'
import { Grid3X3, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIPatternGenerator() {
    const [patternType, setPatternType] = useState('geometric')
    const [colorScheme, setColorScheme] = useState('vibrant')
    const [complexity, setComplexity] = useState('medium')
    const [customPrompt, setCustomPrompt] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const patternTypes = [
        { value: 'geometric', label: 'Geometric', prompt: 'geometric pattern, shapes, triangles, circles, squares' },
        { value: 'floral', label: 'Floral', prompt: 'floral pattern, flowers, botanical, leaves, nature' },
        { value: 'abstract', label: 'Abstract', prompt: 'abstract pattern, fluid shapes, modern art' },
        { value: 'mandala', label: 'Mandala', prompt: 'mandala pattern, circular, symmetrical, spiritual' },
        { value: 'tribal', label: 'Tribal/Ethnic', prompt: 'tribal ethnic pattern, traditional, cultural motifs' },
        { value: 'art-deco', label: 'Art Deco', prompt: 'art deco pattern, 1920s style, gold accents, elegant' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist pattern, simple lines, clean design' },
        { value: 'retro', label: 'Retro/70s', prompt: 'retro 70s pattern, groovy, psychedelic, vintage' },
        { value: 'japanese', label: 'Japanese', prompt: 'japanese pattern, traditional, waves, cherry blossoms' },
        { value: 'terrazzo', label: 'Terrazzo', prompt: 'terrazzo pattern, speckled, chips, modern' }
    ]

    const colorSchemes = [
        { value: 'vibrant', label: 'Vibrant', prompt: 'vibrant bright colors, saturated' },
        { value: 'pastel', label: 'Pastel', prompt: 'pastel soft colors, light, gentle' },
        { value: 'monochrome', label: 'Monochrome', prompt: 'monochrome, single color variations, elegant' },
        { value: 'earth', label: 'Earth Tones', prompt: 'earth tones, brown, beige, terracotta, natural' },
        { value: 'neon', label: 'Neon', prompt: 'neon colors, glowing, electric, bright' },
        { value: 'gold', label: 'Gold/Luxury', prompt: 'gold, luxury, metallic, premium' },
        { value: 'ocean', label: 'Ocean', prompt: 'ocean colors, blue, teal, aqua, sea' },
        { value: 'sunset', label: 'Sunset', prompt: 'sunset colors, orange, pink, purple, warm' }
    ]

    const complexities = [
        { value: 'simple', label: 'Simple', prompt: 'simple, minimal elements, clean' },
        { value: 'medium', label: 'Medium', prompt: 'moderate detail, balanced' },
        { value: 'complex', label: 'Complex', prompt: 'intricate, detailed, elaborate' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedPattern = patternTypes.find(p => p.value === patternType)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedComplexity = complexities.find(c => c.value === complexity)

        const prompt = `seamless tileable pattern, ${selectedPattern?.prompt}, ${selectedColor?.prompt}, ${selectedComplexity?.prompt}, repeating design, high quality, textile design${customPrompt ? `, ${customPrompt}` : ''}`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate pattern')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `pattern-${patternType}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setPatternType('geometric')
        setColorScheme('vibrant')
        setComplexity('medium')
        setCustomPrompt('')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Pattern Generator"
            description="Create seamless patterns for backgrounds, textiles, and designs"
            category="AI Tools"
            categoryPath="/ai"
            icon={Grid3X3}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Pattern Type */}
            <div className="input-group">
                <label className="input-label">Pattern Type</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {patternTypes.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPatternType(p.value)}
                            style={{
                                padding: '10px 8px',
                                background: patternType === p.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: patternType === p.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: patternType === p.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Scheme */}
            <div className="input-group">
                <label className="input-label">Color Scheme</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {colorSchemes.map(c => (
                        <button
                            key={c.value}
                            onClick={() => setColorScheme(c.value)}
                            style={{
                                padding: '10px 8px',
                                background: colorScheme === c.value
                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                    : '#21262d',
                                border: colorScheme === c.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: colorScheme === c.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complexity */}
            <div className="input-group">
                <label className="input-label">Complexity</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {complexities.map(c => (
                        <button
                            key={c.value}
                            onClick={() => setComplexity(c.value)}
                            style={{
                                padding: '10px 24px',
                                background: complexity === c.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: complexity === c.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: complexity === c.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Prompt */}
            <div className="input-group">
                <label className="input-label">Additional Elements (Optional)</label>
                <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., with stars, include hearts, add dots..."
                    className="input-field"
                />
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
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
                    marginTop: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Creating Pattern...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Pattern
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Pattern
                    </>
                )}
            </button>

            {/* Info */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#3b82f610',
                border: '1px solid #3b82f630',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#60a5fa'
            }}>
                💡 <strong>Tip:</strong> Patterns work great for backgrounds, textiles, wrapping paper, and web design.
            </div>

            {/* Loading Animation */}
            {loading && (
                <div style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '4px solid #333',
                            borderTopColor: '#8b5cf6',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                🎨 Generating Pattern...
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>
                                This may take 10-30 seconds
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Result */}
            {imageUrl && !loading && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
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
                            background: '#0d1117',
                            borderBottom: '1px solid #333'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#e6edf3',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Grid3X3 size={16} style={{ color: '#a78bfa' }} />
                                Generated Pattern
                            </span>
                            <button
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0a0a0a',
                            padding: '16px'
                        }}>
                            <img
                                src={imageUrl}
                                alt="Generated Pattern"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#10b98110',
                        border: '1px solid #10b98130',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#10b981'
                    }}>
                        ✨ <strong>Pattern Generated!</strong> - Free to use for any project
                    </div>

                    {/* Refresh Tip */}
                    <div style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
                        border: '1px solid #3b82f640',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '16px' }}>💡</span>
                        <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
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

export default AIPatternGenerator
