import { useState, useRef } from 'react'
import { Smartphone, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIInstagramStoryTemplate() {
    const [theme, setTheme] = useState('')
    const [templateType, setTemplateType] = useState('promotional')
    const [colorScheme, setColorScheme] = useState('vibrant')
    const [style, setStyle] = useState('modern')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const templateTypes = [
        { value: 'promotional', label: 'Promotional', prompt: 'promotional marketing story, sale, offer, announcement' },
        { value: 'quote', label: 'Quote/Text', prompt: 'inspirational quote story, motivational, text overlay' },
        { value: 'product', label: 'Product', prompt: 'product showcase story, e-commerce, brand' },
        { value: 'event', label: 'Event', prompt: 'event announcement story, celebration, party' },
        { value: 'lifestyle', label: 'Lifestyle', prompt: 'lifestyle aesthetic story, mood, vibe' },
        { value: 'food', label: 'Food', prompt: 'food recipe story, culinary, delicious' },
        { value: 'travel', label: 'Travel', prompt: 'travel adventure story, destination, explore' },
        { value: 'fitness', label: 'Fitness', prompt: 'fitness workout story, health, gym, motivation' },
        { value: 'beauty', label: 'Beauty', prompt: 'beauty skincare story, makeup, cosmetics' },
        { value: 'music', label: 'Music', prompt: 'music playlist story, album, artist, song' }
    ]

    const colorSchemes = [
        { value: 'vibrant', label: 'Vibrant', prompt: 'vibrant bright colors, eye-catching' },
        { value: 'pastel', label: 'Pastel', prompt: 'soft pastel colors, dreamy' },
        { value: 'neon', label: 'Neon', prompt: 'neon glowing colors, futuristic' },
        { value: 'minimal', label: 'Minimal', prompt: 'minimal clean colors, simple' },
        { value: 'dark', label: 'Dark Mode', prompt: 'dark moody colors, elegant' },
        { value: 'gradient', label: 'Gradient', prompt: 'colorful gradient, smooth transitions' },
        { value: 'earthy', label: 'Earthy', prompt: 'earth tones, natural, warm' },
        { value: 'bold', label: 'Bold', prompt: 'bold contrasting colors, striking' }
    ]

    const styles = [
        { value: 'modern', label: 'Modern', prompt: 'modern trendy design, 2024 style' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist clean design, whitespace' },
        { value: 'playful', label: 'Playful', prompt: 'playful fun design, creative' },
        { value: 'elegant', label: 'Elegant', prompt: 'elegant sophisticated design, luxury' },
        { value: 'retro', label: 'Retro', prompt: 'retro vintage design, nostalgic' },
        { value: 'artistic', label: 'Artistic', prompt: 'artistic creative design, unique' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedType = templateTypes.find(t => t.value === templateType)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedStyle = styles.find(s => s.value === style)

        const themeText = theme.trim() ? `about ${theme}` : ''

        const prompt = `Instagram story template design ${themeText}, ${selectedType?.prompt}, ${selectedColor?.prompt}, ${selectedStyle?.prompt}, vertical format 9:16 aspect ratio, social media template, professional graphic design, high quality, engaging visual content, mobile optimized`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 540,
                height: 960
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate story template')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `instagram-story-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setTheme('')
        setTemplateType('promotional')
        setColorScheme('vibrant')
        setStyle('modern')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Instagram Story Template"
            description="Create stunning Instagram story templates with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Smartphone}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Theme/Topic */}
            <div className="input-group">
                <label className="input-label">Theme/Topic (Optional)</label>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., summer sale, new product launch, wellness tips..."
                    className="input-field"
                />
            </div>

            {/* Template Type */}
            <div className="input-group">
                <label className="input-label">Template Type</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {templateTypes.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setTemplateType(t.value)}
                            style={{
                                padding: '10px 8px',
                                background: templateType === t.value
                                    ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                                    : '#21262d',
                                border: templateType === t.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: templateType === t.value ? '600' : '400',
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
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
                        Creating Story Template...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Template
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Story Template
                    </>
                )}
            </button>

            {/* Info */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#ec489910',
                border: '1px solid #ec489930',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#ec4899'
            }}>
                📱 <strong>Tip:</strong> Templates are generated in 9:16 vertical format perfect for Instagram Stories.
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
                            borderTopColor: '#ec4899',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                📱 Creating Story Template...
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
                                <Smartphone size={16} style={{ color: '#ec4899' }} />
                                Story Template
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
                                alt="Instagram Story Template"
                                style={{
                                    maxWidth: '280px',
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#ec489910',
                        border: '1px solid #ec489930',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#ec4899'
                    }}>
                        📱 <strong>Story Template Ready!</strong> - Add your text and share on Instagram
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

export default AIInstagramStoryTemplate
