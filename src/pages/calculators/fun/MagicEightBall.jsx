import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MagicEightBall() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState(null)
    const [isShaking, setIsShaking] = useState(false)

    const responses = [
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

    const shake = () => {
        if (!question.trim()) return
        setIsShaking(true)
        setAnswer(null)

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * responses.length)
            setAnswer(responses[randomIndex])
            setIsShaking(false)
        }, 1500)
    }

    return (
        <CalculatorLayout
            title="Magic 8 Ball"
            description="Ask a question, get an answer"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Sparkles}
            result={answer?.text || '—'}
            resultLabel="The Answer"
        >
            <div className="input-group">
                <label className="input-label">Ask a yes/no question</label>
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
                    cursor: question.trim() ? 'pointer' : 'not-allowed',
                    animation: isShaking ? 'shake 0.5s infinite' : 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
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
                    {isShaking ? '...' : answer?.text || '8'}
                </div>
            </div>
            <button
                onClick={shake}
                disabled={!question.trim() || isShaking}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: question.trim() && !isShaking ? '#a78bfa' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    color: question.trim() && !isShaking ? '#000' : '#666',
                    fontWeight: 600,
                    cursor: question.trim() && !isShaking ? 'pointer' : 'not-allowed',
                    fontSize: '15px'
                }}
            >
                {isShaking ? 'Shaking...' : '🎱 Shake the Ball'}
            </button>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    25% { transform: translateX(-5px) rotate(-5deg); }
                    75% { transform: translateX(5px) rotate(5deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default MagicEightBall
