import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TimeCalculator() {
    const [operation, setOperation] = useState('add')
    const [hours1, setHours1] = useState(2)
    const [minutes1, setMinutes1] = useState(30)
    const [seconds1, setSeconds1] = useState(0)
    const [hours2, setHours2] = useState(1)
    const [minutes2, setMinutes2] = useState(45)
    const [seconds2, setSeconds2] = useState(30)

    const results = useMemo(() => {
        const total1 = hours1 * 3600 + minutes1 * 60 + seconds1
        const total2 = hours2 * 3600 + minutes2 * 60 + seconds2

        let resultSeconds
        if (operation === 'add') {
            resultSeconds = total1 + total2
        } else {
            resultSeconds = Math.abs(total1 - total2)
        }

        const resultHours = Math.floor(resultSeconds / 3600)
        const remainingAfterHours = resultSeconds % 3600
        const resultMinutes = Math.floor(remainingAfterHours / 60)
        const resultSecs = remainingAfterHours % 60

        // Also convert to other formats
        const totalMinutes = resultSeconds / 60
        const totalHours = resultSeconds / 3600
        const totalDays = resultSeconds / 86400

        return {
            hours: resultHours,
            minutes: resultMinutes,
            seconds: resultSecs,
            totalSeconds: resultSeconds,
            totalMinutes,
            totalHours,
            totalDays,
            formatted: `${resultHours}h ${resultMinutes}m ${resultSecs}s`
        }
    }, [operation, hours1, minutes1, seconds1, hours2, minutes2, seconds2])

    return (
        <CalculatorLayout
            title="Time Calculator"
            description="Add or subtract time durations"
            category="Other"
            categoryPath="/other"
            icon={Clock}
            result={results.formatted}
            resultLabel="Result"
        >
            <div className="input-group">
                <label className="input-label">Operation</label>
                <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                    <option value="add">Add (+)</option>
                    <option value="subtract">Subtract (−)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Time 1</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={hours1}
                        onChange={(e) => setHours1(Number(e.target.value))}
                        min={0}
                        placeholder="Hours"
                    />
                    <input
                        type="number"
                        value={minutes1}
                        onChange={(e) => setMinutes1(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        value={seconds1}
                        onChange={(e) => setSeconds1(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Sec"
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Time 2</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={hours2}
                        onChange={(e) => setHours2(Number(e.target.value))}
                        min={0}
                        placeholder="Hours"
                    />
                    <input
                        type="number"
                        value={minutes2}
                        onChange={(e) => setMinutes2(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        value={seconds2}
                        onChange={(e) => setSeconds2(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Sec"
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Seconds</span>
                    <span className="result-detail-value">{results.totalSeconds.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Minutes</span>
                    <span className="result-detail-value">{results.totalMinutes.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Hours</span>
                    <span className="result-detail-value">{results.totalHours.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Days</span>
                    <span className="result-detail-value">{results.totalDays.toFixed(4)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TimeCalculator
