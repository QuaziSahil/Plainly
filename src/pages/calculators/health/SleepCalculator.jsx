import { useState, useMemo } from 'react'
import { Moon } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SleepCalculator() {
    const [wakeUpTime, setWakeUpTime] = useState('07:00')
    const [mode, setMode] = useState('bedtime')

    const results = useMemo(() => {
        const sleepCycleMinutes = 90
        const fallAsleepMinutes = 15
        const [hours, minutes] = wakeUpTime.split(':').map(Number)
        const wakeUpDate = new Date()
        wakeUpDate.setHours(hours, minutes, 0, 0)

        const formatTime = (date) => {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        }

        if (mode === 'bedtime') {
            const bedtimes = []
            for (let cycles = 6; cycles >= 4; cycles--) {
                const sleepMinutes = cycles * sleepCycleMinutes + fallAsleepMinutes
                const bedtime = new Date(wakeUpDate.getTime() - sleepMinutes * 60000)
                bedtimes.push({
                    time: formatTime(bedtime),
                    cycles,
                    hours: (cycles * sleepCycleMinutes) / 60
                })
            }
            return { mode: 'bedtime', times: bedtimes }
        } else {
            const wakeTimes = []
            const now = new Date()
            now.setHours(hours, minutes, 0, 0)
            const sleepStart = new Date(now.getTime() + fallAsleepMinutes * 60000)

            for (let cycles = 4; cycles <= 6; cycles++) {
                const wakeTime = new Date(sleepStart.getTime() + cycles * sleepCycleMinutes * 60000)
                wakeTimes.push({
                    time: formatTime(wakeTime),
                    cycles,
                    hours: (cycles * sleepCycleMinutes) / 60
                })
            }
            return { mode: 'wakeup', times: wakeTimes }
        }
    }, [wakeUpTime, mode])

    return (
        <CalculatorLayout
            title="Sleep Calculator"
            description="Calculate optimal sleep and wake times"
            category="Health"
            categoryPath="/health"
            icon={Moon}
            result={results.times[0]?.time || '--:--'}
            resultLabel={mode === 'bedtime' ? 'Go to Sleep At' : 'Wake Up At'}
        >
            <div className="input-group">
                <label className="input-label">I want to...</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="bedtime">Wake up at a specific time</option>
                    <option value="wakeup">Go to sleep now</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">{mode === 'bedtime' ? 'Wake-up Time' : 'Bedtime'}</label>
                <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} />
            </div>
            <div className="result-details">
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '12px' }}>
                    {mode === 'bedtime' ? 'Optimal bedtimes:' : 'Optimal wake-up times:'}
                </div>
                {results.times.map((t, i) => (
                    <div className="result-detail-row" key={i}>
                        <span className="result-detail-label">{t.cycles} cycles ({t.hours}h)</span>
                        <span className="result-detail-value">{t.time}</span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default SleepCalculator
