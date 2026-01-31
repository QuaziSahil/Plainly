import { useState, useMemo } from 'react'
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

    const results = useMemo(() => {
        const target = new Date(`${targetDate}T${targetTime}`)
        const now = new Date()
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
            totalWeeks,
            totalMonths,
            totalMs: diff
        }
    }, [targetDate, targetTime])

    return (
        <CalculatorLayout
            title="Countdown Calculator"
            description="Count days until an event"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Timer}
            result={results.past ? 'Event passed!' : `${results.days} days`}
            resultLabel="Time Remaining"
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
                        background: '#1a1a2e',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '12px' }}>
                            ⏳ {eventName || 'Countdown'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: '#a78bfa' }}>{results.days}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6 }}>DAYS</div>
                            </div>
                            <div style={{ fontSize: '32px', opacity: 0.3 }}>:</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: '#a78bfa' }}>{results.hours}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6 }}>HOURS</div>
                            </div>
                            <div style={{ fontSize: '32px', opacity: 0.3 }}>:</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: '#a78bfa' }}>{results.minutes}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6 }}>MINS</div>
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
                            <span className="result-detail-label">Weeks & Days</span>
                            <span className="result-detail-value">{results.totalWeeks}w {results.days % 7}d</span>
                        </div>
                    </div>
                </>
            )}
        </CalculatorLayout>
    )
}

export default CountdownCalculator
