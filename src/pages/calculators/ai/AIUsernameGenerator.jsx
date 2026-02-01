import { useState, useRef } from 'react'
import { AtSign, Loader2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AIUsernameGenerator() {
    const [keywords, setKeywords] = useState('')
    const [style, setStyle] = useState('cool')
    const [count, setCount] = useState(10)
    const [usernames, setUsernames] = useState([])
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(null)
    const [error, setError] = useState('')

    const styles = [
        { value: 'cool', label: 'Cool & Modern', description: 'Clean, trendy names' },
        { value: 'aesthetic', label: 'Aesthetic / Minimalist', description: 'Soft, artistic vibes' },
        { value: 'gamer', label: 'Gaming Style', description: 'Xx_ProGamer_xX style' },
        { value: 'funny', label: 'Humorous', description: 'Silly and memorable' },
        { value: 'professional', label: 'Professional', description: 'Clean business handles' },
        { value: 'fantasy', label: 'Fantasy / RPG', description: 'Mythical and epic' },
        { value: 'hacker', label: 'Hacker / Tech', description: 'Cyber, 1337 style' },
        { value: 'cute', label: 'Cute / Kawaii', description: 'Adorable names' }
    ]

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        setUsernames([])

        const styleInfo = styles.find(s => s.value === style)

        const systemPrompt = `You are a creative username generator. Generate unique, catchy usernames.

CRITICAL RULES:
- Return ONLY usernames, one per line
- NO explanations, NO descriptions, NO quotes, NO numbering
- Each username should be 4-16 characters
- Use only letters, numbers, and underscores
- Make them memorable and easy to type
- Match the requested style exactly`

        const prompt = `Generate ${count} unique ${styleInfo?.label || style} usernames${keywords ? ` inspired by: ${keywords}` : ''}.

Style: ${styleInfo?.description || style}

Return ONLY the usernames, one per line. No explanations, no numbers, no extras.`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.95,
                maxTokens: 500
            })

            // Parse response - extract usernames line by line
            const lines = response
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                // Remove numbering like "1." or "1:" or "1)"
                .map(line => line.replace(/^\d+[\.\:\)\-]\s*/, ''))
                // Remove quotes
                .map(line => line.replace(/^["'`]|["'`]$/g, ''))
                // Remove markdown formatting
                .map(line => line.replace(/^\*+|\*+$/g, ''))
                .map(line => line.trim())
                .filter(line => line.length > 0 && line.length <= 20)
                // Only keep valid username characters
                .filter(line => /^[a-zA-Z0-9_]+$/.test(line) || /^[a-zA-Z0-9_.\-]+$/.test(line))

            if (lines.length === 0) {
                // Fallback parsing - try to find any valid username-like strings
                const matches = response.match(/[a-zA-Z][a-zA-Z0-9_]{2,15}/g)
                if (matches) {
                    setUsernames([...new Set(matches)].slice(0, count))
                } else {
                    setError('Could not generate valid usernames. Please try again.')
                }
            } else {
                setUsernames([...new Set(lines)].slice(0, count))
            }

            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate usernames. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (username, index) => {
        await navigator.clipboard.writeText(username)
        setCopied(index)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleCopyAll = async () => {
        await navigator.clipboard.writeText(usernames.join('\n'))
        setCopied('all')
        setTimeout(() => setCopied(null), 2000)
    }

    const handleReset = () => {
        setKeywords('')
        setStyle('cool')
        setCount(10)
        setUsernames([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Username Generator"
            description="Generate unique, catchy usernames for gaming, social media, and more"
            category="AI Tools"
            categoryPath="/ai"
            icon={AtSign}
            result={usernames.length > 0 ? `${usernames.length} Usernames` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Keywords Input */}
            <div className="input-group">
                <label className="input-label">Keywords or Inspiration (optional)</label>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., night, shadow, phoenix, your name..."
                    className="input-field"
                />
            </div>

            {/* Style Selection */}
            <div className="input-group">
                <label className="input-label">Username Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    {styles.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {/* Count Selection */}
            <div className="input-group">
                <label className="input-label">Number of Usernames</label>
                <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                    <option value={5}>5 usernames</option>
                    <option value={10}>10 usernames</option>
                    <option value={15}>15 usernames</option>
                    <option value={20}>20 usernames</option>
                </select>
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
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
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
                    marginBottom: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating...
                    </>
                ) : usernames.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Usernames
                    </>
                )}
            </button>

            {/* Results */}
            {usernames.length > 0 && (
                <div ref={resultRef} style={{
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
                        borderBottom: '1px solid #333',
                        background: '#0d1117',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '12px', color: '#8b949e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AtSign size={12} />
                            {usernames.length} Usernames Generated
                        </span>
                        <button
                            onClick={handleCopyAll}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied === 'all' ? '#10b981' : '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                minHeight: '32px'
                            }}
                        >
                            {copied === 'all' ? <Check size={14} /> : <Copy size={14} />}
                            {copied === 'all' ? 'Copied All!' : 'Copy All'}
                        </button>
                    </div>

                    {/* Username List */}
                    <div style={{ padding: '12px' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '10px'
                        }}>
                            {usernames.map((username, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCopy(username, index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: copied === index ? '#10b98120' : '#21262d',
                                        border: copied === index ? '1px solid #10b981' : '1px solid #30363d',
                                        borderRadius: '8px',
                                        color: copied === index ? '#10b981' : '#e6edf3',
                                        fontSize: '14px',
                                        fontFamily: 'monospace',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        minHeight: '44px'
                                    }}
                                >
                                    <span style={{ fontWeight: '500' }}>@{username}</span>
                                    {copied === index ? <Check size={14} /> : <Copy size={14} style={{ opacity: 0.5 }} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tip */}
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #333',
                        background: '#0d1117',
                        fontSize: '12px',
                        color: '#8b949e',
                        textAlign: 'center'
                    }}>
                        💡 Click any username to copy it
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

export default AIUsernameGenerator
