import { useState, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WaterIntakeCalculator() {
    const [weight, setWeight] = useState(70)
    const [unit, setUnit] = useState('kg')
    const [activityLevel, setActivityLevel] = useState('moderate')
    const [climate, setClimate] = useState('normal')

    const results = useMemo(() => {
        const weightKg = unit === 'lb' ? weight * 0.453592 : weight

        let baseIntake = weightKg * 35 // ml per kg

        const activityMultipliers = {
            sedentary: 0.9,
            light: 1.0,
            moderate: 1.1,
            active: 1.2,
            veryActive: 1.4
        }

        const climateMultipliers = {
            cold: 0.9,
            normal: 1.0,
            hot: 1.2,
            veryHot: 1.4
        }

        const dailyIntakeMl = baseIntake * activityMultipliers[activityLevel] * climateMultipliers[climate]
        const dailyIntakeLiters = dailyIntakeMl / 1000
        const dailyIntakeOz = dailyIntakeMl / 29.5735
        const glasses = Math.ceil(dailyIntakeMl / 250)

        return { dailyIntakeMl, dailyIntakeLiters, dailyIntakeOz, glasses }
    }, [weight, unit, activityLevel, climate])

    return (
        <CalculatorLayout
            title="Water Intake Calculator"
            description="Calculate your daily water intake needs"
            category="Health"
            categoryPath="/health"
            icon={Droplets}
            result={`${results.dailyIntakeLiters.toFixed(1)} L`}
            resultLabel="Daily Water Intake"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={1} max={300} />
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="lb">Pounds (lb)</option>
                    </select>
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Activity Level</label>
                    <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light Exercise</option>
                        <option value="moderate">Moderate Exercise</option>
                        <option value="active">Active</option>
                        <option value="veryActive">Very Active</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Climate</label>
                    <select value={climate} onChange={(e) => setClimate(e.target.value)}>
                        <option value="cold">Cold</option>
                        <option value="normal">Normal</option>
                        <option value="hot">Hot</option>
                        <option value="veryHot">Very Hot</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Liters</span>
                    <span className="result-detail-value">{results.dailyIntakeLiters.toFixed(1)} L</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Fluid Ounces</span>
                    <span className="result-detail-value">{results.dailyIntakeOz.toFixed(0)} oz</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Glasses (250ml)</span>
                    <span className="result-detail-value">{results.glasses} glasses</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WaterIntakeCalculator
