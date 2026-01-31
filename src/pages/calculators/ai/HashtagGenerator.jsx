import { useState } from 'react'
import { Hash, Loader2, Copy, Check, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq, MODELS } from '../../../services/groqAI'

function HashtagGenerator() {
    const [topic, setTopic] = useState('')
    const [platform, setPlatform] = useState('instagram')
    const [count, setCount] = useState('15')
    const [hashtags, setHashtags] = useState([])
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')
        setHashtags([])

        const prompt = `Generate ${count} relevant hashtags for ${platform} about: "${topic}"

Requirements:
- Mix of popular and niche hashtags
- No spaces in hashtags
- Include a mix of broad and specific tags
- Optimized for ${platform} engagement

Return ONLY a JSON array of strings, no other text:
["#hashtag1", "#hashtag2", ...]`

        try {
            const response = await askGroq(prompt, 'You are a social media expert. Return valid JSON only.', {
                model: MODELS.randomNames,
                temperature: 0.8,
                maxTokens: 300
            })

            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setHashtags(parsed)
            } else {
                throw new Error('Invalid response')
            }
        } catch (err) {
            setError('Failed to generate hashtags. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopyAll = async () => {
        await navigator.clipboard.writeText(hashtags.join(' '))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setTopic('')
        setPlatform('instagram')
        setCount('15')
        setHashtags([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Hashtag Generator"
            description="Generate trending hashtags for social media"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Hash}
            result={hashtags.length > 0 ? `${hashtags.length} tags` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Topic Input */}
            <div className="input-group">
                <label className="input-label">Topic / Content Description *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., sunset beach photography, vegan recipes, fitness motivation..."
                />
            </div>

            {/* Platform & Count */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Platform</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="tiktok">TikTok</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Number of Tags</label>
                    <select value={count} onChange={(e) => setCount(e.target.value)}>
                        <option value="10">10 hashtags</option>
                        <option value="15">15 hashtags</option>
                        <option value="20">20 hashtags</option>
                        <option value="30">30 hashtags</option>
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
                    marginBottom: '16px',
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
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
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
                    marginBottom: '20px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Hashtags
                    </>
                )}
            </button>

            {/* Results */}
            {hashtags.length > 0 && (
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #ec489940',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #333',
                        background: '#0a0a0a'
                    }}>
                        <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: 600 }}>
                            # {hashtags.length} Hashtags for {platform}
                        </span>
                        <button
                            onClick={handleCopyAll}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#ec4899' : '#333',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy All'}
                        </button>
                    </div>
                    <div style={{
                        padding: '16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {hashtags.map((tag, i) => (
                            <span key={i} style={{
                                padding: '6px 12px',
                                background: '#ec489920',
                                border: '1px solid #ec489940',
                                borderRadius: '20px',
                                fontSize: '13px',
                                color: '#ec4899'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {hashtags.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    # Enter your topic to generate trending hashtags
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

export default HashtagGenerator
