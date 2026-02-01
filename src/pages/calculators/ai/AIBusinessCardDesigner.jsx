import { useState, useRef } from 'react'
import { CreditCard, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIBusinessCardDesigner() {
    const [businessName, setBusinessName] = useState('')
    const [personName, setPersonName] = useState('')
    const [title, setTitle] = useState('')
    const [cardStyle, setCardStyle] = useState('modern')
    const [colorScheme, setColorScheme] = useState('dark')
    const [industry, setIndustry] = useState('technology')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const cardStyles = [
        { value: 'modern', label: 'Modern', prompt: 'modern minimalist business card, clean lines, contemporary' },
        { value: 'classic', label: 'Classic', prompt: 'classic elegant business card, traditional, professional' },
        { value: 'creative', label: 'Creative', prompt: 'creative unique business card, artistic, innovative design' },
        { value: 'luxury', label: 'Luxury', prompt: 'luxury premium business card, gold foil, embossed, high-end' },
        { value: 'tech', label: 'Tech/Digital', prompt: 'tech digital business card, futuristic, modern technology' },
        { value: 'minimal', label: 'Minimal', prompt: 'ultra minimal business card, simple, whitespace, clean' },
        { value: 'gradient', label: 'Gradient', prompt: 'gradient business card, colorful, vibrant, modern' },
        { value: 'geometric', label: 'Geometric', prompt: 'geometric business card, shapes, patterns, abstract' }
    ]

    const colorSchemes = [
        { value: 'dark', label: 'Dark/Black', prompt: 'dark black theme, elegant' },
        { value: 'white', label: 'White/Light', prompt: 'white clean theme, bright' },
        { value: 'blue', label: 'Blue', prompt: 'blue professional theme' },
        { value: 'gold', label: 'Gold/Premium', prompt: 'gold premium theme, luxury' },
        { value: 'gradient', label: 'Gradient', prompt: 'colorful gradient theme' },
        { value: 'nature', label: 'Nature/Green', prompt: 'green natural eco theme' }
    ]

    const industries = [
        { value: 'technology', label: 'Technology' },
        { value: 'finance', label: 'Finance' },
        { value: 'creative', label: 'Creative/Design' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'legal', label: 'Legal' },
        { value: 'realestate', label: 'Real Estate' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'marketing', label: 'Marketing' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = cardStyles.find(s => s.value === cardStyle)
        const selectedColor = colorSchemes.find(c => c.value === colorScheme)
        const selectedIndustry = industries.find(i => i.value === industry)

        const businessText = businessName.trim() ? `for "${businessName}"` : ''
        const personText = personName.trim() ? `for ${personName}` : ''
        const titleText = title.trim() ? `${title}` : ''

        const prompt = `professional business card design ${businessText} ${personText} ${titleText}, ${selectedStyle?.prompt}, ${selectedColor?.prompt}, ${selectedIndustry?.label} industry style, horizontal card layout, print ready, high quality mockup, 3D presentation view with subtle shadow`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 600
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate business card')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            const filename = businessName.trim()
                ? `${businessName.replace(/\s+/g, '-').toLowerCase()}-card-${Date.now()}.png`
                : `business-card-${Date.now()}.png`
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setBusinessName('')
        setPersonName('')
        setTitle('')
        setCardStyle('modern')
        setColorScheme('dark')
        setIndustry('technology')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Business Card Designer"
            description="Create professional business card designs with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={CreditCard}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Business Name */}
            <div className="input-group">
                <label className="input-label">Business/Company Name (Optional)</label>
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., TechFlow Solutions, Acme Corp..."
                    className="input-field"
                />
            </div>

            {/* Person Name */}
            <div className="input-group">
                <label className="input-label">Your Name (Optional)</label>
                <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="e.g., John Smith, Sarah Johnson..."
                    className="input-field"
                />
            </div>

            {/* Title */}
            <div className="input-group">
                <label className="input-label">Job Title (Optional)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., CEO, Marketing Director..."
                    className="input-field"
                />
            </div>

            {/* Industry */}
            <div className="input-group">
                <label className="input-label">Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    {industries.map(i => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                </select>
            </div>

            {/* Card Style */}
            <div className="input-group">
                <label className="input-label">Card Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {cardStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setCardStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: cardStyle === s.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: cardStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: cardStyle === s.value ? '600' : '400',
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
                        Designing Card...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Design
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Business Card
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
                                💼 Designing Your Card...
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
                                <CreditCard size={16} style={{ color: '#a78bfa' }} />
                                Business Card Design
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
                                alt="Business Card"
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
                        💼 <strong>Business Card Ready!</strong> - Use as inspiration for your printed cards
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

export default AIBusinessCardDesigner
