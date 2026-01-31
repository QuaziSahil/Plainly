import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CountdownCalculator() {
    const [targetDate, setTargetDate] = useState(() => {
        const date = new Date()
        date.setMonth(date.getMonth() + 1)
        return date.toISOString().split('T')[0]
    })
    const [targetTime, setTargetTime] = useState('00:00')
    const [eventName, setEventName] = useState('My Event')
    const [now, setNow] = useState(new Date())

    // Live update every second
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Calculate time remaining
    const getResults = () => {
        const target = new Date(`${targetDate}T${targetTime}`)
        const diff = target - now

        if (diff <= 0) {
            return { past: true, totalMs: Math.abs(diff) }
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        const totalMinutes = Math.floor(diff / (1000 * 60))
        const totalHours = Math.floor(diff / (1000 * 60 * 60))
        const totalSeconds = Math.floor(diff / 1000)
        const totalWeeks = Math.floor(days / 7)
        const totalMonths = Math.floor(days / 30.44)

        return {
            past: false,
            days,
            hours,
            minutes,
            seconds,
            totalMinutes,
            totalHours,
            totalSeconds,
            totalWeeks,
            totalMonths,
            totalMs: diff
        }
    }

    const results = getResults()

    const handleReset = () => {
        const date = new Date()
        date.setMonth(date.getMonth() + 1)
        setTargetDate(date.toISOString().split('T')[0])
        setTargetTime('00:00')
        setEventName('My Event')
    }

    return (
        <CalculatorLayout
            title="Countdown Calculator"
            description="Count days until an event"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Timer}
            result={results.past ? 'Event passed!' : `${results.days} days`}
            resultLabel="Time Remaining"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Event Name</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Name your event..."
                />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Target Date</label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Target Time</label>
                    <input
                        type="time"
                        value={targetTime}
                        onChange={(e) => setTargetTime(e.target.value)}
                    />
                </div>
            </div>
            {results.past ? (
                <div style={{
                    background: '#f59e0b20',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '16px'
                }}>
                    <div style={{ fontSize: '32px' }}>⏰</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#f59e0b' }}>
                        This event has passed!
                    </div>
                </div>
            ) : (
                <>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        padding: '24px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        marginBottom: '16px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '16px' }}>
                            ⏳ {eventName || 'Countdown'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#a78bfa',
                                    fontFamily: 'monospace'
                                }}>
                                    {String(results.days).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>DAYS</div>
                            </div>
                            <div style={{ fontSize: '36px', opacity: 0.3, lineHeight: '1' }}>:</div>
                            <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#a78bfa',
                                    fontFamily: 'monospace'
                                }}>
                                    {String(results.hours).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>HOURS</div>
                            </div>
                            <div style={{ fontSize: '36px', opacity: 0.3, lineHeight: '1' }}>:</div>
                            <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#a78bfa',
                                    fontFamily: 'monospace'
                                }}>
                                    {String(results.minutes).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>MINS</div>
                            </div>
                            <div style={{ fontSize: '36px', opacity: 0.3, lineHeight: '1' }}>:</div>
                            <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#22c55e',
                                    fontFamily: 'monospace',
                                    animation: 'pulse 1s infinite'
                                }}>
                                    {String(results.seconds).padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>SECS</div>
                            </div>
                        </div>
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Days</span>
                            <span className="result-detail-value">{results.days.toLocaleString()}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Hours</span>
                            <span className="result-detail-value">{results.totalHours.toLocaleString()}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Minutes</span>
                            <span className="result-detail-value">{results.totalMinutes.toLocaleString()}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Seconds</span>
                            <span className="result-detail-value" style={{ color: '#22c55e' }}>
                                {results.totalSeconds.toLocaleString()}
                            </span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Weeks & Days</span>
                            <span className="result-detail-value">{results.totalWeeks}w {results.days % 7}d</span>
                        </div>
                    </div>
                </>
            )}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default CountdownCalculator

