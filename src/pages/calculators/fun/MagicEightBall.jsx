import { useState } from 'react'
import { Sparkles, Wand2, Loader2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq, MODELS } from '../../../services/groqAI'

function MagicEightBall() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState(null)
    const [isShaking, setIsShaking] = useState(false)
    const [useAI, setUseAI] = useState(true)

    const classicResponses = [
        { text: 'It is certain', type: 'positive' },
        { text: 'It is decidedly so', type: 'positive' },
        { text: 'Without a doubt', type: 'positive' },
        { text: 'Yes definitely', type: 'positive' },
        { text: 'You may rely on it', type: 'positive' },
        { text: 'As I see it, yes', type: 'positive' },
        { text: 'Most likely', type: 'positive' },
        { text: 'Outlook good', type: 'positive' },
        { text: 'Yes', type: 'positive' },
        { text: 'Signs point to yes', type: 'positive' },
        { text: 'Reply hazy, try again', type: 'neutral' },
        { text: 'Ask again later', type: 'neutral' },
        { text: 'Better not tell you now', type: 'neutral' },
        { text: 'Cannot predict now', type: 'neutral' },
        { text: 'Concentrate and ask again', type: 'neutral' },
        { text: "Don't count on it", type: 'negative' },
        { text: 'My reply is no', type: 'negative' },
        { text: 'My sources say no', type: 'negative' },
        { text: 'Outlook not so good', type: 'negative' },
        { text: 'Very doubtful', type: 'negative' }
    ]

    const shake = async () => {
        if (!question.trim()) return
        setIsShaking(true)
        setAnswer(null)

        if (useAI) {
            try {
                const prompt = `You are a mystical Magic 8 Ball. The user asks: "${question}"

Give a mystical, fun, and slightly cryptic answer in ONE short sentence (max 8 words). 
Be playful but decisive - give a clear yes/no type direction.
Don't repeat the question. Just the mystical answer.`

                const response = await askGroq(prompt, 'You are a mystical fortune-telling Magic 8 Ball. Be brief and mysterious.', {
                    model: MODELS.randomNames,
                    temperature: 0.9,
                    maxTokens: 50
                })

                const text = response.trim().replace(/^["']|["']$/g, '')
                const isPositive = /yes|certain|definitely|will|good|luck|destiny|fate|favor/i.test(text)
                const isNegative = /no|don't|never|avoid|unlikely|doubt|bad/i.test(text)

                setAnswer({
                    text,
                    type: isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'
                })
            } catch (err) {
                console.error('AI error:', err)
                // Fallback to classic
                const randomIndex = Math.floor(Math.random() * classicResponses.length)
                setAnswer(classicResponses[randomIndex])
            }
        } else {
            await new Promise(r => setTimeout(r, 1000))
            const randomIndex = Math.floor(Math.random() * classicResponses.length)
            setAnswer(classicResponses[randomIndex])
        }

        setIsShaking(false)
    }

    return (
        <CalculatorLayout
            title="Magic 8 Ball"
            description="Ask a question, get a mystical answer"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Sparkles}
            result={answer?.text || '—'}
            resultLabel="The Answer"
        >
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: useAI ? '#8b5cf620' : '#33333350',
                borderRadius: '10px',
                marginBottom: '16px',
                border: `1px solid ${useAI ? '#8b5cf640' : '#444'}`
            }}>
                <Wand2 size={18} color={useAI ? '#8b5cf6' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {useAI ? '✨ AI-Powered Answers' : 'Classic Mode'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                        {useAI ? 'Unique mystical responses' : 'Traditional 8-ball answers'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 14px',
                        background: useAI ? '#8b5cf6' : '#444',
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
                <label className="input-label">Ask a question</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Will I be lucky today?"
                    onKeyPress={(e) => e.key === 'Enter' && shake()}
                />
            </div>
            <div
                onClick={shake}
                style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #333, #000)',
                    margin: '24px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: question.trim() && !isShaking ? 'pointer' : 'not-allowed',
                    animation: isShaking ? 'shake 0.5s infinite' : 'none',
                    boxShadow: useAI ? '0 10px 40px rgba(139, 92, 246, 0.3)' : '0 10px 40px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #333, #111)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #222',
                    fontSize: '11px',
                    textAlign: 'center',
                    padding: '8px',
                    color: answer ? (answer.type === 'positive' ? '#10b981' : answer.type === 'negative' ? '#ef4444' : '#f59e0b') : '#fff'
                }}>
                    {isShaking ? (
                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : answer?.text || '8'}
                </div>
            </div>
            <button
                onClick={shake}
                disabled={!question.trim() || isShaking}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: question.trim() && !isShaking ? (useAI ? '#8b5cf6' : '#a78bfa') : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    color: question.trim() && !isShaking ? '#fff' : '#666',
                    fontWeight: 600,
                    cursor: question.trim() && !isShaking ? 'pointer' : 'not-allowed',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {isShaking ? (
                    <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Consulting the spirits...
                    </>
                ) : (
                    <>🎱 Shake the Ball</>
                )}
            </button>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    25% { transform: translateX(-5px) rotate(-5deg); }
                    75% { transform: translateX(5px) rotate(5deg); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default MagicEightBall
