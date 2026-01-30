import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BMRCalculator() {
    const [age, setAge] = useState(30)
    const [gender, setGender] = useState('male')
    const [weight, setWeight] = useState(70)
    const [height, setHeight] = useState(175)
    const [formula, setFormula] = useState('mifflin')

    const results = useMemo(() => {
        let bmr

        if (formula === 'mifflin') {
            // Mifflin-St Jeor
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
            }
        } else {
            // Harris-Benedict
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
            }
        }

        return {
            bmr: Math.round(bmr),
            sedentary: Math.round(bmr * 1.2),
            light: Math.round(bmr * 1.375),
            moderate: Math.round(bmr * 1.55),
            active: Math.round(bmr * 1.725),
            veryActive: Math.round(bmr * 1.9)
        }
    }, [age, gender, weight, height, formula])

    const resultDetails = (
        <>
            <div className="result-row">
                <span className="result-row-label">Sedentary</span>
                <span className="result-row-value">{results.sedentary} cal</span>
            </div>
            <div className="result-row">
                <span className="result-row-label">Light Activity</span>
                <span className="result-row-value">{results.light} cal</span>
            </div>
            <div className="result-row">
                <span className="result-row-label">Moderate Activity</span>
                <span className="result-row-value">{results.moderate} cal</span>
            </div>
            <div className="result-row">
                <span className="result-row-label">Active</span>
                <span className="result-row-value">{results.active} cal</span>
            </div>
            <div className="result-row highlight">
                <span className="result-row-label">Very Active</span>
                <span className="result-row-value">{results.veryActive} cal</span>
            </div>
        </>
    )

    return (
        <CalculatorLayout
            title="BMR Calculator"
            description="Calculate your Basal Metabolic Rate"
            category="Health"
            categoryPath="/health"
            icon={Activity}
            result={`${results.bmr}`}
            resultLabel="BMR (calories/day)"
            resultDetails={resultDetails}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Age</label>
                    <input
                        className="input-field"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        min={15}
                        max={100}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select
                        className="select-field"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight (kg)</label>
                    <input
                        className="input-field"
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
                        className="input-field"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min={100}
                        max={250}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Formula</label>
                <select
                    className="select-field"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                >
                    <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                    <option value="harris">Harris-Benedict</option>
                </select>
            </div>
        </CalculatorLayout>
    )
}

export default BMRCalculator
