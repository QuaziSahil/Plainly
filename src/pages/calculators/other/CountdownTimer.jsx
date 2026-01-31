import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CountdownTimer() {
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(5)
    const [seconds, setSeconds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        let interval
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false)
            // Simple alert when timer completes
            if (Notification.permission === 'granted') {
                new Notification('Timer Complete!')
            }
        }
        return () => clearInterval(interval)
    }, [isRunning, timeLeft])

    const startTimer = () => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        setTimeLeft(totalSeconds)
        setIsRunning(true)
    }

    const pauseTimer = () => setIsRunning(false)
    const resumeTimer = () => setIsRunning(true)
    const resetTimer = () => {
        setIsRunning(false)
        setTimeLeft(0)
    }

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600)
        const m = Math.floor((secs % 3600) / 60)
        const s = secs % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const presets = [
        { label: '1 min', value: 60 },
        { label: '5 min', value: 300 },
        { label: '10 min', value: 600 },
        { label: '25 min', value: 1500 },
    ]

    return (
        <CalculatorLayout
            title="Countdown Timer"
            description="Set countdowns with notifications"
            category="Other"
            categoryPath="/other"
            icon={Timer}
            result={formatTime(timeLeft)}
            resultLabel={isRunning ? 'Running' : 'Timer'}
        >
            {!isRunning && timeLeft === 0 && (
                <>
                    <div className="input-row">
                        <div className="input-group">
                            <label className="input-label">Hours</label>
                            <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min={0} max={23} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Minutes</label>
                            <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} min={0} max={59} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Seconds</label>
                            <input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} min={0} max={59} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {presets.map(p => (
                            <button key={p.label} onClick={() => {
                                setTimeLeft(p.value)
                                setIsRunning(true)
                            }} style={{
                                flex: 1, padding: '10px', background: '#333', border: 'none',
                                borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '12px'
                            }}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div style={{
                fontSize: '48px',
                fontFamily: 'monospace',
                textAlign: 'center',
                margin: '24px 0',
                color: timeLeft < 10 && timeLeft > 0 ? '#ef4444' : 'inherit'
            }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {!isRunning && timeLeft === 0 && (
                    <button onClick={startTimer} style={{
                        flex: 1, padding: '12px', background: '#10b981', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer'
                    }}>Start</button>
                )}
                {isRunning && (
                    <button onClick={pauseTimer} style={{
                        flex: 1, padding: '12px', background: '#f59e0b', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer'
                    }}>Pause</button>
                )}
                {!isRunning && timeLeft > 0 && (
                    <button onClick={resumeTimer} style={{
                        flex: 1, padding: '12px', background: '#10b981', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer'
                    }}>Resume</button>
                )}
                {timeLeft > 0 && (
                    <button onClick={resetTimer} style={{
                        flex: 1, padding: '12px', background: '#ef4444', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer'
                    }}>Reset</button>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default CountdownTimer
