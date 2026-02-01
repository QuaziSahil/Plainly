import { useState, useRef } from 'react'
import { Presentation, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIPresentationSlideGenerator() {
    const [topic, setTopic] = useState('')
    const [slideType, setSlideType] = useState('title')
    const [colorScheme, setColorScheme] = useState('professional')
    const [style, setStyle] = useState('modern')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const slideTypes = [
        { value: 'title', label: 'Title Slide', prompt: 'title slide, main heading, impactful opening' },
        { value: 'content', label: 'Content Slide', prompt: 'content slide, bullet points, text layout' },
        { value: 'comparison', label: 'Comparison', prompt: 'comparison slide, side by side, versus' },
        { value: 'timeline', label: 'Timeline', prompt: 'timeline slide, process, steps, chronological' },
        { value: 'stats', label: 'Statistics', prompt: 'statistics slide, charts, graphs, data visualization' },
        { value: 'quote', label: 'Quote', prompt: 'quote slide, testimonial, inspiring message' },
        { value: 'team', label: 'Team', prompt: 'team slide, people, organization' },
        { value: 'closing', label: 'Closing/Thank You', prompt: 'closing slide, thank you, contact information' }
    ]

    const colorSchemes = [
        { value: 'professional', label: 'Professional', prompt: 'professional blue theme, corporate, business' },
        { value: 'creative', label: 'Creative', prompt: 'creative colorful theme, vibrant, dynamic' },
        { value: 'dark', label: 'Dark Mode', prompt: 'dark theme, black background, modern' },
        { value: 'minimal', label: 'Minimal', prompt: 'minimal white theme, clean, simple' },
        { value: 'gradient', label: 'Gradient', prompt: 'gradient background, modern, smooth colors' },
        { value: 'nature', label: 'Nature', prompt: 'green nature theme, eco-friendly, fresh' },
        { value: 'tech', label: 'Tech', prompt: 'tech purple blue theme, digital, futuristic' },
        { value: 'warm', label: 'Warm', prompt: 'warm orange theme, engaging, energetic' }
    ]

    const styles = [
        { value: 'modern', label: 'Modern', prompt: 'modern 2024 design, clean, contemporary' },
        { value: 'corporate', label: 'Corporate', prompt: 'corporate professional, business formal' },
        { value: 'creative', label: 'Creative', prompt: 'creative artistic, unique layout' },
        { value: 'minimal', label: 'Minimal', prompt: 'minimal design, lots of whitespace' },
        { value: 'bold', label: 'Bold', prompt: 'bold impactful, large typography' },
        { value: 'elegant', label: 'Elegant', prompt: 'elegant sophisticated, premium look' }
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your slide')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedType = slideTypes.find(t => t.value === slideType)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedStyle = styles.find(s => s.value === style)

        const prompt = `professional presentation slide design about "${topic}", ${selectedType?.prompt}, ${selectedColor?.prompt}, ${selectedStyle?.prompt}, PowerPoint slide, 16:9 aspect ratio, high quality, professional typography, well structured layout, presentation design`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 576
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate slide')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `presentation-slide-${Date.now()}.png`
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
        setSlideType('title')
        setColorScheme('professional')
        setStyle('modern')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Presentation Slide Generator"
            description="Create professional presentation slides with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Presentation}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Topic */}
            <div className="input-group">
                <label className="input-label">Slide Topic/Content *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Q4 Sales Report, Product Launch, Company Vision..."
                    className="input-field"
                />
            </div>

            {/* Slide Type */}
            <div className="input-group">
                <label className="input-label">Slide Type</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {slideTypes.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setSlideType(t.value)}
                            style={{
                                padding: '10px 8px',
                                background: slideType === t.value
                                    ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                                    : '#21262d',
                                border: slideType === t.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: slideType === t.value ? '600' : '400',
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
                <label className="input-label">Color Theme</label>
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
                        Creating Slide...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Slide
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Slide
                    </>
                )}
            </button>

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
                            borderTopColor: '#f97316',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                📊 Creating Slide...
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
                                <Presentation size={16} style={{ color: '#f97316' }} />
                                Presentation Slide
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
                                alt="Presentation Slide"
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
                        background: '#f9731610',
                        border: '1px solid #f9731630',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#f97316'
                    }}>
                        📊 <strong>Slide Ready!</strong> - Use as inspiration for your PowerPoint or Google Slides
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

export default AIPresentationSlideGenerator
