import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function IdealWeightCalculator() {
    const [gender, setGender] = useState('male')
    const [height, setHeight] = useState(175)
    const [unit, setUnit] = useState('metric')

    const results = useMemo(() => {
        // Convert height to inches for formulas
        const heightInches = unit === 'metric' ? height / 2.54 : height
        const inchesOver5Feet = Math.max(0, heightInches - 60)

        // Various formulas
        const robinson = gender === 'male'
            ? 52 + 1.9 * inchesOver5Feet
            : 49 + 1.7 * inchesOver5Feet

        const miller = gender === 'male'
            ? 56.2 + 1.41 * inchesOver5Feet
            : 53.1 + 1.36 * inchesOver5Feet

        const devine = gender === 'male'
            ? 50 + 2.3 * inchesOver5Feet
            : 45.5 + 2.3 * inchesOver5Feet

        const hamwi = gender === 'male'
            ? 48 + 2.7 * inchesOver5Feet
            : 45.5 + 2.2 * inchesOver5Feet

        // BMI-based healthy range (18.5-24.9)
        const heightM = unit === 'metric' ? height / 100 : heightInches * 0.0254
        const bmiMin = 18.5 * heightM * heightM
        const bmiMax = 24.9 * heightM * heightM

        const average = (robinson + miller + devine + hamwi) / 4

        return {
            robinson: robinson.toFixed(1),
            miller: miller.toFixed(1),
            devine: devine.toFixed(1),
            hamwi: hamwi.toFixed(1),
            average: average.toFixed(1),
            bmiRange: `${bmiMin.toFixed(1)} - ${bmiMax.toFixed(1)}`
        }
    }, [gender, height, unit])

    return (
        <CalculatorLayout
            title="Ideal Weight Calculator"
            subtitle="Calculate your ideal body weight using multiple formulas"
            category="Health"
            categoryPath="/health"
            icon={Heart}
            result={`${results.average} kg`}
            resultLabel="Ideal Weight"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="metric">Metric (cm)</option>
                        <option value="imperial">Imperial (inches)</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={unit === 'metric' ? 100 : 39}
                    max={unit === 'metric' ? 250 : 98}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Robinson Formula</span>
                    <span className="result-detail-value">{results.robinson} kg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Miller Formula</span>
                    <span className="result-detail-value">{results.miller} kg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Devine Formula</span>
                    <span className="result-detail-value">{results.devine} kg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Hamwi Formula</span>
                    <span className="result-detail-value">{results.hamwi} kg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Healthy BMI Range</span>
                    <span className="result-detail-value">{results.bmiRange} kg</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default IdealWeightCalculator
