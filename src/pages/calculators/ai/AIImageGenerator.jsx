import { useState, useRef } from 'react'
import { Image, Loader2, Download, RefreshCw, Sparkles, Copy, Check, Wand2, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'
import { generateImage as generatePollinationsImage, isConfigured } from '../../../services/pollinationsAI'

function AIImageGenerator() {
    const [prompt, setPrompt] = useState('')
    const [enhancedPrompt, setEnhancedPrompt] = useState('')
    const [style, setStyle] = useState('realistic')
    const [aspectRatio, setAspectRatio] = useState('1:1')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [enhancing, setEnhancing] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const resultRef = useRef(null)

    const styles = [
        { value: 'realistic', label: 'Realistic', prompt: 'ultra realistic, photorealistic, 8k, high detail, sharp focus' },
        { value: 'anime', label: 'Anime', prompt: 'anime style, vibrant colors, manga art, studio ghibli' },
        { value: 'digital-art', label: 'Digital Art', prompt: 'digital art, trending on artstation, vibrant, detailed' },
        { value: '3d-render', label: '3D Render', prompt: '3d render, octane render, cinema 4d, blender, realistic lighting' },
        { value: 'oil-painting', label: 'Oil Painting', prompt: 'oil painting, classical, renaissance style, detailed brushwork' },
        { value: 'watercolor', label: 'Watercolor', prompt: 'watercolor painting, soft colors, artistic, flowing' },
        { value: 'pixel-art', label: 'Pixel Art', prompt: 'pixel art, 16-bit, retro game style, detailed' },
        { value: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk style, neon lights, futuristic city, dark atmosphere' },
        { value: 'fantasy', label: 'Fantasy', prompt: 'fantasy art, magical, ethereal, mystical, epic' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist, clean, simple, modern design, elegant' },
        { value: 'comic', label: 'Comic Book', prompt: 'comic book style, bold lines, halftone dots, dynamic' },
        { value: 'vintage', label: 'Vintage', prompt: 'vintage style, retro, 1950s aesthetic, nostalgic' }
    ]

    const aspectRatios = [
        { value: '1:1', label: 'Square (1:1)', width: 1024, height: 1024 },
        { value: '16:9', label: 'Landscape (16:9)', width: 1024, height: 576 },
        { value: '9:16', label: 'Portrait (9:16)', width: 576, height: 1024 },
        { value: '4:3', label: 'Standard (4:3)', width: 1024, height: 768 },
        { value: '3:4', label: 'Portrait (3:4)', width: 768, height: 1024 }
    ]

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt first')
            return
        }

        setEnhancing(true)
        setError('')

        const selectedStyle = styles.find(s => s.value === style)
        const styleName = selectedStyle?.label || 'Realistic'

        const systemPrompt = `You are an expert AI image prompt engineer. Enhance the user's prompt to create better AI-generated images in the ${styleName} style.

Rules:
- The image MUST be in ${styleName} style
- Add style-specific details for ${styleName} (lighting, composition, mood, textures)
- Include quality boosters (8k, high detail, sharp focus)
- Keep the original intent but amplify it for ${styleName} aesthetic
- Return ONLY the enhanced prompt, no explanations
- Keep under 150 words
- Include ${styleName}-specific keywords and descriptors`

        try {
            const enhanced = await askGroq(
                `Enhance this image prompt for ${styleName} style AI generation: "${prompt}"`,
                systemPrompt,
                { temperature: 0.7, maxTokens: 250 }
            )
            const enhancedText = enhanced.trim()
            setEnhancedPrompt(enhancedText)
            // Auto-paste enhanced prompt into the textarea
            setPrompt(enhancedText)
            // Also copy to clipboard
            await navigator.clipboard.writeText(enhancedText)
        } catch (err) {
            console.error(err)
            setError('Failed to enhance prompt')
        } finally {
            setEnhancing(false)
        }
    }

    const handleGenerate = async () => {
        const finalPrompt = enhancedPrompt || prompt
        if (!finalPrompt.trim()) {
            setError('Please enter a prompt')
            return
        }

        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = styles.find(s => s.value === style)
        const selectedRatio = aspectRatios.find(r => r.value === aspectRatio)

        // Build the full prompt with style
        const fullPrompt = `${finalPrompt}, ${selectedStyle?.prompt || ''}, masterpiece, best quality`

        try {
            // Auto-fallback is handled by the service
            const imageDataUrl = await generatePollinationsImage(fullPrompt, {
                width: selectedRatio?.width || 1024,
                height: selectedRatio?.height || 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate image')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            // If it's a URL (not base64), fetch it first
            if (imageUrl.startsWith('http')) {
                const response = await fetch(imageUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `ai-image-${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            } else {
                // Base64 data URL - direct download
                const link = document.createElement('a')
                link.href = imageUrl
                link.download = `ai-image-${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (err) {
            console.error('Download failed:', err)
            // Fallback: open in new tab
            window.open(imageUrl, '_blank')
        }
    }

    const handleCopyPrompt = async () => {
        const finalPrompt = enhancedPrompt || prompt
        await navigator.clipboard.writeText(finalPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setPrompt('')
        setEnhancedPrompt('')
        setStyle('realistic')
        setAspectRatio('1:1')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Image Generator"
            description="Create stunning images from text with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Image}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Prompt Input */}
            <div className="input-group">
                <label className="input-label">Describe Your Image *</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A majestic lion sitting on a throne in a grand palace, golden light streaming through stained glass windows..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#e6edf3',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit'
                    }}
                />
                <button
                    onClick={handleEnhancePrompt}
                    disabled={enhancing || !prompt.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: enhancing || !prompt.trim() ? '#21262d' : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        cursor: enhancing || !prompt.trim() ? 'not-allowed' : 'pointer',
                        marginTop: '8px',
                        minHeight: '36px'
                    }}
                >
                    {enhancing ? (
                        <>
                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            Enhancing...
                        </>
                    ) : (
                        <>
                            <Wand2 size={14} />
                            Enhance Prompt with AI
                        </>
                    )}
                </button>
            </div>

            {/* Enhanced Prompt Display */}
            {enhancedPrompt && (
                <div style={{
                    padding: '12px',
                    background: '#8b5cf610',
                    border: '1px solid #8b5cf640',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600' }}>
                            ✨ Enhanced Prompt
                        </span>
                        <button
                            onClick={handleCopyPrompt}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                background: copied ? '#10b981' : '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '11px',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#e6edf3', lineHeight: '1.5' }}>
                        {enhancedPrompt}
                    </p>
                </div>
            )}

            {/* Style Selection */}
            <div className="input-group">
                <label className="input-label">Art Style</label>
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
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
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

            {/* Aspect Ratio */}
            <div className="input-group">
                <label className="input-label">Aspect Ratio</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {aspectRatios.map(r => (
                        <button
                            key={r.value}
                            onClick={() => setAspectRatio(r.value)}
                            style={{
                                padding: '10px 16px',
                                background: aspectRatio === r.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: aspectRatio === r.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: aspectRatio === r.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {r.label}
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
                disabled={loading || (!prompt.trim() && !enhancedPrompt)}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || (!prompt.trim() && !enhancedPrompt)
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || (!prompt.trim() && !enhancedPrompt) ? 'not-allowed' : 'pointer',
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
                        Generating with Plainly AI...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Image
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Image
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
                💡 <strong>Tip:</strong> First generation may take 20-30 seconds while the model loads. Subsequent generations are faster.
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
                        {/* Animated loader */}
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
                                color: '#e6edf3',
                                animation: 'pulse 2s ease-in-out infinite'
                            }}>
                                ✨ Generating with Plainly AI
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                color: '#8b949e'
                            }}>
                                Creating your masterpiece... This may take 10-30 seconds
                            </p>
                        </div>

                        {/* Progress bar animation */}
                        <div style={{
                            width: '200px',
                            height: '4px',
                            background: '#21262d',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '40%',
                                height: '100%',
                                background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s ease-in-out infinite'
                            }} />
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
                        {/* Header */}
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
                                <Image size={16} style={{ color: '#a78bfa' }} />
                                Generated Image
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

                        {/* Image */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0a0a0a',
                            padding: '16px'
                        }}>
                            <img
                                src={imageUrl}
                                alt="AI Generated"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Success Info */}
                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#10b98110',
                        border: '1px solid #10b98130',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#10b981'
                    }}>
                        🎨 <strong>Generated with Plainly AI</strong> - Free & Unlimited
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(350%); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AIImageGenerator
