import { useState, useRef } from 'react'
import { Video, Loader2, Download, RefreshCw, Sparkles, AlertCircle, Play } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

function AIVideoGenerator() {
    const [prompt, setPrompt] = useState('')
    const [enhancedPrompt, setEnhancedPrompt] = useState('')
    const [model, setModel] = useState('wan')
    const [aspectRatio, setAspectRatio] = useState('16:9')
    const [videoUrl, setVideoUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [enhancing, setEnhancing] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const videoModels = [
        { value: 'wan', label: 'Wan 2.6', desc: 'Best quality, recommended' },
        { value: 'seedance', label: 'Seedance Lite', desc: 'Fast generation' },
        { value: 'seedance-pro', label: 'Seedance Pro', desc: 'High quality' }
    ]

    const aspectRatios = [
        { value: '16:9', label: 'Landscape (16:9)' },
        { value: '9:16', label: 'Portrait (9:16)' },
        { value: '1:1', label: 'Square (1:1)' }
    ]

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt first')
            return
        }

        setEnhancing(true)
        setError('')

        const systemPrompt = `You are an expert AI video prompt engineer. Enhance the user's prompt to create better AI-generated videos.

Rules:
- Add motion and action descriptions
- Describe camera movements (pan, zoom, tracking shot)
- Include lighting and atmosphere details
- Specify temporal flow (what happens during the video)
- Return ONLY the enhanced prompt, no explanations
- Keep under 100 words`

        try {
            const enhanced = await askGroq(
                `Enhance this video generation prompt: "${prompt}"`,
                systemPrompt,
                { temperature: 0.7, maxTokens: 200 }
            )
            const enhancedText = enhanced.trim()
            setEnhancedPrompt(enhancedText)
            setPrompt(enhancedText)
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

        setLoading(true)
        setError('')
        setVideoUrl('')

        try {
            // Build video URL using gen.pollinations.ai
            const encodedPrompt = encodeURIComponent(finalPrompt)
            let url = `https://gen.pollinations.ai/video/${encodedPrompt}?model=${model}`

            // Add API key if available
            if (POLLINATIONS_API_KEY) {
                url += `&key=${POLLINATIONS_API_KEY}`
            }

            // Fetch the video with Authorization header
            const response = await fetch(url, {
                method: 'GET',
                headers: POLLINATIONS_API_KEY ? {
                    'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
                } : {}
            })

            if (!response.ok) {
                throw new Error(`Video generation failed: ${response.status}`)
            }

            // Convert to blob and create URL
            const blob = await response.blob()
            const videoObjectUrl = URL.createObjectURL(blob)
            setVideoUrl(videoObjectUrl)

            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate video. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!videoUrl) return

        try {
            const response = await fetch(videoUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `ai-video-${Date.now()}.mp4`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(videoUrl, '_blank')
        }
    }

    const handleReset = () => {
        setPrompt('')
        setEnhancedPrompt('')
        setModel('wan')
        setAspectRatio('16:9')
        setVideoUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Video Generator"
            description="Create stunning videos from text with AI - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Video}
            result={loading ? 'Generating...' : videoUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Prompt Input */}
            <div className="input-group">
                <label className="input-label">Describe Your Video *</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic eagle soaring through clouds at sunset, slow motion cinematic shot..."
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        background: '#21262d',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#e6edf3',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            </div>

            {/* Enhance Button */}
            <button
                onClick={handleEnhancePrompt}
                disabled={enhancing || !prompt.trim()}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: enhancing || !prompt.trim() ? '#333' : '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: enhancing || !prompt.trim() ? '#666' : '#a78bfa',
                    cursor: enhancing || !prompt.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '48px'
                }}
            >
                {enhancing ? (
                    <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Enhancing...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Enhance Prompt with AI
                    </>
                )}
            </button>

            {/* Video Model Selector */}
            <div className="input-group">
                <label className="input-label">AI Model</label>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#21262d',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#e6edf3',
                        fontSize: '14px',
                        cursor: 'pointer',
                        minHeight: '48px'
                    }}
                >
                    {videoModels.map(m => (
                        <option key={m.value} value={m.value}>
                            {m.label} - {m.desc}
                        </option>
                    ))}
                </select>
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
                                    ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
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
                ) : videoUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Video
                    </>
                ) : (
                    <>
                        <Video size={20} />
                        Generate Video
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
                💡 <strong>Tip:</strong> Video generation may take 1-3 minutes. Be patient for best results!
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
                            borderTopColor: '#ec4899',
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
                                🎬 Generating with Plainly AI
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                color: '#8b949e'
                            }}>
                                Creating your video... This may take 1-3 minutes
                            </p>
                        </div>

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
                                background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s ease-in-out infinite'
                            }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Result */}
            {videoUrl && !loading && (
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
                            borderBottom: '1px solid #333'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Play size={16} style={{ color: '#ec4899' }} />
                                <span style={{ fontSize: '14px', color: '#e6edf3' }}>Generated Video</span>
                            </div>
                            <button
                                onClick={handleDownload}
                                style={{
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: '500'
                                }}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>

                        {/* Video */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0a0a0a',
                            padding: '16px'
                        }}>
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px'
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
                        🎬 <strong>Generated with Plainly AI</strong> - Free & Unlimited
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

export default AIVideoGenerator
