import { useState, useMemo } from 'react'
import { Dumbbell } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BodyFatCalculator() {
    const [gender, setGender] = useState('male')
    const [waist, setWaist] = useState(85)
    const [neck, setNeck] = useState(38)
    const [height, setHeight] = useState(175)
    const [hip, setHip] = useState(95)

    const results = useMemo(() => {
        let bodyFat

        if (gender === 'male') {
            // US Navy Formula for men
            bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
        } else {
            // US Navy Formula for women
            bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387
        }

        bodyFat = Math.max(0, Math.min(100, bodyFat))

        let category
        if (gender === 'male') {
            if (bodyFat < 6) category = 'Essential Fat'
            else if (bodyFat < 14) category = 'Athletes'
            else if (bodyFat < 18) category = 'Fitness'
            else if (bodyFat < 25) category = 'Average'
            else category = 'Obese'
        } else {
            if (bodyFat < 14) category = 'Essential Fat'
            else if (bodyFat < 21) category = 'Athletes'
            else if (bodyFat < 25) category = 'Fitness'
            else if (bodyFat < 32) category = 'Average'
            else category = 'Obese'
        }

        return { bodyFat: bodyFat.toFixed(1), category }
    }, [gender, waist, neck, height, hip])

    return (
        <CalculatorLayout
            title="Body Fat Calculator"
            subtitle="Estimate body fat percentage using US Navy method"
            category="Health"
            categoryPath="/health"
            icon={Dumbbell}
            result={`${results.bodyFat}%`}
            resultLabel="Body Fat"
        >
            <div className="input-group">
                <label className="input-label">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
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

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Waist (cm)</label>
                    <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(Number(e.target.value))}
                        min={50}
                        max={200}
                    />
                    <span className="input-hint">At navel level</span>
                </div>
                <div className="input-group">
                    <label className="input-label">Neck (cm)</label>
                    <input
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(Number(e.target.value))}
                        min={20}
                        max={80}
                    />
                    <span className="input-hint">Below larynx</span>
                </div>
            </div>

            {gender === 'female' && (
                <div className="input-group">
                    <label className="input-label">Hip (cm)</label>
                    <input
                        type="number"
                        value={hip}
                        onChange={(e) => setHip(Number(e.target.value))}
                        min={50}
                        max={200}
                    />
                    <span className="input-hint">At widest point</span>
                </div>
            )}

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Category</span>
                    <span className="result-detail-value">{results.category}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default BodyFatCalculator
