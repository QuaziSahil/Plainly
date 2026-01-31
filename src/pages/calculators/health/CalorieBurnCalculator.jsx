import { useState, useMemo } from 'react'
import { Flame } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CalorieBurnCalculator() {
    const [weight, setWeight] = useState(150)
    const [activity, setActivity] = useState('running')
    const [duration, setDuration] = useState(30)
    const [intensity, setIntensity] = useState('moderate')

    // MET values for activities by intensity
    const activities = {
        running: { light: 6, moderate: 10, vigorous: 12 },
        cycling: { light: 4, moderate: 8, vigorous: 12 },
        swimming: { light: 6, moderate: 8, vigorous: 10 },
        walking: { light: 2.5, moderate: 4, vigorous: 5 },
        weightlifting: { light: 3, moderate: 5, vigorous: 6 },
        yoga: { light: 2, moderate: 3, vigorous: 4 },
        hiit: { light: 5, moderate: 8, vigorous: 12 },
        dancing: { light: 3, moderate: 5, vigorous: 7 }
    }

    const results = useMemo(() => {
        const weightKg = weight * 0.453592
        const met = activities[activity][intensity]
        const hours = duration / 60

        const caloriesBurned = met * weightKg * hours
        const caloriesPerMinute = caloriesBurned / duration

        // Calculate equivalent food items
        const pieceChocolate = Math.round(caloriesBurned / 50)
        const slicePizza = Math.round(caloriesBurned / 285)
        const cupRice = Math.round(caloriesBurned / 200)

        return { caloriesBurned, caloriesPerMinute, met, pieceChocolate, slicePizza, cupRice }
    }, [weight, activity, duration, intensity])

    return (
        <CalculatorLayout
            title="Calorie Burn Calculator"
            description="Calculate calories burned during exercise"
            category="Health"
            categoryPath="/health"
            icon={Flame}
            result={`${Math.round(results.caloriesBurned)}`}
            resultLabel="Calories Burned"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight (lbs)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={50} />
                </div>
                <div className="input-group">
                    <label className="input-label">Duration (minutes)</label>
                    <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Activity</label>
                    <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                        <option value="running">Running</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="walking">Walking</option>
                        <option value="weightlifting">Weight Lifting</option>
                        <option value="yoga">Yoga</option>
                        <option value="hiit">HIIT</option>
                        <option value="dancing">Dancing</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Intensity</label>
                    <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="vigorous">Vigorous</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Calories Burned</span>
                    <span className="result-detail-value" style={{ color: '#ef4444' }}>{Math.round(results.caloriesBurned)} cal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Calories per Minute</span>
                    <span className="result-detail-value">{results.caloriesPerMinute.toFixed(1)} cal/min</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">MET Value</span>
                    <span className="result-detail-value">{results.met}</span>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>EQUIVALENT TO</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>🍫</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{results.pieceChocolate}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>chocolates</div>
                    </div>
                    <div style={{ flex: 1, background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>🍕</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{results.slicePizza}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>pizza slices</div>
                    </div>
                    <div style={{ flex: 1, background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>🍚</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{results.cupRice}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>cups rice</div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CalorieBurnCalculator
