import { useState, useMemo } from 'react'
import { Flame } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CalorieCalculator() {
    const [age, setAge] = useState(30)
    const [gender, setGender] = useState('male')
    const [weight, setWeight] = useState(70)
    const [height, setHeight] = useState(175)
    const [activityLevel, setActivityLevel] = useState(1.55)
    const [goal, setGoal] = useState('maintain')

    const results = useMemo(() => {
        // Harris-Benedict BMR Formula
        let bmr
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
        }

        const tdee = bmr * activityLevel

        let targetCalories
        switch (goal) {
            case 'lose':
                targetCalories = tdee - 500
                break
            case 'gain':
                targetCalories = tdee + 500
                break
            default:
                targetCalories = tdee
        }

        return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(targetCalories) }
    }, [age, gender, weight, height, activityLevel, goal])

    return (
        <CalculatorLayout
            title="Calorie Calculator"
            subtitle="Estimate your daily caloric needs"
            category="Health"
            categoryPath="/health"
            icon={Flame}
            result={`${results.target}`}
            resultLabel="Target Calories"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        min={15}
                        max={100}
                    />
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
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        min={30}
                        max={300}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Height (cm)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min={100}
                        max={250}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Activity Level</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))}>
                    <option value={1.2}>Sedentary (office job)</option>
                    <option value={1.375}>Light (1-3 days/week)</option>
                    <option value={1.55}>Moderate (3-5 days/week)</option>
                    <option value={1.725}>Active (6-7 days/week)</option>
                    <option value={1.9}>Very Active (physical job)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                    <option value="lose">Lose Weight (-500 cal)</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight (+500 cal)</option>
                </select>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">BMR (Basal Metabolic Rate)</span>
                    <span className="result-detail-value">{results.bmr} cal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">TDEE (Maintenance)</span>
                    <span className="result-detail-value">{results.tdee} cal</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CalorieCalculator
