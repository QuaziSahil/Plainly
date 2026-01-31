import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TDEECalculator() {
    const [age, setAge] = useState(30)
    const [gender, setGender] = useState('male')
    const [weight, setWeight] = useState(70)
    const [height, setHeight] = useState(175)
    const [activityLevel, setActivityLevel] = useState('moderate')

    const results = useMemo(() => {
        let bmr
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        }

        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
        }

        const tdee = bmr * activityMultipliers[activityLevel]
        const weightLoss = tdee - 500
        const weightGain = tdee + 300

        return { bmr: Math.round(bmr), tdee: Math.round(tdee), weightLoss: Math.round(weightLoss), weightGain: Math.round(weightGain) }
    }, [age, gender, weight, height, activityLevel])

    return (
        <CalculatorLayout
            title="TDEE Calculator"
            description="Calculate Total Daily Energy Expenditure"
            category="Health"
            categoryPath="/health"
            icon={Activity}
            result={`${results.tdee}`}
            resultLabel="Daily Calories (TDEE)"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={15} max={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={30} max={300} />
                </div>
                <div className="input-group">
                    <label className="input-label">Height (cm)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={100} max={250} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Activity Level</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="veryActive">Very Active (hard exercise daily)</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">BMR</span>
                    <span className="result-detail-value">{results.bmr} cal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weight Loss (-500)</span>
                    <span className="result-detail-value">{results.weightLoss} cal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weight Gain (+300)</span>
                    <span className="result-detail-value">{results.weightGain} cal</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TDEECalculator
