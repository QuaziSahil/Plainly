import { useState, useMemo } from 'react'
import { Apple } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MacroCalculator() {
    const [calories, setCalories] = useState(2000)
    const [goal, setGoal] = useState('maintain')
    const [dietType, setDietType] = useState('balanced')

    const results = useMemo(() => {
        let adjustedCalories = calories
        if (goal === 'lose') adjustedCalories = calories - 500
        if (goal === 'gain') adjustedCalories = calories + 300

        const macroRatios = {
            balanced: { protein: 0.30, carbs: 0.40, fat: 0.30 },
            lowCarb: { protein: 0.35, carbs: 0.25, fat: 0.40 },
            highProtein: { protein: 0.40, carbs: 0.35, fat: 0.25 },
            keto: { protein: 0.25, carbs: 0.05, fat: 0.70 }
        }

        const ratios = macroRatios[dietType]
        const protein = (adjustedCalories * ratios.protein) / 4
        const carbs = (adjustedCalories * ratios.carbs) / 4
        const fat = (adjustedCalories * ratios.fat) / 9

        return {
            adjustedCalories,
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
            proteinCal: Math.round(protein * 4),
            carbsCal: Math.round(carbs * 4),
            fatCal: Math.round(fat * 9)
        }
    }, [calories, goal, dietType])

    return (
        <CalculatorLayout
            title="Macro Calculator"
            description="Calculate your daily macronutrient needs"
            category="Health"
            categoryPath="/health"
            icon={Apple}
            result={`${results.adjustedCalories} cal`}
            resultLabel="Daily Calories"
        >
            <div className="input-group">
                <label className="input-label">Base Calories (TDEE)</label>
                <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} min={1000} max={5000} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Goal</label>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Build Muscle</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Diet Type</label>
                    <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
                        <option value="balanced">Balanced</option>
                        <option value="lowCarb">Low Carb</option>
                        <option value="highProtein">High Protein</option>
                        <option value="keto">Keto</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Protein</span>
                    <span className="result-detail-value">{results.protein}g ({results.proteinCal} cal)</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Carbohydrates</span>
                    <span className="result-detail-value">{results.carbs}g ({results.carbsCal} cal)</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Fat</span>
                    <span className="result-detail-value">{results.fat}g ({results.fatCal} cal)</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default MacroCalculator
