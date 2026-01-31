import { useState, useMemo } from 'react'
import { Gamepad2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ReactionTimeGame() {
    const [gameState, setGameState] = useState('waiting') // waiting, ready, go, result
    const [startTime, setStartTime] = useState(null)
    const [reactionTime, setReactionTime] = useState(null)
    const [attempts, setAttempts] = useState([])
    const [tooEarly, setTooEarly] = useState(false)

    const startGame = () => {
        setTooEarly(false)
        setGameState('ready')
        setReactionTime(null)

        // Random delay between 2-5 seconds
        const delay = 2000 + Math.random() * 3000

        setTimeout(() => {
            setGameState(prevState => {
                if (prevState === 'ready') {
                    setStartTime(Date.now())
                    return 'go'
                }
                return prevState
            })
        }, delay)
    }

    const handleClick = () => {
        if (gameState === 'waiting') {
            startGame()
        } else if (gameState === 'ready') {
            // Clicked too early!
            setGameState('waiting')
            setTooEarly(true)
        } else if (gameState === 'go') {
            const time = Date.now() - startTime
            setReactionTime(time)
            setAttempts(prev => [...prev.slice(-9), time])
            setGameState('result')
        } else if (gameState === 'result') {
            startGame()
        }
    }

    const stats = useMemo(() => {
        if (attempts.length === 0) return null

        const avg = attempts.reduce((a, b) => a + b, 0) / attempts.length
        const best = Math.min(...attempts)
        const worst = Math.max(...attempts)

        // Rating
        let rating, color
        if (avg < 200) { rating = 'Incredible!'; color = '#22c55e' }
        else if (avg < 250) { rating = 'Excellent'; color = '#10b981' }
        else if (avg < 300) { rating = 'Good'; color = '#a78bfa' }
        else if (avg < 400) { rating = 'Average'; color = '#f59e0b' }
        else { rating = 'Keep practicing!'; color = '#ef4444' }

        return { avg, best, worst, rating, color, count: attempts.length }
    }, [attempts])

    const clearAttempts = () => {
        setAttempts([])
        setReactionTime(null)
        setGameState('waiting')
    }

    const getBackgroundColor = () => {
        if (tooEarly) return '#ef4444'
        switch (gameState) {
            case 'ready': return '#f59e0b'
            case 'go': return '#22c55e'
            case 'result': return '#3b82f6'
            default: return '#a78bfa'
        }
    }

    const getInstructions = () => {
        if (tooEarly) return 'Too early! Click to try again'
        switch (gameState) {
            case 'ready': return 'Wait for green...'
            case 'go': return 'CLICK NOW!'
            case 'result': return 'Click to try again'
            default: return 'Click to start'
        }
    }

    return (
        <CalculatorLayout
            title="Reaction Time Test"
            description="Test your reaction speed"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Gamepad2}
            result={reactionTime ? `${reactionTime} ms` : '—'}
            resultLabel="Reaction Time"
        >
            <div
                onClick={handleClick}
                style={{
                    background: getBackgroundColor(),
                    padding: '60px 20px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    marginBottom: '16px',
                    userSelect: 'none'
                }}
            >
                {gameState === 'result' && reactionTime && (
                    <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                        {reactionTime} ms
                    </div>
                )}
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>
                    {getInstructions()}
                </div>
            </div>

            {stats && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ background: '#1a1a2e', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>BEST</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>{stats.best} ms</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>AVERAGE</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>{Math.round(stats.avg)} ms</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>WORST</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444' }}>{stats.worst} ms</div>
                        </div>
                    </div>
                    <div style={{
                        background: `${stats.color}20`,
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ fontSize: '14px', opacity: 0.6 }}>Your Rating</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: stats.color }}>{stats.rating}</div>
                        <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>{stats.count} attempt{stats.count !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>RECENT ATTEMPTS</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {attempts.map((time, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '4px 10px',
                                        background: time === stats.best ? '#22c55e20' : '#1a1a2e',
                                        borderRadius: '999px',
                                        fontSize: '12px',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    {time}ms
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={clearAttempts}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                    >
                        Clear All Attempts
                    </button>
                </>
            )}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#1a1a2e',
                borderRadius: '8px',
                fontSize: '11px',
                opacity: 0.7
            }}>
                💡 Average human reaction time is 200-250ms. Pro gamers average around 150ms!
            </div>
        </CalculatorLayout>
    )
}

export default ReactionTimeGame
