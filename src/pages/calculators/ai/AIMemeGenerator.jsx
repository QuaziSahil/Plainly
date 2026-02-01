import { useState, useRef } from 'react'
import { Laugh, Loader2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AIMemeGenerator() {
    const [topic, setTopic] = useState('')
    const [memeStyle, setMemeStyle] = useState('classic')
    const [memes, setMemes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(null)
    const resultRef = useRef(null)

    const memeStyles = [
        { value: 'classic', label: 'Classic Internet Memes', description: 'Distracted Boyfriend, Drake, Change My Mind' },
        { value: 'surreal', label: 'Surreal/Absurdist', description: 'Deep fried, abstract humor' },
        { value: 'reaction', label: 'Reaction Memes', description: 'Surprised Pikachu, Blinking Guy' },
        { value: 'wholesome', label: 'Wholesome Memes', description: 'Uplifting, feel-good content' },
        { value: 'relatable', label: 'Relatable Memes', description: 'Everyday struggles, work life' },
        { value: 'tech', label: 'Tech/Programming', description: 'Developer humor, coding jokes' },
        { value: 'motivational', label: 'Motivational Parody', description: 'Sarcastic motivation posters' }
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for meme generation')
            return
        }

        setLoading(true)
        setError('')
        setMemes([])

        const selectedStyle = memeStyles.find(s => s.value === memeStyle)

        const systemPrompt = `You are a viral meme expert and comedy writer who creates hilarious, shareable meme concepts.

Generate meme concepts that are:
- Funny and relatable
- Easy to visualize
- Suitable for popular meme templates
- Shareable on social media

Return ONLY valid JSON array with no explanations.`

        const prompt = `Generate 6 viral meme concepts about: "${topic}"

Style: ${selectedStyle?.label} (${selectedStyle?.description})

For each meme, provide:
{
  "template": "Name of meme template to use",
  "topText": "Text for top of image (or null if not applicable)",
  "bottomText": "Text for bottom of image (or null if not applicable)",
  "panels": ["Panel 1 text", "Panel 2 text"] (for multi-panel memes),
  "description": "Brief description of the visual setup",
  "viralScore": 85,
  "hashtags": ["#meme", "#funny"]
}

Return JSON array of 6 meme concepts.`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.95,
                maxTokens: 2000
            })

            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setMemes(parsed)
                setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to generate memes. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (meme, index) => {
        const text = `🎭 Meme Template: ${meme.template}

${meme.topText ? `TOP: "${meme.topText}"` : ''}
${meme.bottomText ? `BOTTOM: "${meme.bottomText}"` : ''}
${meme.panels?.length > 0 ? meme.panels.map((p, i) => `Panel ${i + 1}: "${p}"`).join('\n') : ''}

📝 ${meme.description}

${meme.hashtags?.join(' ')}`
        await navigator.clipboard.writeText(text)
        setCopied(index)
        setTimeout(() => setCopied(null), 2000)
    }

    const getViralColor = (score) => {
        if (score >= 80) return '#10b981'
        if (score >= 60) return '#f59e0b'
        return '#8b949e'
    }

    const handleReset = () => {
        setTopic('')
        setMemeStyle('classic')
        setMemes([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Meme Generator"
            description="Create viral meme concepts with AI-generated captions"
            category="AI Tools"
            categoryPath="/ai"
            icon={Laugh}
            result={memes.length > 0 ? `${memes.length} Memes` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Topic Input */}
            <div className="input-group">
                <label className="input-label">Topic *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., remote work, Monday mornings, coding bugs..."
                    className="input-field"
                />
            </div>

            {/* Meme Style */}
            <div className="input-group">
                <label className="input-label">Meme Style</label>
                <select value={memeStyle} onChange={(e) => setMemeStyle(e.target.value)}>
                    {memeStyles.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8b949e' }}>
                    {memeStyles.find(s => s.value === memeStyle)?.description}
                </p>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
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
                        Creating Memes...
                    </>
                ) : memes.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Meme Concepts
                    </>
                )}
            </button>

            {/* Results */}
            {memes.length > 0 && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    <div style={{
                        display: 'grid',
                        gap: '16px'
                    }}>
                        {memes.map((meme, index) => (
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
                                        <span style={{ fontSize: '24px' }}>😂</span>
                                        <span style={{ fontWeight: '600', color: '#e6edf3' }}>
                                            {meme.template}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: `${getViralColor(meme.viralScore)}20`,
                                            color: getViralColor(meme.viralScore),
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            🔥 {meme.viralScore}%
                                        </span>
                                        <button
                                            onClick={() => handleCopy(meme, index)}
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
                                    {/* Meme Text */}
                                    <div style={{
                                        background: '#0d1117',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        marginBottom: '12px'
                                    }}>
                                        {meme.topText && (
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                textAlign: 'center',
                                                color: '#e6edf3',
                                                marginBottom: meme.bottomText ? '12px' : 0
                                            }}>
                                                "{meme.topText}"
                                            </div>
                                        )}
                                        {meme.bottomText && (
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                textAlign: 'center',
                                                color: '#e6edf3'
                                            }}>
                                                "{meme.bottomText}"
                                            </div>
                                        )}
                                        {meme.panels?.length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {meme.panels.map((panel, pIndex) => (
                                                    <div key={pIndex} style={{
                                                        padding: '10px',
                                                        background: '#21262d',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        color: '#e6edf3'
                                                    }}>
                                                        <span style={{ color: '#8b949e', marginRight: '8px' }}>
                                                            Panel {pIndex + 1}:
                                                        </span>
                                                        {panel}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        margin: '0 0 12px',
                                        fontSize: '13px',
                                        color: '#8b949e',
                                        lineHeight: '1.5'
                                    }}>
                                        {meme.description}
                                    </p>

                                    {/* Hashtags */}
                                    {meme.hashtags?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {meme.hashtags.map((tag, tIndex) => (
                                                <span key={tIndex} style={{
                                                    padding: '4px 10px',
                                                    background: '#3b82f620',
                                                    color: '#3b82f6',
                                                    borderRadius: '6px',
                                                    fontSize: '12px'
                                                }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Usage Tip */}
                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#f59e0b10',
                        border: '1px solid #f59e0b30',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#f59e0b'
                    }}>
                        💡 <strong>Tip:</strong> Use these concepts with meme generators like imgflip.com or Canva to create the actual images!
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

export default AIMemeGenerator
