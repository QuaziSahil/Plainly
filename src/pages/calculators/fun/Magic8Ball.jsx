import { useState } from 'react'
import { CircleDot } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function Magic8Ball() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [isShaking, setIsShaking] = useState(false)

    const answers = [
        { text: 'It is certain', type: 'positive' },
        { text: 'Without a doubt', type: 'positive' },
        { text: 'Yes definitely', type: 'positive' },
        { text: 'You may rely on it', type: 'positive' },
        { text: 'As I see it, yes', type: 'positive' },
        { text: 'Most likely', type: 'positive' },
        { text: 'Outlook good', type: 'positive' },
        { text: 'Signs point to yes', type: 'positive' },
        { text: 'Reply hazy try again', type: 'neutral' },
        { text: 'Ask again later', type: 'neutral' },
        { text: 'Better not tell you now', type: 'neutral' },
        { text: 'Cannot predict now', type: 'neutral' },
        { text: 'Concentrate and ask again', type: 'neutral' },
        { text: "Don't count on it", type: 'negative' },
        { text: 'My reply is no', type: 'negative' },
        { text: 'My sources say no', type: 'negative' },
        { text: 'Outlook not so good', type: 'negative' },
        { text: 'Very doubtful', type: 'negative' },
    ]

    const shake = () => {
        if (!question.trim()) return

        setIsShaking(true)
        setAnswer('')

        setTimeout(() => {
            const randomAnswer = answers[Math.floor(Math.random() * answers.length)]
            setAnswer(randomAnswer.text)
            setIsShaking(false)
        }, 1500)
    }

    const getAnswerColor = () => {
        const answerObj = answers.find(a => a.text === answer)
        if (!answerObj) return '#fff'
        if (answerObj.type === 'positive') return '#10b981'
        if (answerObj.type === 'negative') return '#ef4444'
        return '#f59e0b'
    }

    return (
        <CalculatorLayout
            title="Magic 8-Ball"
            description="Ask yes/no questions"
            category="Fun"
            categoryPath="/fun"
            icon={CircleDot}
            result={answer || '🎱'}
            resultLabel="Answer"
        >
            <div className="input-group">
                <label className="input-label">Ask a Yes/No Question</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Will I win the lottery?"
                    onKeyPress={(e) => e.key === 'Enter' && shake()}
                />
            </div>

            <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #444, #000)',
                margin: '24px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                animation: isShaking ? 'shake 0.5s infinite' : 'none'
            }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: '#1a1aff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getAnswerColor(),
                    fontSize: answer ? '11px' : '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px'
                }}>
                    {isShaking ? '...' : (answer || '8')}
                </div>
            </div>

            <button onClick={shake} disabled={isShaking || !question.trim()} style={{
                width: '100%',
                padding: '14px',
                background: isShaking ? '#666' : '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: isShaking ? 'wait' : 'pointer',
                fontSize: '16px'
            }}>
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

export default Magic8Ball
