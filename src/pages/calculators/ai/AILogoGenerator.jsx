import { useState, useRef } from 'react'
import { PenTool, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AILogoGenerator() {
    const [brandName, setBrandName] = useState('')
    const [industry, setIndustry] = useState('technology')
    const [logoStyle, setLogoStyle] = useState('modern')
    const [colorScheme, setColorScheme] = useState('blue')
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const industries = [
        { value: 'technology', label: 'Technology' },
        { value: 'finance', label: 'Finance/Banking' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'food', label: 'Food & Restaurant' },
        { value: 'fashion', label: 'Fashion & Beauty' },
        { value: 'sports', label: 'Sports & Fitness' },
        { value: 'music', label: 'Music & Entertainment' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'travel', label: 'Travel & Tourism' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'gaming', label: 'Gaming' }
    ]

    const logoStyles = [
        { value: 'modern', label: 'Modern/Minimal', prompt: 'modern minimalist logo, clean lines, simple geometric shapes' },
        { value: 'vintage', label: 'Vintage/Retro', prompt: 'vintage retro logo, classic design, nostalgic feel' },
        { value: 'playful', label: 'Playful/Fun', prompt: 'playful fun logo, colorful, friendly design' },
        { value: 'elegant', label: 'Elegant/Luxury', prompt: 'elegant luxury logo, sophisticated, premium design' },
        { value: 'bold', label: 'Bold/Strong', prompt: 'bold strong logo, powerful design, impactful' },
        { value: 'tech', label: 'Tech/Digital', prompt: 'tech digital logo, futuristic, innovative design' },
        { value: 'organic', label: 'Organic/Natural', prompt: 'organic natural logo, eco-friendly, nature-inspired' },
        { value: 'geometric', label: 'Geometric', prompt: 'geometric logo, abstract shapes, mathematical precision' }
    ]

    const colorSchemes = [
        { value: 'blue', label: 'Blue', colors: 'blue tones, professional' },
        { value: 'purple', label: 'Purple', colors: 'purple violet tones, creative' },
        { value: 'green', label: 'Green', colors: 'green tones, eco-friendly' },
        { value: 'red', label: 'Red', colors: 'red tones, energetic' },
        { value: 'orange', label: 'Orange', colors: 'orange tones, warm and friendly' },
        { value: 'gold', label: 'Gold/Yellow', colors: 'gold yellow tones, premium' },
        { value: 'black', label: 'Black/White', colors: 'black and white, monochrome' },
        { value: 'gradient', label: 'Gradient', colors: 'colorful gradient, modern' },
        { value: 'multicolor', label: 'Multicolor', colors: 'multiple colors, vibrant' }
    ]

    const handleGenerate = async () => {
        if (!brandName.trim()) {
            setError('Please enter a brand name')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = logoStyles.find(s => s.value === logoStyle)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedIndustry = industries.find(i => i.value === industry)

        const prompt = `professional logo design for "${brandName}", ${selectedIndustry?.label} industry, ${selectedStyle?.prompt}, ${selectedColor?.colors}, vector style, white or transparent background, isolated logo, high quality, brand identity${additionalDetails ? `, ${additionalDetails}` : ''}`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate logo')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `${brandName.replace(/\s+/g, '-').toLowerCase()}-logo-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setBrandName('')
        setIndustry('technology')
        setLogoStyle('modern')
        setColorScheme('blue')
        setAdditionalDetails('')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Logo Generator"
            description="Create custom logo designs for your brand with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={PenTool}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Brand Name */}
            <div className="input-group">
                <label className="input-label">Brand Name *</label>
                <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., TechFlow, GreenLeaf, Luxe..."
                    className="input-field"
                />
            </div>

            {/* Industry Selection */}
            <div className="input-group">
                <label className="input-label">Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    {industries.map(i => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                </select>
            </div>

            {/* Logo Style */}
            <div className="input-group">
                <label className="input-label">Logo Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {logoStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setLogoStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: logoStyle === s.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: logoStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: logoStyle === s.value ? '600' : '400',
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

            {/* Additional Details */}
            <div className="input-group">
                <label className="input-label">Additional Details (Optional)</label>
                <input
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="e.g., include a leaf icon, use round shapes..."
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
                disabled={loading || !brandName.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !brandName.trim()
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !brandName.trim() ? 'not-allowed' : 'pointer',
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
                        Designing Logo...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Logo
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Logo
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
                💡 <strong>Tip:</strong> Generate multiple versions and choose the best one for your brand. Use specific details for better results.
            </div>

            {/* Loading Animation */}
            {loading && (
                <div style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        overflow: 'hidden',
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
                            borderTopColor: '#a78bfa',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                margin: '0 0 8px 0',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#e6edf3'
                            }}>
                                🎨 Designing Your Logo...
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>
                                Creating brand identity for "{brandName}"
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
                                <PenTool size={16} style={{ color: '#a78bfa' }} />
                                {brandName} Logo
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
                            background: '#ffffff',
                            padding: '32px'
                        }}>
                            <img
                                src={imageUrl}
                                alt={`${brandName} Logo`}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    maxHeight: '400px'
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
                        ✨ <strong>Logo Generated!</strong> - Free to use for your brand
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

export default AILogoGenerator
