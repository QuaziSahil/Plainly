import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function VO2MaxCalculator() {
    const [method, setMethod] = useState('cooper')
    const [distance, setDistance] = useState(2400) // meters
    const [time, setTime] = useState(12) // minutes
    const [age, setAge] = useState(30)
    const [restingHR, setRestingHR] = useState(60)
    const [maxHR, setMaxHR] = useState(190)

    const results = useMemo(() => {
        let vo2max = 0

        if (method === 'cooper') {
            // Cooper 12-minute run test
            vo2max = (distance - 504.9) / 44.73
        } else if (method === 'rockport') {
            // Rockport walk test (simplified)
            vo2max = 132.853 - (0.0769 * 150) - (0.3877 * age) + (6.315 * 1) - (3.2649 * time) - (0.1565 * restingHR)
        } else {
            // Heart rate ratio method
            vo2max = 15.3 * (maxHR / restingHR)
        }

        let category = ''
        if (vo2max >= 50) category = 'Excellent'
        else if (vo2max >= 40) category = 'Good'
        else if (vo2max >= 35) category = 'Average'
        else if (vo2max >= 30) category = 'Below Average'
        else category = 'Poor'

        return { vo2max: Math.max(0, vo2max), category }
    }, [method, distance, time, age, restingHR, maxHR])

    return (
        <CalculatorLayout
            title="VO2 Max Calculator"
            description="Estimate aerobic fitness level"
            category="Health"
            categoryPath="/health"
            icon={Activity}
            result={`${results.vo2max.toFixed(1)}`}
            resultLabel="VO2 Max (ml/kg/min)"
        >
            <div className="input-group">
                <label className="input-label">Test Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="cooper">Cooper 12-min Run</option>
                    <option value="hr">Heart Rate Ratio</option>
                </select>
            </div>
            {method === 'cooper' && (
                <div className="input-group">
                    <label className="input-label">Distance Run in 12 min (meters)</label>
                    <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={0} />
                </div>
            )}
            {method === 'hr' && (
                <>
                    <div className="input-group">
                        <label className="input-label">Resting Heart Rate (bpm)</label>
                        <input type="number" value={restingHR} onChange={(e) => setRestingHR(Number(e.target.value))} min={30} max={120} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Max Heart Rate (bpm)</label>
                        <input type="number" value={maxHR} onChange={(e) => setMaxHR(Number(e.target.value))} min={100} max={220} />
                    </div>
                </>
            )}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">VO2 Max</span>
                    <span className="result-detail-value">{results.vo2max.toFixed(1)} ml/kg/min</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Fitness Level</span>
                    <span className="result-detail-value" style={{
                        color: results.category === 'Excellent' ? '#10b981' :
                            results.category === 'Good' ? '#22c55e' :
                                results.category === 'Average' ? '#f59e0b' : '#ef4444'
                    }}>
                        {results.category}
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default VO2MaxCalculator
