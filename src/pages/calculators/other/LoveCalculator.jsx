import { useState, useMemo } from 'react'
import { Heart, Wand2, Loader2, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq, MODELS } from '../../../services/groqAI'

function LoveCalculator() {
    const [name1, setName1] = useState('')
    const [name2, setName2] = useState('')
    const [useAI, setUseAI] = useState(true)
    const [aiReading, setAiReading] = useState(null)
    const [loading, setLoading] = useState(false)

    // Classic algorithm result
    const classicResults = useMemo(() => {
        if (!name1 || !name2) return { percentage: 0, message: 'Enter both names' }

        const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, '')
        let sum = 0
        for (let i = 0; i < combined.length; i++) {
            sum += combined.charCodeAt(i)
        }

        const percentage = (sum * 7 + name1.length * name2.length * 13) % 101

        let message, emoji
        if (percentage >= 90) { message = 'Perfect Match! 💕'; emoji = '💕' }
        else if (percentage >= 75) { message = 'Great Compatibility!'; emoji = '💗' }
        else if (percentage >= 60) { message = 'Good Potential!'; emoji = '💖' }
        else if (percentage >= 45) { message = 'Worth Exploring!'; emoji = '💝' }
        else if (percentage >= 30) { message = 'Needs Work!'; emoji = '💔' }
        else { message = 'Opposite Attracts?'; emoji = '🤔' }

        return { percentage, message, emoji }
    }, [name1, name2])

    const getAIReading = async () => {
        if (!name1.trim() || !name2.trim()) return

        setLoading(true)
        setAiReading(null)

        try {
            const prompt = `You are a fun, mystical love compatibility reader. Analyze the compatibility between "${name1}" and "${name2}".

Give a fun, playful, and slightly mystical love compatibility reading in 2-3 short sentences.
Include things like:
- Their energy together
- What could make them work
- A fun prediction

Keep it positive and entertaining! This is just for fun.`

            const response = await askGroq(prompt, 'You are a fun and mystical love compatibility reader. Be playful and positive.', {
                model: MODELS.randomNames,
                temperature: 0.9,
                maxTokens: 150
            })

            setAiReading(response.trim())
        } catch (err) {
            console.error('AI error:', err)
            setAiReading("The stars are shy today... but love always finds a way! 💫")
        }

        setLoading(false)
    }

    const displayResults = classicResults.percentage > 0

    return (
        <CalculatorLayout
            title="Love Calculator"
            description="Calculate love compatibility (just for fun!)"
            category="Other"
            categoryPath="/other"
            icon={Heart}
            result={`${classicResults.percentage}%`}
            resultLabel="Love Score"
        >
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: useAI ? '#ec489920' : '#33333350',
                borderRadius: '10px',
                marginBottom: '16px',
                border: `1px solid ${useAI ? '#ec489940' : '#444'}`
            }}>
                <Wand2 size={18} color={useAI ? '#ec4899' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {useAI ? '✨ AI Love Reading' : 'Classic Mode'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                        {useAI ? 'Get a personalized love reading' : 'Simple percentage only'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 14px',
                        background: useAI ? '#ec4899' : '#444',
                        border: 'none',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    {useAI ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="input-group">
                <label className="input-label">Your Name</label>
                <input
                    type="text"
                    value={name1}
                    onChange={(e) => { setName1(e.target.value); setAiReading(null) }}
                    placeholder="Enter your name"
                />
            </div>
            <div className="input-group">
                <label className="input-label">Partner's Name</label>
                <input
                    type="text"
                    value={name2}
                    onChange={(e) => { setName2(e.target.value); setAiReading(null) }}
                    placeholder="Enter their name"
                />
            </div>

            {displayResults && (
                <div className="result-details">
                    <div style={{
                        textAlign: 'center',
                        fontSize: '48px',
                        margin: '16px 0'
                    }}>
                        {classicResults.emoji}
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Compatibility</span>
                        <span className="result-detail-value">{classicResults.percentage}%</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Result</span>
                        <span className="result-detail-value">{classicResults.message}</span>
                    </div>

                    {/* AI Reading Section */}
                    {useAI && (
                        <div style={{ marginTop: '20px' }}>
                            {!aiReading && !loading && (
                                <button
                                    onClick={getAIReading}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Sparkles size={18} />
                                    Get AI Love Reading
                                </button>
                            )}

                            {loading && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    color: '#ec4899'
                                }}>
                                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                                        Consulting the love stars...
                                    </div>
                                </div>
                            )}

                            {aiReading && (
                                <div style={{
                                    background: '#ec489915',
                                    border: '1px solid #ec489940',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginTop: '12px'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#ec4899',
                                        fontWeight: 600,
                                        marginBottom: '8px'
                                    }}>
                                        ✨ AI Love Reading
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        fontStyle: 'italic'
                                    }}>
                                        "{aiReading}"
                                    </div>
                                    <button
                                        onClick={getAIReading}
                                        style={{
                                            marginTop: '12px',
                                            padding: '8px 16px',
                                            background: '#ec489930',
                                            border: '1px solid #ec489950',
                                            borderRadius: '6px',
                                            color: '#ec4899',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🔮 Get Another Reading
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <p style={{ fontSize: '11px', opacity: 0.5, textAlign: 'center', marginTop: '16px' }}>
                        * This is just for entertainment purposes!
                    </p>
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

export default LoveCalculator
