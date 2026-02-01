import { useState, useRef } from 'react'
import { QrCode, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIQRArtGenerator() {
    const [content, setContent] = useState('')
    const [qrLink, setQrLink] = useState('')
    const [artStyle, setArtStyle] = useState('artistic')
    const [theme, setTheme] = useState('cyberpunk')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const artStyles = [
        { value: 'artistic', label: 'Artistic', prompt: 'artistic QR code, creative design, beautiful' },
        { value: 'futuristic', label: 'Futuristic', prompt: 'futuristic QR code, sci-fi, tech, neon' },
        { value: 'nature', label: 'Nature', prompt: 'nature themed QR code, organic, plants, leaves' },
        { value: 'geometric', label: 'Geometric', prompt: 'geometric QR code, abstract shapes, patterns' },
        { value: 'vintage', label: 'Vintage', prompt: 'vintage retro QR code, classic, nostalgic' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist QR code, clean, simple, elegant' },
        { value: 'graffiti', label: 'Graffiti', prompt: 'graffiti street art QR code, urban, bold' },
        { value: 'watercolor', label: 'Watercolor', prompt: 'watercolor QR code, painted, soft colors' }
    ]

    const themes = [
        { value: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk theme, neon colors, futuristic city' },
        { value: 'space', label: 'Space', prompt: 'space galaxy theme, stars, cosmic, nebula' },
        { value: 'ocean', label: 'Ocean', prompt: 'ocean underwater theme, waves, sea creatures' },
        { value: 'forest', label: 'Forest', prompt: 'forest nature theme, trees, green, woodland' },
        { value: 'fire', label: 'Fire', prompt: 'fire theme, flames, warm colors, energy' },
        { value: 'ice', label: 'Ice/Winter', prompt: 'ice winter theme, frozen, blue, cold' },
        { value: 'floral', label: 'Floral', prompt: 'floral theme, flowers, botanical, garden' },
        { value: 'dark', label: 'Dark/Gothic', prompt: 'dark gothic theme, mysterious, dramatic' },
        { value: 'rainbow', label: 'Rainbow', prompt: 'rainbow colorful theme, vibrant, pride' },
        { value: 'gold', label: 'Gold/Luxury', prompt: 'gold luxury theme, premium, elegant, metallic' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = artStyles.find(s => s.value === artStyle)
        const selectedTheme = themes.find(t => t.value === theme)

        const contentText = content.trim() ? `incorporating "${content}" theme` : ''
        const qrContentText = qrLink.trim() ? `designed to visually represent the data "${qrLink}"` : 'scannable QR code pattern'

        const prompt = `artistic QR code design ${contentText}, ${qrContentText}, ${selectedStyle?.prompt}, ${selectedTheme?.prompt}, integrated with art, creative design, high quality, detailed, visually stunning, the QR pattern should be visible but artistic`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate QR Art')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `qr-art-${artStyle}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setContent('')
        setQrLink('')
        setArtStyle('artistic')
        setTheme('cyberpunk')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI QR Art Generator"
            description="Create artistic QR code designs with AI - Unique visual QR patterns"
            category="AI Tools"
            categoryPath="/ai"
            icon={QrCode}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Content/Theme Description */}
            <div className="input-group">
                <label className="input-label">Content/Brand Theme (Optional)</label>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g., music, technology, nature, my brand name..."
                    className="input-field"
                />
            </div>

            {/* QR Link/Text */}
            <div className="input-group">
                <label className="input-label">QR Link/Text (Optional)</label>
                <input
                    type="text"
                    value={qrLink}
                    onChange={(e) => setQrLink(e.target.value)}
                    placeholder="e.g., https://plainly.live or My Secret Message"
                    className="input-field"
                />
            </div>

            {/* Art Style */}
            <div className="input-group">
                <label className="input-label">Art Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {artStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setArtStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: artStyle === s.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: artStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: artStyle === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme */}
            <div className="input-group">
                <label className="input-label">Visual Theme</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {themes.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setTheme(t.value)}
                            style={{
                                padding: '10px 8px',
                                background: theme === t.value
                                    ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                                    : '#21262d',
                                border: theme === t.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: theme === t.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {t.label}
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
                        Creating QR Art...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New QR Art
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate QR Art
                    </>
                )}
            </button>

            {/* Info */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#f9731610',
                border: '1px solid #f9731630',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f97316'
            }}>
                ⚠️ <strong>Note:</strong> These are artistic interpretations of QR patterns. They are decorative and may not be scannable. Use for visual design purposes.
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
                                🎨 Creating QR Art...
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
                                <QrCode size={16} style={{ color: '#a78bfa' }} />
                                Artistic QR Code
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
                                alt="QR Art"
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
                        background: '#8b5cf610',
                        border: '1px solid #8b5cf630',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#a78bfa'
                    }}>
                        ✨ <strong>QR Art Ready!</strong> - Unique decorative QR-style artwork
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

export default AIQRArtGenerator
