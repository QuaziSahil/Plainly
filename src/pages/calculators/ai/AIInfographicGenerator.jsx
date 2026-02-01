import { useState, useRef } from 'react'
import { BarChart3, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIInfographicGenerator() {
    const [topic, setTopic] = useState('')
    const [infographicType, setInfographicType] = useState('statistical')
    const [colorScheme, setColorScheme] = useState('professional')
    const [style, setStyle] = useState('modern')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const infographicTypes = [
        { value: 'statistical', label: 'Statistical', prompt: 'statistical data visualization, charts, graphs, numbers' },
        { value: 'timeline', label: 'Timeline', prompt: 'timeline infographic, chronological, history, process' },
        { value: 'comparison', label: 'Comparison', prompt: 'comparison infographic, vs, side by side, differences' },
        { value: 'process', label: 'Process/Steps', prompt: 'process steps infographic, workflow, how-to, guide' },
        { value: 'hierarchical', label: 'Hierarchical', prompt: 'hierarchical infographic, pyramid, levels, organization' },
        { value: 'geographic', label: 'Geographic', prompt: 'geographic map infographic, location, regional data' },
        { value: 'list', label: 'List/Listicle', prompt: 'list infographic, numbered, top 10, key points' },
        { value: 'anatomy', label: 'Anatomy/Parts', prompt: 'anatomy breakdown infographic, parts, components, diagram' }
    ]

    const colorSchemes = [
        { value: 'professional', label: 'Professional', prompt: 'professional blue colors, corporate, business' },
        { value: 'vibrant', label: 'Vibrant', prompt: 'vibrant colorful, eye-catching, bold colors' },
        { value: 'pastel', label: 'Pastel', prompt: 'soft pastel colors, gentle, calm' },
        { value: 'dark', label: 'Dark Mode', prompt: 'dark theme, black background, modern' },
        { value: 'nature', label: 'Nature', prompt: 'green nature colors, eco, environmental' },
        { value: 'gradient', label: 'Gradient', prompt: 'gradient colors, modern, smooth transitions' },
        { value: 'minimal', label: 'Minimal', prompt: 'minimal colors, black white, simple' },
        { value: 'warm', label: 'Warm', prompt: 'warm colors, orange red yellow, energetic' }
    ]

    const styles = [
        { value: 'modern', label: 'Modern', prompt: 'modern contemporary design, clean lines, 2024 style' },
        { value: 'flat', label: 'Flat Design', prompt: 'flat design, 2D, vector style, simple icons' },
        { value: 'isometric', label: 'Isometric', prompt: 'isometric 3D design, perspective, depth' },
        { value: 'illustrated', label: 'Illustrated', prompt: 'hand illustrated, artistic, creative' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist design, whitespace, simple' },
        { value: 'corporate', label: 'Corporate', prompt: 'corporate professional, business formal' }
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your infographic')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedType = infographicTypes.find(t => t.value === infographicType)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedStyle = styles.find(s => s.value === style)

        const prompt = `professional infographic design about "${topic}", ${selectedType?.prompt}, ${selectedColor?.prompt}, ${selectedStyle?.prompt}, data visualization, high quality graphic design, vertical layout, informative, clear typography, icons and illustrations, educational content`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 768,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate infographic')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `infographic-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setTopic('')
        setInfographicType('statistical')
        setColorScheme('professional')
        setStyle('modern')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Infographic Generator"
            description="Create professional infographics and data visualizations with AI"
            category="AI Tools"
            categoryPath="/ai"
            icon={BarChart3}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Topic */}
            <div className="input-group">
                <label className="input-label">Infographic Topic *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Climate Change Facts, Social Media Statistics, Health Benefits..."
                    className="input-field"
                />
            </div>

            {/* Infographic Type */}
            <div className="input-group">
                <label className="input-label">Infographic Type</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: '8px'
                }}>
                    {infographicTypes.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setInfographicType(t.value)}
                            style={{
                                padding: '10px 8px',
                                background: infographicType === t.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: infographicType === t.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: infographicType === t.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {t.label}
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
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
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

            {/* Style */}
            <div className="input-group">
                <label className="input-label">Design Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {styles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: style === s.value
                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                    : '#21262d',
                                border: style === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: style === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim()
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
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
                    marginTop: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Creating Infographic...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Infographic
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Infographic
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
                📊 <strong>Tip:</strong> Be specific with your topic for better results. Add real data in your final design.
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
                            borderTopColor: '#3b82f6',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                📊 Creating Infographic...
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
                                <BarChart3 size={16} style={{ color: '#3b82f6' }} />
                                Generated Infographic
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
                                alt="Infographic"
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
                        background: '#3b82f610',
                        border: '1px solid #3b82f630',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#60a5fa'
                    }}>
                        📊 <strong>Infographic Ready!</strong> - Great for presentations, social media, and reports
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

export default AIInfographicGenerator
