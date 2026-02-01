import { useState, useRef } from 'react'
import { Package, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIMockupGenerator() {
    const [productType, setProductType] = useState('phone')
    const [description, setDescription] = useState('')
    const [background, setBackground] = useState('minimal')
    const [angle, setAngle] = useState('front')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const productTypes = [
        { value: 'phone', label: 'Smartphone', prompt: 'smartphone mockup, iPhone, mobile device' },
        { value: 'laptop', label: 'Laptop', prompt: 'laptop mockup, MacBook, computer screen' },
        { value: 'tablet', label: 'Tablet', prompt: 'tablet mockup, iPad, screen device' },
        { value: 'tshirt', label: 'T-Shirt', prompt: 't-shirt mockup, clothing, apparel' },
        { value: 'mug', label: 'Mug/Cup', prompt: 'coffee mug mockup, cup, beverage container' },
        { value: 'book', label: 'Book', prompt: 'book cover mockup, hardcover, publication' },
        { value: 'poster', label: 'Poster/Frame', prompt: 'poster frame mockup, wall art, print' },
        { value: 'box', label: 'Product Box', prompt: 'product packaging box mockup, container' },
        { value: 'card', label: 'Business Card', prompt: 'business card mockup, stationery' },
        { value: 'bottle', label: 'Bottle', prompt: 'bottle mockup, container, beverage' }
    ]

    const backgrounds = [
        { value: 'minimal', label: 'Minimal', prompt: 'minimal clean background, simple, white' },
        { value: 'studio', label: 'Studio', prompt: 'studio lighting, professional photography' },
        { value: 'lifestyle', label: 'Lifestyle', prompt: 'lifestyle scene, natural environment' },
        { value: 'office', label: 'Office', prompt: 'office desk scene, workspace' },
        { value: 'nature', label: 'Nature', prompt: 'natural outdoor background, plants' },
        { value: 'dark', label: 'Dark', prompt: 'dark moody background, dramatic lighting' },
        { value: 'gradient', label: 'Gradient', prompt: 'colorful gradient background, modern' },
        { value: 'abstract', label: 'Abstract', prompt: 'abstract artistic background, creative' }
    ]

    const angles = [
        { value: 'front', label: 'Front View', prompt: 'front view, straight on' },
        { value: 'angle', label: 'Angled', prompt: 'angled perspective, 3/4 view' },
        { value: 'floating', label: 'Floating', prompt: 'floating in air, levitating, dynamic' },
        { value: 'flat', label: 'Flat Lay', prompt: 'flat lay, top down view' },
        { value: 'hand', label: 'In Hand', prompt: 'held in hand, person holding' },
        { value: 'multiple', label: 'Multiple', prompt: 'multiple angles, various views' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedProduct = productTypes.find(p => p.value === productType)
        const selectedBg = backgrounds.find(b => b.value === background)
        const selectedAngle = angles.find(a => a.value === angle)

        const descText = description.trim() ? `featuring "${description}"` : ''

        const prompt = `professional product mockup, ${selectedProduct?.prompt} ${descText}, ${selectedBg?.prompt}, ${selectedAngle?.prompt}, high quality 3D render, photorealistic, commercial photography style, advertising quality, product showcase`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate mockup')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `mockup-${productType}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setProductType('phone')
        setDescription('')
        setBackground('minimal')
        setAngle('front')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Mockup Generator"
            description="Create professional product mockups with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Package}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Product Type */}
            <div className="input-group">
                <label className="input-label">Product Type</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {productTypes.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setProductType(p.value)}
                            style={{
                                padding: '10px 8px',
                                background: productType === p.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: productType === p.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: productType === p.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="input-group">
                <label className="input-label">Design/Content Description (Optional)</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., a fitness app, nature photography, coffee brand..."
                    className="input-field"
                />
            </div>

            {/* Background */}
            <div className="input-group">
                <label className="input-label">Background Style</label>
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
                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
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

            {/* Angle */}
            <div className="input-group">
                <label className="input-label">View Angle</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {angles.map(a => (
                        <button
                            key={a.value}
                            onClick={() => setAngle(a.value)}
                            style={{
                                padding: '10px 8px',
                                background: angle === a.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: angle === a.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: angle === a.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {a.label}
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
                        Creating Mockup...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Mockup
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Mockup
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
                                📦 Creating Mockup...
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
                                <Package size={16} style={{ color: '#a78bfa' }} />
                                Product Mockup
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
                                alt="Product Mockup"
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
                        📦 <strong>Mockup Ready!</strong> - Perfect for portfolios, presentations, and e-commerce
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

export default AIMockupGenerator
