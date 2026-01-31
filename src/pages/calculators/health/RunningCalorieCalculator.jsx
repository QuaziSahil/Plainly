import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RunningCalorieCalculator() {
    const [weight, setWeight] = useState(150)
    const [distance, setDistance] = useState(3)
    const [time, setTime] = useState(30)
    const [incline, setIncline] = useState(0)
    const [unit, setUnit] = useState('imperial')

    const results = useMemo(() => {
        const weightKg = unit === 'imperial' ? weight * 0.453592 : weight
        const distanceKm = unit === 'imperial' ? distance * 1.60934 : distance

        const pace = time / distance // min per mile or km
        const speed = distance / (time / 60) // mph or kph

        // MET values based on running speed
        let met = 8 // default jogging
        if (speed > 8) met = 11.5
        else if (speed > 7) met = 10
        else if (speed > 6) met = 9
        else if (speed > 5) met = 7

        // Add incline bonus (roughly 10% per 1% grade)
        met += met * (incline / 100)

        const calories = met * weightKg * (time / 60)
        const caloriesPerMile = calories / distance

        return { calories, caloriesPerMile, pace, speed, met }
    }, [weight, distance, time, incline, unit])

    return (
        <CalculatorLayout
            title="Running Calorie Calculator"
            description="Calculate calories burned running"
            category="Health"
            categoryPath="/health"
            icon={Activity}
            result={`${Math.round(results.calories)}`}
            resultLabel="Calories Burned"
        >
            <div className="input-group">
                <label className="input-label">Unit System</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="imperial">Imperial (lbs, miles)</option>
                    <option value="metric">Metric (kg, km)</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</label>
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={50} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Distance ({unit === 'imperial' ? 'miles' : 'km'})</label>
                    <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={0.1} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Time (minutes)</label>
                    <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Incline (%)</label>
                <input type="number" value={incline} onChange={(e) => setIncline(Number(e.target.value))} min={0} max={30} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Calories Burned</span>
                    <span className="result-detail-value">{Math.round(results.calories)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Calories per {unit === 'imperial' ? 'Mile' : 'Km'}</span>
                    <span className="result-detail-value">{Math.round(results.caloriesPerMile)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Pace</span>
                    <span className="result-detail-value">{results.pace.toFixed(1)} min/{unit === 'imperial' ? 'mi' : 'km'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Speed</span>
                    <span className="result-detail-value">{results.speed.toFixed(1)} {unit === 'imperial' ? 'mph' : 'kph'}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RunningCalorieCalculator
