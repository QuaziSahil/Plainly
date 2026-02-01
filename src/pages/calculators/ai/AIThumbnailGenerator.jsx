import { useState, useRef } from 'react'
import { Image, Loader2, Copy, Check, RefreshCw, Sparkles, Youtube, Eye } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AIThumbnailGenerator() {
    const [videoTitle, setVideoTitle] = useState('')
    const [platform, setPlatform] = useState('youtube')
    const [style, setStyle] = useState('engaging')
    const [thumbnails, setThumbnails] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(null)
    const resultRef = useRef(null)

    const platforms = [
        { value: 'youtube', label: 'YouTube', icon: '🎬' },
        { value: 'tiktok', label: 'TikTok', icon: '📱' },
        { value: 'instagram', label: 'Instagram Reels', icon: '📸' },
        { value: 'blog', label: 'Blog/Article', icon: '📝' },
        { value: 'podcast', label: 'Podcast', icon: '🎙️' }
    ]

    const styles = [
        { value: 'engaging', label: 'High Engagement', description: 'Faces, emotions, bold colors' },
        { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple, professional' },
        { value: 'dramatic', label: 'Dramatic', description: 'High contrast, intense expressions' },
        { value: 'tutorial', label: 'Tutorial Style', description: 'Before/after, step indicators' },
        { value: 'clickbait', label: 'Click-worthy', description: 'Curiosity gap, shocking elements' },
        { value: 'aesthetic', label: 'Aesthetic', description: 'Pleasing colors, balanced composition' }
    ]

    const handleGenerate = async () => {
        if (!videoTitle.trim()) {
            setError('Please enter a video title or topic')
            return
        }

        setLoading(true)
        setError('')
        setThumbnails([])

        const selectedStyle = styles.find(s => s.value === style)
        const selectedPlatform = platforms.find(p => p.value === platform)

        const systemPrompt = `You are an expert YouTube thumbnail designer and visual content strategist with deep knowledge of what drives clicks.

Generate detailed thumbnail concepts that:
- Maximize click-through rate (CTR)
- Use proven psychological triggers
- Follow platform best practices
- Are easy to create in tools like Canva or Photoshop

Return ONLY valid JSON array.`

        const prompt = `Create 5 high-CTR thumbnail concepts for:

Video/Content: "${videoTitle}"
Platform: ${selectedPlatform?.label}
Style: ${selectedStyle?.label} (${selectedStyle?.description})

For each thumbnail, provide:
{
  "concept": "Brief concept description",
  "layout": "Describe the visual layout (left, center, right elements)",
  "mainSubject": "What should be the main focus",
  "text": "Any text overlay (keep short, 3-5 words max)",
  "textPlacement": "Where to place text",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "colorMood": "e.g., Warm, Cool, High contrast",
  "expression": "Facial expression if person is included",
  "elements": ["Element 1", "Element 2"],
  "ctrTip": "Why this design works psychologically",
  "ctrScore": 85
}

Return JSON array of 5 thumbnail concepts.`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.85,
                maxTokens: 2500
            })

            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setThumbnails(parsed)
                setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to generate thumbnails. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (thumb, index) => {
        const text = `🎨 THUMBNAIL CONCEPT

📌 Concept: ${thumb.concept}

📐 Layout: ${thumb.layout}
🎯 Main Subject: ${thumb.mainSubject}
✍️ Text: "${thumb.text || 'No text'}"
📍 Text Placement: ${thumb.textPlacement || 'N/A'}

🎨 Colors: ${thumb.colors?.join(', ')}
🌈 Color Mood: ${thumb.colorMood}
😀 Expression: ${thumb.expression || 'N/A'}

📦 Elements: ${thumb.elements?.join(', ')}

💡 Why it works: ${thumb.ctrTip}`
        await navigator.clipboard.writeText(text)
        setCopied(index)
        setTimeout(() => setCopied(null), 2000)
    }

    const getCTRColor = (score) => {
        if (score >= 80) return '#10b981'
        if (score >= 60) return '#f59e0b'
        return '#8b949e'
    }

    const handleReset = () => {
        setVideoTitle('')
        setPlatform('youtube')
        setStyle('engaging')
        setThumbnails([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Thumbnail Generator"
            description="Create high-CTR thumbnail concepts for videos and content"
            category="AI Tools"
            categoryPath="/ai"
            icon={Image}
            result={thumbnails.length > 0 ? `${thumbnails.length} Concepts` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Video Title */}
            <div className="input-group">
                <label className="input-label">Video Title or Topic *</label>
                <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g., 10 Python Tips Every Developer Should Know"
                    className="input-field"
                />
            </div>

            {/* Two-column selects */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Platform</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        {platforms.map(p => (
                            <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Style</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        {styles.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    marginTop: '16px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !videoTitle.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !videoTitle.trim() ? '#333' : 'linear-gradient(135deg, #ef4444 0%, #a78bfa 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !videoTitle.trim() ? 'not-allowed' : 'pointer',
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
                        Designing Thumbnails...
                    </>
                ) : thumbnails.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Thumbnail Concepts
                    </>
                )}
            </button>

            {/* Results */}
            {thumbnails.length > 0 && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    <div style={{
                        display: 'grid',
                        gap: '16px'
                    }}>
                        {thumbnails.map((thumb, index) => (
                            <div key={index} style={{
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            width: '28px',
                                            height: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'linear-gradient(135deg, #ef4444 0%, #a78bfa 100%)',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }}>
                                            {index + 1}
                                        </span>
                                        <span style={{
                                            fontWeight: '600',
                                            color: '#e6edf3',
                                            fontSize: '14px'
                                        }}>
                                            {thumb.concept}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '4px 10px',
                                            background: `${getCTRColor(thumb.ctrScore)}20`,
                                            color: getCTRColor(thumb.ctrScore),
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            <Eye size={12} />
                                            CTR: {thumb.ctrScore}%
                                        </span>
                                        <button
                                            onClick={() => handleCopy(thumb, index)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '6px 12px',
                                                background: copied === index ? '#10b981' : '#21262d',
                                                border: '1px solid #30363d',
                                                borderRadius: '6px',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                minHeight: '32px'
                                            }}
                                        >
                                            {copied === index ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '16px' }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '16px',
                                        marginBottom: '16px'
                                    }}>
                                        {/* Layout */}
                                        <div style={{
                                            padding: '12px',
                                            background: '#0d1117',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '6px', fontWeight: '600' }}>
                                                📐 LAYOUT
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#e6edf3' }}>
                                                {thumb.layout}
                                            </div>
                                        </div>

                                        {/* Main Subject */}
                                        <div style={{
                                            padding: '12px',
                                            background: '#0d1117',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '6px', fontWeight: '600' }}>
                                                🎯 MAIN SUBJECT
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#e6edf3' }}>
                                                {thumb.mainSubject}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Overlay */}
                                    {thumb.text && (
                                        <div style={{
                                            padding: '14px',
                                            background: 'linear-gradient(135deg, #ef444420 0%, #a78bfa20 100%)',
                                            border: '1px solid #ef444440',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{
                                                fontSize: '20px',
                                                fontWeight: '800',
                                                color: '#e6edf3',
                                                textTransform: 'uppercase'
                                            }}>
                                                "{thumb.text}"
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#8b949e', marginTop: '6px' }}>
                                                Placement: {thumb.textPlacement}
                                            </div>
                                        </div>
                                    )}

                                    {/* Colors */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '16px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#8b949e' }}>Colors:</span>
                                        {thumb.colors?.map((color, cIndex) => (
                                            <div key={cIndex} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                background: '#21262d',
                                                borderRadius: '6px'
                                            }}>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    background: color,
                                                    borderRadius: '4px',
                                                    border: '1px solid #30363d'
                                                }} />
                                                <span style={{ fontSize: '11px', color: '#8b949e' }}>{color}</span>
                                            </div>
                                        ))}
                                        <span style={{
                                            padding: '4px 10px',
                                            background: '#3b82f620',
                                            color: '#3b82f6',
                                            borderRadius: '6px',
                                            fontSize: '11px'
                                        }}>
                                            {thumb.colorMood}
                                        </span>
                                    </div>

                                    {/* Elements */}
                                    {thumb.elements?.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '6px',
                                            marginBottom: '12px'
                                        }}>
                                            {thumb.elements.map((el, eIndex) => (
                                                <span key={eIndex} style={{
                                                    padding: '4px 10px',
                                                    background: '#21262d',
                                                    border: '1px solid #30363d',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: '#8b949e'
                                                }}>
                                                    {el}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* CTR Tip */}
                                    <div style={{
                                        padding: '12px',
                                        background: '#10b98110',
                                        border: '1px solid #10b98130',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: '#10b981'
                                    }}>
                                        💡 <strong>Why it works:</strong> {thumb.ctrTip}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Usage Tips */}
                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#a78bfa10',
                        border: '1px solid #a78bfa30',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#a78bfa'
                    }}>
                        🎨 <strong>Create with:</strong> Canva, Photoshop, or Figma. Use the color hex codes and layout descriptions for best results!
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

export default AIThumbnailGenerator
