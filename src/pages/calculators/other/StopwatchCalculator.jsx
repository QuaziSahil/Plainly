import { useState, useMemo } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function StopwatchCalculator() {
    const [times, setTimes] = useState([
        { label: 'Lap 1', time: '1:23.45' },
        { label: 'Lap 2', time: '1:18.22' },
        { label: 'Lap 3', time: '1:25.67' }
    ])
    const [newLabel, setNewLabel] = useState('')
    const [newTime, setNewTime] = useState('')

    const parseTime = (timeStr) => {
        // Parse MM:SS.ms or SS.ms or just seconds
        const parts = timeStr.split(':')
        let seconds = 0

        if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1])
        } else {
            seconds = parseFloat(parts[0])
        }

        return isNaN(seconds) ? 0 : seconds
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = (seconds % 60).toFixed(2)
        return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : secs
    }

    const results = useMemo(() => {
        const parsed = times.map(t => ({
            ...t,
            seconds: parseTime(t.time)
        }))

        const totalSeconds = parsed.reduce((acc, t) => acc + t.seconds, 0)
        const avgSeconds = totalSeconds / parsed.length
        const fastest = Math.min(...parsed.map(t => t.seconds))
        const slowest = Math.max(...parsed.map(t => t.seconds))
        const fastestLabel = parsed.find(t => t.seconds === fastest)?.label
        const slowestLabel = parsed.find(t => t.seconds === slowest)?.label

        return {
            parsed,
            totalSeconds,
            avgSeconds,
            fastest,
            slowest,
            fastestLabel,
            slowestLabel,
            count: times.length
        }
    }, [times])

    const addTime = () => {
        if (!newTime.trim()) return
        setTimes([...times, {
            label: newLabel.trim() || `Lap ${times.length + 1}`,
            time: newTime.trim()
        }])
        setNewLabel('')
        setNewTime('')
    }

    const removeTime = (index) => {
        setTimes(times.filter((_, i) => i !== index))
    }

    const clearAll = () => {
        setTimes([])
    }

    return (
        <CalculatorLayout
            title="Split Time Calculator"
            description="Analyze lap/split times"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Timer}
            result={formatTime(results.totalSeconds)}
            resultLabel="Total Time"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Label</label>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Lap 4"
                    />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Time (MM:SS.ms)</label>
                    <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="1:23.45"
                        onKeyPress={(e) => e.key === 'Enter' && addTime()}
                    />
                </div>
                <button
                    onClick={addTime}
                    style={{
                        padding: '10px 16px',
                        background: '#a78bfa',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: 600,
                        cursor: 'pointer',
                        alignSelf: 'flex-end',
                        marginBottom: '16px'
                    }}
                >
                    + Add
                </button>
            </div>
            {times.length > 0 ? (
                <>
                    <div style={{ marginBottom: '16px' }}>
                        {results.parsed.map((t, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    background: t.seconds === results.fastest ? '#22c55e20' :
                                        t.seconds === results.slowest ? '#ef444420' : '#1a1a2e',
                                    borderRadius: '8px',
                                    marginBottom: '6px'
                                }}
                            >
                                <div style={{ flex: 1, fontWeight: 500 }}>{t.label}</div>
                                <div style={{
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: t.seconds === results.fastest ? '#22c55e' :
                                        t.seconds === results.slowest ? '#ef4444' : '#fff'
                                }}>
                                    {formatTime(t.seconds)}
                                </div>
                                {t.seconds === results.fastest && <span style={{ fontSize: '11px', color: '#22c55e' }}>FASTEST</span>}
                                {t.seconds === results.slowest && times.length > 1 && <span style={{ fontSize: '11px', color: '#ef4444' }}>SLOWEST</span>}
                                <button
                                    onClick={() => removeTime(i)}
                                    style={{
                                        padding: '4px 8px',
                                        background: 'transparent',
                                        border: '1px solid #444',
                                        borderRadius: '4px',
                                        color: '#888',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>TOTAL</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#a78bfa' }}>{formatTime(results.totalSeconds)}</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>AVERAGE</div>
                            <div style={{ fontSize: '16px', fontWeight: 700 }}>{formatTime(results.avgSeconds)}</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>SPLITS</div>
                            <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.count}</div>
                        </div>
                    </div>
                    <button
                        onClick={clearAll}
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
                        Clear All
                    </button>
                </>
            ) : (
                <div style={{
                    background: '#1a1a2e',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏱️</div>
                    <div style={{ opacity: 0.6 }}>Add times to analyze splits</div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default StopwatchCalculator
