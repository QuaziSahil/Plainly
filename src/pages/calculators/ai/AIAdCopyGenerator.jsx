import { useState, useRef } from 'react'
import { Megaphone, Loader2, Copy, Check, RefreshCw, Target, Sparkles, Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AIAdCopyGenerator() {
    const [product, setProduct] = useState('')
    const [audience, setAudience] = useState('')
    const [platform, setPlatform] = useState('google')
    const [tone, setTone] = useState('professional')
    const [goal, setGoal] = useState('conversions')
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(null)
    const resultRef = useRef(null)

    const platforms = [
        { value: 'google', label: 'Google Ads', headlines: 3, descriptions: 2, chars: { headline: 30, description: 90 } },
        { value: 'facebook', label: 'Facebook/Instagram Ads', headlines: 1, descriptions: 1, chars: { headline: 40, description: 125 } },
        { value: 'linkedin', label: 'LinkedIn Ads', headlines: 1, descriptions: 1, chars: { headline: 70, description: 150 } },
        { value: 'twitter', label: 'Twitter/X Ads', headlines: 1, descriptions: 1, chars: { headline: 0, description: 280 } },
        { value: 'youtube', label: 'YouTube Ads', headlines: 1, descriptions: 1, chars: { headline: 100, description: 150 } },
        { value: 'tiktok', label: 'TikTok Ads', headlines: 1, descriptions: 1, chars: { headline: 0, description: 100 } }
    ]

    const tones = [
        { value: 'professional', label: 'Professional & Trustworthy' },
        { value: 'urgent', label: 'Urgent & FOMO' },
        { value: 'friendly', label: 'Friendly & Casual' },
        { value: 'luxurious', label: 'Luxurious & Premium' },
        { value: 'playful', label: 'Playful & Fun' },
        { value: 'bold', label: 'Bold & Direct' }
    ]

    const goals = [
        { value: 'conversions', label: 'Drive Conversions/Sales' },
        { value: 'leads', label: 'Generate Leads' },
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'traffic', label: 'Website Traffic' },
        { value: 'app', label: 'App Downloads' },
        { value: 'engagement', label: 'Engagement' }
    ]

    const handleGenerate = async () => {
        if (!product.trim()) {
            setError('Please describe your product or service')
            return
        }

        setLoading(true)
        setError('')
        setAds([])

        const platformInfo = platforms.find(p => p.value === platform)

        const systemPrompt = `You are an expert digital advertising copywriter with years of experience creating high-converting ads for ${platformInfo?.label}.

CRITICAL RULES:
- Follow character limits STRICTLY
- Headlines: max ${platformInfo?.chars.headline || 50} characters each
- Descriptions: max ${platformInfo?.chars.description || 100} characters each
- Write compelling, action-oriented copy
- Include power words and emotional triggers
- Return ONLY valid JSON, no explanations`

        const prompt = `Create 5 ${platformInfo?.label} ad variations for:

Product/Service: ${product}
Target Audience: ${audience || 'General audience'}
Campaign Goal: ${goals.find(g => g.value === goal)?.label}
Tone: ${tones.find(t => t.value === tone)?.label}

For each ad, provide:
- headline(s): compelling headline text
- description(s): persuasive body copy
- cta: call-to-action button text

Return this exact JSON structure:
[
  {
    "headline": "Main headline text",
    "headlines": ["Headline 1", "Headline 2", "Headline 3"],
    "description": "Main description with compelling copy",
    "cta": "Shop Now",
    "hook": "The attention-grabbing element",
    "emotion": "urgency/trust/curiosity/desire"
  }
]

IMPORTANT:
- Headlines: max ${platformInfo?.chars.headline || 50} chars
- Descriptions: max ${platformInfo?.chars.description || 100} chars
- Use power words, numbers, and emotional triggers
- Make each variation unique and compelling`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.85,
                maxTokens: 2000
            })

            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setAds(parsed)
                setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to generate ads. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (text, id) => {
        await navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleCopyAd = async (ad, index) => {
        const text = `Headline: ${ad.headline || ad.headlines?.join(' | ')}\n\nDescription: ${ad.description}\n\nCTA: ${ad.cta}`
        await navigator.clipboard.writeText(text)
        setCopied(`ad-${index}`)
        setTimeout(() => setCopied(null), 2000)
    }

    const getEmotionColor = (emotion) => {
        const colors = {
            urgency: '#ef4444',
            trust: '#3b82f6',
            curiosity: '#a78bfa',
            desire: '#f59e0b',
            fear: '#dc2626',
            excitement: '#10b981'
        }
        return colors[emotion?.toLowerCase()] || '#8b949e'
    }

    const handleReset = () => {
        setProduct('')
        setAudience('')
        setPlatform('google')
        setTone('professional')
        setGoal('conversions')
        setAds([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Ad Copy Generator"
            description="Create high-converting ad copy for any platform in seconds"
            category="AI Tools"
            categoryPath="/ai"
            icon={Megaphone}
            result={ads.length > 0 ? `${ads.length} Ad Variations` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Product Input */}
            <div className="input-group">
                <label className="input-label">Product or Service *</label>
                <textarea
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Describe what you're advertising (e.g., Premium fitness app with personalized workouts and AI coaching)"
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
                        minHeight: '80px'
                    }}
                />
            </div>

            {/* Target Audience */}
            <div className="input-group">
                <label className="input-label">Target Audience (optional)</label>
                <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Busy professionals aged 25-45 who want to stay fit"
                    className="input-field"
                />
            </div>

            {/* Platform Selection */}
            <div className="input-group">
                <label className="input-label">Ad Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {platforms.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </select>
            </div>

            {/* Two-column selects */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        {tones.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Campaign Goal</label>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                        {goals.map(g => (
                            <option key={g.value} value={g.value}>{g.label}</option>
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
                disabled={loading || !product.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !product.trim() ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !product.trim() ? 'not-allowed' : 'pointer',
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
                        Crafting Ads...
                    </>
                ) : ads.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More Ads
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Ad Copy
                    </>
                )}
            </button>

            {/* Results */}
            {ads.length > 0 && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    {/* Platform Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '16px'
                    }}>
                        <span style={{
                            padding: '6px 12px',
                            background: '#f59e0b20',
                            border: '1px solid #f59e0b40',
                            borderRadius: '20px',
                            fontSize: '12px',
                            color: '#f59e0b'
                        }}>
                            {platforms.find(p => p.value === platform)?.label}
                        </span>
                        <span style={{
                            padding: '6px 12px',
                            background: '#10b98120',
                            border: '1px solid #10b98140',
                            borderRadius: '20px',
                            fontSize: '12px',
                            color: '#10b981'
                        }}>
                            {ads.length} Variations
                        </span>
                    </div>

                    {/* Ad Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {ads.map((ad, index) => (
                            <div key={index} style={{
                                background: '#1a1a2e',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                overflow: 'hidden'
                            }}>
                                {/* Card Header */}
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
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#f59e0b',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '700'
                                        }}>
                                            {index + 1}
                                        </span>
                                        <span style={{
                                            fontSize: '11px',
                                            padding: '3px 8px',
                                            background: `${getEmotionColor(ad.emotion)}20`,
                                            color: getEmotionColor(ad.emotion),
                                            borderRadius: '4px',
                                            textTransform: 'capitalize'
                                        }}>
                                            {ad.emotion || 'Engaging'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyAd(ad, index)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            background: copied === `ad-${index}` ? '#10b981' : '#21262d',
                                            border: '1px solid #30363d',
                                            borderRadius: '6px',
                                            color: 'white',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            minHeight: '32px'
                                        }}
                                    >
                                        {copied === `ad-${index}` ? <Check size={14} /> : <Copy size={14} />}
                                        {copied === `ad-${index}` ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                {/* Ad Content */}
                                <div style={{ padding: '16px' }}>
                                    {/* Headlines */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{
                                            fontSize: '11px',
                                            color: '#8b949e',
                                            textTransform: 'uppercase',
                                            fontWeight: '600',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            Headline
                                        </label>
                                        {ad.headlines && ad.headlines.length > 0 ? (
                                            ad.headlines.map((h, hIndex) => (
                                                <button
                                                    key={hIndex}
                                                    onClick={() => handleCopy(h, `h-${index}-${hIndex}`)}
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '10px 14px',
                                                        background: '#21262d',
                                                        border: '1px solid #30363d',
                                                        borderRadius: '8px',
                                                        color: '#3b82f6',
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        marginBottom: '8px'
                                                    }}
                                                >
                                                    {h}
                                                    {copied === `h-${index}-${hIndex}` &&
                                                        <Check size={12} style={{ marginLeft: '8px', color: '#10b981' }} />
                                                    }
                                                </button>
                                            ))
                                        ) : (
                                            <button
                                                onClick={() => handleCopy(ad.headline, `h-${index}`)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '10px 14px',
                                                    background: '#21262d',
                                                    border: '1px solid #30363d',
                                                    borderRadius: '8px',
                                                    color: '#3b82f6',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {ad.headline}
                                            </button>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{
                                            fontSize: '11px',
                                            color: '#8b949e',
                                            textTransform: 'uppercase',
                                            fontWeight: '600',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            Description
                                        </label>
                                        <button
                                            onClick={() => handleCopy(ad.description, `d-${index}`)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '12px 14px',
                                                background: '#0d1117',
                                                border: '1px solid #30363d',
                                                borderRadius: '8px',
                                                color: '#e6edf3',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {ad.description}
                                        </button>
                                    </div>

                                    {/* CTA and Hook */}
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleCopy(ad.cta, `cta-${index}`)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Target size={14} />
                                            {ad.cta}
                                        </button>
                                        {ad.hook && (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 12px',
                                                background: '#a78bfa20',
                                                border: '1px solid #a78bfa40',
                                                borderRadius: '8px',
                                                color: '#a78bfa',
                                                fontSize: '12px'
                                            }}>
                                                <Zap size={12} />
                                                {ad.hook}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tips */}
                    <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: '#f59e0b10',
                        border: '1px solid #f59e0b30',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px' }}>
                            🎯 Ad Copy Tips
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#8b949e', lineHeight: '1.6' }}>
                            <li>A/B test 2-3 variations to find the best performer</li>
                            <li>Use numbers and specifics to increase credibility</li>
                            <li>Match your CTA to your campaign goal</li>
                            <li>Create urgency without being pushy</li>
                        </ul>
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

export default AIAdCopyGenerator
