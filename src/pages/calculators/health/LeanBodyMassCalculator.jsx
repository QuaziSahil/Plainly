import { useState, useMemo } from 'react'
import { Scale } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LeanBodyMassCalculator() {
    const [weight, setWeight] = useState(180)
    const [height, setHeight] = useState(70) // inches
    const [gender, setGender] = useState('male')
    const [unit, setUnit] = useState('imperial')

    const results = useMemo(() => {
        let weightKg = unit === 'imperial' ? weight * 0.453592 : weight
        let heightCm = unit === 'imperial' ? height * 2.54 : height

        // Boer formula
        let lbm
        if (gender === 'male') {
            lbm = (0.407 * weightKg) + (0.267 * heightCm) - 19.2
        } else {
            lbm = (0.252 * weightKg) + (0.473 * heightCm) - 48.3
        }

        const fatMass = weightKg - lbm
        const bodyFatPercent = (fatMass / weightKg) * 100

        const lbmDisplay = unit === 'imperial' ? lbm / 0.453592 : lbm
        const fatMassDisplay = unit === 'imperial' ? fatMass / 0.453592 : fatMass

        return { lbm: lbmDisplay, fatMass: fatMassDisplay, bodyFatPercent }
    }, [weight, height, gender, unit])

    return (
        <CalculatorLayout
            title="Lean Body Mass Calculator"
            description="Calculate lean body mass vs fat"
            category="Health"
            categoryPath="/health"
            icon={Scale}
            result={`${results.lbm.toFixed(1)} ${unit === 'imperial' ? 'lbs' : 'kg'}`}
            resultLabel="Lean Body Mass"
        >
            <div className="input-group">
                <label className="input-label">Unit System</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="imperial">Imperial (lbs, inches)</option>
                    <option value="metric">Metric (kg, cm)</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Height ({unit === 'imperial' ? 'inches' : 'cm'})</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Lean Body Mass</span>
                    <span className="result-detail-value">{results.lbm.toFixed(1)} {unit === 'imperial' ? 'lbs' : 'kg'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Fat Mass</span>
                    <span className="result-detail-value">{results.fatMass.toFixed(1)} {unit === 'imperial' ? 'lbs' : 'kg'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Body Fat %</span>
                    <span className="result-detail-value">{results.bodyFatPercent.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default LeanBodyMassCalculator
