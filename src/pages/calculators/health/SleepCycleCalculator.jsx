import { useState, useMemo } from 'react'
import { Moon } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SleepCycleCalculator() {
    const [wakeUpTime, setWakeUpTime] = useState('07:00')
    const [mode, setMode] = useState('wakeUp')
    const [bedtime, setBedtime] = useState('23:00')

    const results = useMemo(() => {
        const cycleLength = 90 // minutes
        const fallAsleepTime = 15 // minutes

        if (mode === 'wakeUp') {
            // Calculate when to go to bed based on wake up time
            const [hours, minutes] = wakeUpTime.split(':').map(Number)
            const wakeMinutes = hours * 60 + minutes

            const cycles = [6, 5, 4].map(numCycles => {
                const sleepMinutes = numCycles * cycleLength
                let bedMinutes = wakeMinutes - sleepMinutes - fallAsleepTime
                if (bedMinutes < 0) bedMinutes += 24 * 60

                const bedHours = Math.floor(bedMinutes / 60)
                const bedMins = bedMinutes % 60

                return {
                    cycles: numCycles,
                    sleepHours: (sleepMinutes / 60).toFixed(1),
                    time: `${bedHours.toString().padStart(2, '0')}:${bedMins.toString().padStart(2, '0')}`
                }
            })

            return { mode: 'wakeUp', cycles }
        } else {
            // Calculate when to wake up based on bedtime
            const [hours, minutes] = bedtime.split(':').map(Number)
            const bedMinutes = hours * 60 + minutes + fallAsleepTime

            const cycles = [4, 5, 6].map(numCycles => {
                const sleepMinutes = numCycles * cycleLength
                let wakeMinutes = bedMinutes + sleepMinutes
                if (wakeMinutes >= 24 * 60) wakeMinutes -= 24 * 60

                const wakeHours = Math.floor(wakeMinutes / 60)
                const wakeMins = wakeMinutes % 60

                return {
                    cycles: numCycles,
                    sleepHours: (sleepMinutes / 60).toFixed(1),
                    time: `${wakeHours.toString().padStart(2, '0')}:${wakeMins.toString().padStart(2, '0')}`
                }
            })

            return { mode: 'bedtime', cycles }
        }
    }, [wakeUpTime, bedtime, mode])

    return (
        <CalculatorLayout
            title="Sleep Cycle Calculator"
            description="Optimize your sleep schedule"
            category="Health"
            categoryPath="/health"
            icon={Moon}
            result={results.cycles[0]?.time || '—'}
            resultLabel={mode === 'wakeUp' ? 'Best Bedtime' : 'Best Wake Time'}
        >
            <div className="input-group">
                <label className="input-label">I want to calculate...</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="wakeUp">When to go to bed (given wake time)</option>
                    <option value="bedtime">When to wake up (given bedtime)</option>
                </select>
            </div>
            {mode === 'wakeUp' ? (
                <div className="input-group">
                    <label className="input-label">Wake Up Time</label>
                    <input
                        type="time"
                        value={wakeUpTime}
                        onChange={(e) => setWakeUpTime(e.target.value)}
                    />
                </div>
            ) : (
                <div className="input-group">
                    <label className="input-label">Bedtime</label>
                    <input
                        type="time"
                        value={bedtime}
                        onChange={(e) => setBedtime(e.target.value)}
                    />
                </div>
            )}
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>
                {mode === 'wakeUp' ? 'SUGGESTED BEDTIMES' : 'SUGGESTED WAKE TIMES'}
            </div>
            {results.cycles.map((cycle, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        background: i === 0 ? '#a78bfa20' : '#1a1a2e',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: i === 0 ? '1px solid #a78bfa40' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: i === 0 ? '#a78bfa' : '#fff' }}>
                            {cycle.time}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>
                            {cycle.sleepHours}h ({cycle.cycles} cycles)
                        </div>
                    </div>
                    {i === 0 && (
                        <div style={{
                            background: '#a78bfa',
                            color: '#000',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                        }}>
                            RECOMMENDED
                        </div>
                    )}
                </div>
            ))}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#1a1a2e',
                borderRadius: '8px',
                fontSize: '12px',
                opacity: 0.8
            }}>
                💡 A full sleep cycle lasts about 90 minutes. Waking up between cycles helps you feel more refreshed.
            </div>
        </CalculatorLayout>
    )
}

export default SleepCycleCalculator
