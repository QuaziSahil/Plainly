import { useState, useRef } from 'react'
import { Shapes, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIIconGenerator() {
    const [iconDescription, setIconDescription] = useState('')
    const [iconStyle, setIconStyle] = useState('flat')
    const [colorScheme, setColorScheme] = useState('colorful')
    const [background, setBackground] = useState('transparent')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const iconStyles = [
        { value: 'flat', label: 'Flat', prompt: 'flat design icon, 2D, simple, clean' },
        { value: '3d', label: '3D', prompt: '3D icon, glossy, modern, dimensional' },
        { value: 'outline', label: 'Outline', prompt: 'outline icon, line art, stroke only' },
        { value: 'filled', label: 'Filled', prompt: 'filled solid icon, bold, simple' },
        { value: 'glassmorphism', label: 'Glass', prompt: 'glassmorphism icon, frosted glass, translucent' },
        { value: 'gradient', label: 'Gradient', prompt: 'gradient icon, colorful gradient, modern' },
        { value: 'isometric', label: 'Isometric', prompt: 'isometric icon, 3D perspective, geometric' },
        { value: 'pixel', label: 'Pixel Art', prompt: 'pixel art icon, retro, 8-bit style' }
    ]

    const colorSchemes = [
        { value: 'colorful', label: 'Colorful', prompt: 'vibrant colorful, multiple colors' },
        { value: 'monochrome', label: 'Monochrome', prompt: 'monochrome, single color, elegant' },
        { value: 'blue', label: 'Blue', prompt: 'blue themed, professional' },
        { value: 'purple', label: 'Purple', prompt: 'purple themed, creative' },
        { value: 'green', label: 'Green', prompt: 'green themed, nature, eco' },
        { value: 'orange', label: 'Orange', prompt: 'orange themed, energetic' },
        { value: 'pastel', label: 'Pastel', prompt: 'soft pastel colors, gentle' },
        { value: 'neon', label: 'Neon', prompt: 'neon bright colors, glowing' }
    ]

    const backgrounds = [
        { value: 'transparent', label: 'Transparent', prompt: 'transparent background, isolated icon' },
        { value: 'white', label: 'White', prompt: 'white clean background' },
        { value: 'dark', label: 'Dark', prompt: 'dark background, contrast' },
        { value: 'gradient', label: 'Gradient', prompt: 'gradient background, modern' },
        { value: 'circle', label: 'Circle', prompt: 'circular background, badge style' },
        { value: 'square', label: 'Rounded Square', prompt: 'rounded square background, app icon style' }
    ]

    const handleGenerate = async () => {
        if (!iconDescription.trim()) {
            setError('Please describe the icon you want')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = iconStyles.find(s => s.value === iconStyle)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedBg = backgrounds.find(b => b.value === background)

        const prompt = `icon design of ${iconDescription}, ${selectedStyle?.prompt}, ${selectedColor?.prompt}, ${selectedBg?.prompt}, centered, high quality, professional app icon, UI design, vector style, clean design, single icon`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 512,
                height: 512
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate icon')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `icon-${iconDescription.replace(/\s+/g, '-').toLowerCase().slice(0, 20)}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setIconDescription('')
        setIconStyle('flat')
        setColorScheme('colorful')
        setBackground('transparent')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Icon Generator"
            description="Create custom icons for apps, websites, and designs with AI"
            category="AI Tools"
            categoryPath="/ai"
            icon={Shapes}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Icon Description */}
            <div className="input-group">
                <label className="input-label">Icon Description *</label>
                <input
                    type="text"
                    value={iconDescription}
                    onChange={(e) => setIconDescription(e.target.value)}
                    placeholder="e.g., shopping cart, rocket, settings gear, music note..."
                    className="input-field"
                />
            </div>

            {/* Icon Style */}
            <div className="input-group">
                <label className="input-label">Icon Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {iconStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setIconStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: iconStyle === s.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: iconStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: iconStyle === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
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

            {/* Background */}
            <div className="input-group">
                <label className="input-label">Background</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {backgrounds.map(b => (
                        <button
                            key={b.value}
                            onClick={() => setBackground(b.value)}
                            style={{
                                padding: '10px 8px',
                                background: background === b.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: background === b.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: background === b.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {b.label}
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
                disabled={loading || !iconDescription.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !iconDescription.trim()
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !iconDescription.trim() ? 'not-allowed' : 'pointer',
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
                        Creating Icon...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Icon
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Icon
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
                            borderTopColor: '#8b5cf6',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                🎨 Creating Icon...
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
                                <Shapes size={16} style={{ color: '#a78bfa' }} />
                                Generated Icon
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
                            background: background === 'dark' ? '#1a1a1a' : '#f5f5f5',
                            padding: '32px',
                            minHeight: '200px'
                        }}>
                            <img
                                src={imageUrl}
                                alt="Generated Icon"
                                style={{
                                    maxWidth: '200px',
                                    height: 'auto',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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
                        🎨 <strong>Icon Ready!</strong> - Perfect for apps, websites, and UI designs
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

export default AIIconGenerator
