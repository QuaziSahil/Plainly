import { useState, useRef } from 'react'
import { Smile, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AICartoonAvatarGenerator() {
    const [description, setDescription] = useState('')
    const [cartoonStyle, setCartoonStyle] = useState('anime')
    const [mood, setMood] = useState('happy')
    const [background, setBackground] = useState('simple')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const cartoonStyles = [
        { value: 'anime', label: 'Anime', prompt: 'anime style, vibrant colors, detailed eyes, manga art' },
        { value: 'pixar', label: 'Pixar 3D', prompt: 'pixar 3d style, cute character, disney animation style' },
        { value: 'chibi', label: 'Chibi', prompt: 'chibi style, cute, big head, small body, kawaii' },
        { value: 'comic', label: 'Comic Book', prompt: 'comic book style, bold outlines, superhero art' },
        { value: 'watercolor', label: 'Watercolor', prompt: 'watercolor cartoon, soft colors, artistic' },
        { value: 'flat', label: 'Flat Design', prompt: 'flat design illustration, minimal, vector art' },
        { value: 'vintage', label: 'Vintage Cartoon', prompt: 'vintage cartoon style, retro animation, classic' },
        { value: 'cute', label: 'Cute/Kawaii', prompt: 'cute kawaii style, adorable, pastel colors' }
    ]

    const moods = [
        { value: 'happy', label: 'Happy 😊', prompt: 'smiling, joyful expression' },
        { value: 'cool', label: 'Cool 😎', prompt: 'confident, cool expression' },
        { value: 'excited', label: 'Excited 🤩', prompt: 'excited, enthusiastic expression' },
        { value: 'thoughtful', label: 'Thoughtful 🤔', prompt: 'thoughtful, contemplative expression' },
        { value: 'playful', label: 'Playful 😜', prompt: 'playful, fun expression' },
        { value: 'determined', label: 'Determined 💪', prompt: 'determined, focused expression' }
    ]

    const backgrounds = [
        { value: 'simple', label: 'Simple/Solid', prompt: 'simple solid color background' },
        { value: 'gradient', label: 'Gradient', prompt: 'colorful gradient background' },
        { value: 'pattern', label: 'Pattern', prompt: 'decorative pattern background' },
        { value: 'scene', label: 'Scene', prompt: 'scenic background environment' },
        { value: 'transparent', label: 'Minimal', prompt: 'minimal clean background' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe your avatar')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = cartoonStyles.find(s => s.value === cartoonStyle)
        const selectedMood = moods.find(m => m.value === mood)
        const selectedBg = backgrounds.find(b => b.value === background)

        const prompt = `cartoon avatar of ${description}, ${selectedStyle?.prompt}, ${selectedMood?.prompt}, ${selectedBg?.prompt}, high quality character design, centered portrait, vibrant colors`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate avatar')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `cartoon-avatar-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setDescription('')
        setCartoonStyle('anime')
        setMood('happy')
        setBackground('simple')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Cartoon Avatar Generator"
            description="Create unique cartoon avatars for profiles, social media, and games"
            category="AI Tools"
            categoryPath="/ai"
            icon={Smile}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">Describe Your Avatar *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., a young woman with blue hair and green eyes, a bearded man with glasses, a cool robot character..."
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#e6edf3',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '60px',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Cartoon Style */}
            <div className="input-group">
                <label className="input-label">Art Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {cartoonStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setCartoonStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: cartoonStyle === s.value
                                    ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                                    : '#21262d',
                                border: cartoonStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: cartoonStyle === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mood Selection */}
            <div className="input-group">
                <label className="input-label">Mood/Expression</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: '8px'
                }}>
                    {moods.map(m => (
                        <button
                            key={m.value}
                            onClick={() => setMood(m.value)}
                            style={{
                                padding: '10px 8px',
                                background: mood === m.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: mood === m.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: mood === m.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Selection */}
            <div className="input-group">
                <label className="input-label">Background</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {backgrounds.map(b => (
                        <button
                            key={b.value}
                            onClick={() => setBackground(b.value)}
                            style={{
                                padding: '10px 16px',
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
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim()
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
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
                        Creating Avatar...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Avatar
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Avatar
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
                            borderTopColor: '#ec4899',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                🎨 Drawing Your Avatar...
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
                                <Smile size={16} style={{ color: '#ec4899' }} />
                                Your Cartoon Avatar
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
                                alt="Cartoon Avatar"
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
                        background: '#ec489910',
                        border: '1px solid #ec489930',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#ec4899'
                    }}>
                        🎭 <strong>Avatar Created!</strong> - Perfect for social media and gaming profiles
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

export default AICartoonAvatarGenerator
