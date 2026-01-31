import { useState, useEffect, useRef } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function Stopwatch() {
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [laps, setLaps] = useState([])
    const intervalRef = useRef(null)

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 10)
            }, 10)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isRunning])

    const start = () => setIsRunning(true)
    const stop = () => setIsRunning(false)
    const reset = () => {
        setIsRunning(false)
        setTime(0)
        setLaps([])
    }
    const lap = () => setLaps(prev => [time, ...prev])

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const centiseconds = Math.floor((ms % 1000) / 10)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
    }

    return (
        <CalculatorLayout
            title="Stopwatch"
            description="Precise stopwatch with lap times"
            category="Other"
            categoryPath="/other"
            icon={Timer}
            result={formatTime(time)}
            resultLabel={isRunning ? 'Running' : 'Stopwatch'}
        >
            <div style={{
                fontSize: '56px',
                fontFamily: 'monospace',
                textAlign: 'center',
                margin: '24px 0',
                letterSpacing: '2px'
            }}>
                {formatTime(time)}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {!isRunning ? (
                    <button onClick={start} style={{
                        flex: 1, padding: '14px', background: '#10b981', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px'
                    }}>Start</button>
                ) : (
                    <button onClick={stop} style={{
                        flex: 1, padding: '14px', background: '#ef4444', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px'
                    }}>Stop</button>
                )}
                {isRunning && (
                    <button onClick={lap} style={{
                        flex: 1, padding: '14px', background: '#333', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px'
                    }}>Lap</button>
                )}
                {time > 0 && !isRunning && (
                    <button onClick={reset} style={{
                        flex: 1, padding: '14px', background: '#333', border: 'none',
                        borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px'
                    }}>Reset</button>
                )}
            </div>

            {laps.length > 0 && (
                <div className="result-details">
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>Laps:</div>
                    {laps.map((lapTime, i) => (
                        <div className="result-detail-row" key={i}>
                            <span className="result-detail-label">Lap {laps.length - i}</span>
                            <span className="result-detail-value">{formatTime(lapTime)}</span>
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default Stopwatch
